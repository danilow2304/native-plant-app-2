import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, setToken } from './api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dest = location.state?.from?.pathname || '/admin';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { token } = await login(username, password);
      setToken(token);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: '4rem auto' }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required maxLength={50} />
        </label>
        <label>Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
      </form>
    </main>
  );
}
