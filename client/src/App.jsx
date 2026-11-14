import { useState, useEffect } from "react";
import { getPlants, addPlant, updatePlant, deletePlant } from "./api";
import PlantForm from "./components/PlantForm";
import "./App.css";

export default function App() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [editingPlant, setEditingPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlants = async (q = "") => {
    try {
      setLoading(true);
      setPlants(await getPlants(q));
      setError("");
    } catch {
      setError("Could not reach the API. Is the Express server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants(search);
  }, [search]);

  const handleSave = async (plant) => {
    if (editingPlant) {
      await updatePlant(editingPlant._id, plant);
      setEditingPlant(null);
    } else {
      await addPlant(plant);
    }
    loadPlants(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plant?")) return;
    await deletePlant(id);
    loadPlants(search);
  };

  return (
    <div className="app">
      <h1>Native Plant App</h1>

      <input
        className="search"
        placeholder="Search by name, scientific name, or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <PlantForm
        editingPlant={editingPlant}
        onSave={handleSave}
        onCancel={() => setEditingPlant(null)}
      />

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && plants.length === 0 && <p>No plants found.</p>}

      <div className="plant-grid">
        {plants.map((p) => (
          <div className="plant-card" key={p._id}>
            <h3>{p.name}</h3>
            <em>{p.scientificName}</em>
            <p>{p.description}</p>
            <p><strong>Sunlight:</strong> {p.sunlight} | <strong>Soil:</strong> {p.soil}</p>
            <p><strong>Bloom:</strong> {p.bloomSeason}</p>
            <button onClick={() => setEditingPlant(p)}>Edit</button>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}