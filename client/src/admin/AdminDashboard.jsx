import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listPlants, deletePlant, clearToken } from './api';

export default function AdminDashboard() {
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function load() {
    try {
      setPlants(await listPlants());
    } catch (err) {
      if (err.status === 401) return navigate('/admin/login', { replace: true });
      setError(err.message);
    }
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(plant) {
    if (!window.confirm(`Delete "${plant.name}"? This cannot be undone.`)) return;
    try {
      await deletePlant(plant._id);
      setPlants((prev) => prev.filter((p) => p._id !== plant._id));
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    clearToken();
    navigate('/admin/login', { replace: true });
  }

  return (
    <main style={{ maxWidth: 900, margin: '2rem auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Plant Administration</h1>
        <div>
          <Link to="/admin/plants/new"><button>+ Add Plant</button></Link>{' '}
          <button onClick={logout}>Log out</button>
        </div>
      </header>
      {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}
      <table width="100%" cellPadding="6">
        <thead>
          <tr><th align="left">Name</th><th align="left">Scientific name</th><th align="left">Sunlight</th><th align="left">Bloom</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {plants.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td><em>{p.scientificName}</em></td>
              <td>{p.sunlight}</td>
              <td>{p.bloomSeason}</td>
              <td align="center">
                <Link to={`/admin/plants/${p._id}`}>View</Link>{' | '}
                <Link to={`/admin/plants/${p._id}/edit`}>Edit</Link>{' | '}
                <button onClick={() => handleDelete(p)}>Delete</button>
              </td>
            </tr>
          ))}
          {plants.length === 0 && <tr><td colSpan="5">No plants yet.</td></tr>}
        </tbody>
      </table>
    </main>
  );
}
