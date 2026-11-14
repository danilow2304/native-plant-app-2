const BASE = "http://localhost:5001/api/plants";

export const getPlants = async (q = "") => {
  const res = await fetch(`${BASE}?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error("Failed to load plants");
  return res.json();
};

export const addPlant = async (plant) => {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plant),
  });
  if (!res.ok) throw new Error("Failed to add plant");
  return res.json();
};

export const updatePlant = async (id, plant) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plant),
  });
  if (!res.ok) throw new Error("Failed to update plant");
  return res.json();
};

export const deletePlant = async (id) => {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete plant");
  return res.json();
};