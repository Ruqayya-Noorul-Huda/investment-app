import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandContent}>
          <h1 style={styles.brandTitle}>💰 InvestSmart</h1>
          <p style={styles.brandSubtitle}>Your AI-powered investment advisor</p>
          <div style={styles.featureList}>
            <div style={styles.feature}>✨ Personalized investment suggestions</div>
            <div style={styles.feature}>📊 Based on your budget & interests</div>
            <div style={styles.feature}>🤖 Powered by AI</div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back! 👋</h2>
          <p style={styles.subtitle}>Login to your account</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? '⏳ Logging in...' : 'Login →'}
            </button>
          </form>

          <p style={styles.link}>
            Don't have an account? <Link to="/register" style={styles.linkText}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  brandContent: {
    color: 'white',
    maxWidth: '400px',
  },
  brandTitle: {
    fontSize: '42px',
    fontWeight: '800',
    margin: '0 0 16px',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  brandSubtitle: {
    fontSize: '18px',
    opacity: '0.9',
    margin: '0 0 40px',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  feature: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '14px 20px',
    borderRadius: '12px',
    fontSize: '16px',
    backdropFilter: 'blur(10px)',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9ff',
    padding: '40px',
  },
  card: {
    backgroundColor: 'white',
    padding: '48px',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a1a2e',
  },
  subtitle: {
    margin: '0 0 32px',
    color: '#888',
    fontSize: '16px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#444',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '2px solid #eee',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 8px 20px rgba(102,126,234,0.4)',
  },
  errorBox: {
    backgroundColor: '#fff0f0',
    border: '1px solid #ffcccc',
    color: '#cc0000',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  link: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#888',
    fontSize: '14px',
  },
  linkText: {
    color: '#667eea',
    fontWeight: '700',
    textDecoration: 'none',
  },
};