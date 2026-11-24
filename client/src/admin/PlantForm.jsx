import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPlant, createPlant, updatePlant } from './api';

const FIELDS = [
  ['name', 'Common name *'], ['scientificName', 'Scientific name'], ['sunlight', 'Sunlight'], ['soil', 'Soil'],
  ['water', 'Water'], ['height', 'Height'], ['bloomSeason', 'Bloom season'], ['nativeRange', 'Native range'],
  ['wildlifeBenefits', 'Wildlife benefits'], ['image', 'Image URL (https://…)'],
];
const EMPTY = Object.fromEntries([...FIELDS.map(([k]) => [k, '']), ['description', '']]);

// Used for Add (/admin/plants/new) and Edit (/admin/plants/:id/edit).
export default function PlantForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!editing) return;
    getPlant(id)
      .then((p) => setForm(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, p[k] ?? '']))))
      .catch((err) => setErrors([err.message]));
  }, [id, editing]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    try {
      editing ? await updatePlant(id, form) : await createPlant(form);
      navigate('/admin');
    } catch (err) {
      if (err.status === 401) return navigate('/admin/login', { replace: true });
      setErrors(err.details ? err.details.map((d) => `${d.field}: ${d.message}`) : [err.message]);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>{editing ? 'Edit Plant' : 'Add Plant'}</h1>
      <form onSubmit={handleSubmit}>
        {FIELDS.map(([name, label]) => (
          <label key={name} style={{ display: 'block', marginBottom: 8 }}>{label}
            <input name={name} value={form[name]} onChange={change} required={name === 'name'} style={{ display: 'block', width: '100%' }} />
          </label>
        ))}
        <label style={{ display: 'block', marginBottom: 8 }}>Description
          <textarea name="description" value={form.description} onChange={change} rows={5} maxLength={2000} style={{ display: 'block', width: '100%' }} />
        </label>
        {errors.length > 0 && <ul role="alert" style={{ color: 'crimson' }}>{errors.map((m, i) => <li key={i}>{m}</li>)}</ul>}
        <button type="submit">{editing ? 'Save changes' : 'Add plant'}</button>{' '}
        <Link to="/admin">Cancel</Link>
      </form>
    </main>
  );
}
