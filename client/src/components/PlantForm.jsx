import { useState, useEffect } from "react";

const emptyPlant = {
  name: "",
  scientificName: "",
  description: "",
  sunlight: "",
  soil: "",
  water: "",
  height: "",
  bloomSeason: "",
  nativeRange: "",
  wildlifeBenefits: "",
  image: "",
};

export default function PlantForm({ editingPlant, onSave, onCancel }) {
  const [form, setForm] = useState(emptyPlant);

  // When the user clicks Edit, fill the form with that plant's data
  useEffect(() => {
    setForm(editingPlant || emptyPlant);
  }, [editingPlant]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm(emptyPlant);
  };

  return (
    <form onSubmit={handleSubmit} className="plant-form">
      <h2>{editingPlant ? "Edit Plant" : "Add Plant"}</h2>

      {Object.keys(emptyPlant).map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={form[field] || ""}
          onChange={handleChange}
          required={field === "name" || field === "scientificName"}
        />
      ))}

      <div>
        <button type="submit">{editingPlant ? "Update" : "Add"}</button>
        {editingPlant && (
          <button type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}