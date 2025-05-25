'use client';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [apiData, setApiData] = useState<any>(null);
  const [testData, setTestData] = useState<any>(null);
  const [directApiData, setDirectApiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [browserInfo, setBrowserInfo] = useState<any>({});
  const [loading, setLoading] = useState({
    api: true,
    test: true,
    directApi: true
  });

  useEffect(() => {
    // Browser bilgilerini topla
    if (typeof window !== 'undefined') {
      setBrowserInfo({
        origin: window.location.origin,
        host: window.location.host,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        href: window.location.href,
        userAgent: navigator.userAgent
      });
    }
    
    // Test API (window.location.origin ile)
    async function testAPI() {
      try {
        console.log('🧪 Debug: Testing API with window.location.origin...');
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${baseUrl}/api/dictionary/search?q=&limit=10`;
        console.log('📞 API URL:', url);
        
        const response = await fetch(url);
        console.log('📞 API Response:', response.status, response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error Text:', errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📦 API Data:', data);
        
        setApiData(data);
      } catch (err: any) {
        console.error('💥 API Error:', err);
        setError(prev => prev ? `${prev}

API Error: ${err.message}` : `API Error: ${err.message}`);
      } finally {
        setLoading(prev => ({...prev, api: false}));
      }
    }
    
    // Test API (göreceli URL ile)
    async function testDirectAPI() {
      try {
        console.log('🧪 Debug: Testing API with relative URL...');
        const url = '/api/dictionary/search?q=&limit=10';
        console.log('📞 Direct API URL:', url);
        
        const response = await fetch(url);
        console.log('📞 Direct API Response:', response.status, response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Direct API Error Text:', errorText);
          throw new Error(`Direct API Error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📦 Direct API Data:', data);
        
        setDirectApiData(data);
      } catch (err: any) {
        console.error('💥 Direct API Error:', err);
        setError(prev => prev ? `${prev}

Direct API Error: ${err.message}` : `Direct API Error: ${err.message}`);
      } finally {
        setLoading(prev => ({...prev, directApi: false}));
      }
    }
    
    // Test MongoDB Connection
    async function testMongoConnection() {
      try {
        console.log('🧪 Debug: Testing MongoDB connection...');
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${baseUrl}/api/test`;
        console.log('📞 Test URL:', url);
        
        const response = await fetch(url);
        console.log('📞 Test Response:', response.status, response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Test Error Text:', errorText);
          throw new Error(`Test Error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📦 Test Data:', data);
        
        setTestData(data);
      } catch (err: any) {
        console.error('💥 Test Error:', err);
        setError(prev => prev ? `${prev}

Test Error: ${err.message}` : `Test Error: ${err.message}`);
      } finally {
        setLoading(prev => ({...prev, test: false}));
      }
    }

    testAPI();
    testDirectAPI();
    testMongoConnection();
  }, []);

  const isLoading = loading.api || loading.test || loading.directApi;
  
  if (isLoading) return <div style={{ padding: '20px', fontFamily: 'monospace' }}>Testing APIs...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Information</h1>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
          <h2>❌ Error</h2>
          {error}
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2>🌐 Browser Information</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(browserInfo, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2>🔍 MongoDB Connection Test</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2>🔎 Dictionary API Test (window.location.origin)</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(apiData, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2>🔎 Dictionary API Test (göreceli URL)</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(directApiData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}