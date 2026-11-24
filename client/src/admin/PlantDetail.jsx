import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlant } from './api';

export default function PlantDetail() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { getPlant(id).then(setPlant).catch((e) => setError(e.message)); }, [id]);

  if (error) return <p role="alert">{error}</p>;
  if (!plant) return <p>Loading…</p>;

  const rows = [['Scientific name', 'scientificName'], ['Description', 'description'], ['Sunlight', 'sunlight'], ['Soil', 'soil'],
    ['Water', 'water'], ['Height', 'height'], ['Bloom season', 'bloomSeason'], ['Native range', 'nativeRange'], ['Wildlife benefits', 'wildlifeBenefits']];

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>{plant.name}</h1>
      {plant.image && <img src={plant.image} alt={plant.name} style={{ maxWidth: 300 }} />}
      <dl>{rows.map(([label, key]) => (<div key={key}><dt><strong>{label}</strong></dt><dd>{plant[key] || '—'}</dd></div>))}</dl>
      <Link to={`/admin/plants/${plant._id}/edit`}>Edit</Link>{' | '}<Link to="/admin">Back</Link>
    </main>
  );
}
