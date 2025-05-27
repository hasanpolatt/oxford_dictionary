'use client';

// Generic cache service for the application

// Default cache expiry time (5 minutes)
export const DEFAULT_CACHE_EXPIRY = 5 * 60 * 1000;

// Cache item interface
export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Cache service class
class CacheService {
  private static instance: CacheService;
  private caches: Record<string, Record<string, CacheItem<any>>> = {};

  private constructor() {
    // Load caches from localStorage when service is initialized
    if (typeof window !== 'undefined') {
      this.loadCachesFromStorage();
    }
  }

  // Singleton pattern
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Initialize a specific cache namespace
  public initCache(namespace: string): void {
    if (!this.caches[namespace]) {
      try {
        const savedCache = localStorage.getItem(`cache_${namespace}`);
        if (savedCache) {
          const parsedCache = JSON.parse(savedCache);
          // Clean expired items
          const now = Date.now();
          const validCache = Object.entries(parsedCache).reduce((acc, [key, value]: [string, any]) => {
            if (now - value.timestamp < DEFAULT_CACHE_EXPIRY) {
              acc[key] = value;
            }
            return acc;
          }, {} as Record<string, CacheItem<any>>);
          
          this.caches[namespace] = validCache;
        } else {
          this.caches[namespace] = {};
        }
      } catch (error) {
        console.error(`Cache initialization failed for ${namespace}:`, error);
        this.caches[namespace] = {};
      }
    }
  }

  // Get item from cache
  public getItem<T>(namespace: string, key: string): T | null {
    if (!this.caches[namespace]) {
      this.initCache(namespace);
    }

    const cacheItem = this.caches[namespace][key];
    if (!cacheItem) return null;

    const now = Date.now();
    if (now - cacheItem.timestamp < DEFAULT_CACHE_EXPIRY) {
      return cacheItem.data as T;
    }

    // Remove expired item
    delete this.caches[namespace][key];
    this.saveCache(namespace);
    return null;
  }

  // Set item in cache
  public setItem<T>(namespace: string, key: string, data: T): void {
    if (!this.caches[namespace]) {
      this.initCache(namespace);
    }

    this.caches[namespace][key] = {
      data,
      timestamp: Date.now()
    };

    this.saveCache(namespace);
  }

  // Clear specific cache namespace
  public clearCache(namespace: string): void {
    this.caches[namespace] = {};
    localStorage.removeItem(`cache_${namespace}`);
  }

  // Clear all caches
  public clearAllCaches(): void {
    this.caches = {};
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Save cache to localStorage
  private saveCache(namespace: string): void {
    try {
      localStorage.setItem(`cache_${namespace}`, JSON.stringify(this.caches[namespace]));
    } catch (error) {
      console.error(`Cache saving failed for ${namespace}:`, error);
    }
  }

  // Load all caches from localStorage
  private loadCachesFromStorage(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        const namespace = key.replace('cache_', '');
        this.initCache(namespace);
      }
    });
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

// React hook for using cache
export function useCache<T>(namespace: string) {
  return {
    getItem: (key: string) => cacheService.getItem<T>(namespace, key),
    setItem: (key: string, data: T) => cacheService.setItem<T>(namespace, key, data),
    clearCache: () => cacheService.clearCache(namespace)
  };
}
