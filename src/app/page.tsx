import { fetchInitialWords } from '../lib/api-client';
import HomePage from '../components/HomePage';

export default async function Page() {
  try {
    const initialData = await fetchInitialWords();
    return <HomePage initialData={initialData} />;
  } catch (error) {
    return (
      <div className="error-container">
        <h1>Error Loading Data</h1>
        <p>Failed to load dictionary data. Please try again later.</p>
      </div>
    );
  }
}