import HomePage from '../components/HomePage';
import { getAllWords } from '../lib/data-service';

export default async function Page() {
  try {
    // Veri erişim katmanını kullanarak verileri getir
    const initialData = await getAllWords();
    
    return <HomePage initialData={initialData} />;
  } catch (error) {
    console.error('Error loading data:', error);
    return (
      <div className="error-container">
        <h1>Error Loading Data</h1>
        <p>Failed to load dictionary data. Please try again later.</p>
      </div>
    );
  }
}