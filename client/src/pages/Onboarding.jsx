import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../api';

const interestOptions = [
  { label: '📈 Stocks', value: 'Stocks' },
  { label: '🪙 Crypto', value: 'Crypto' },
  { label: '🥇 Gold', value: 'Gold' },
  { label: '🏠 Real Estate', value: 'Real Estate' },
  { label: '💼 Mutual Funds', value: 'Mutual Funds' },
  { label: '🏦 Fixed Deposits', value: 'Fixed Deposits' },
];

const riskOptions = [
  { value: 'low', label: '🟢 Low', desc: 'I prefer safe investments' },
  { value: 'medium', label: '🟡 Medium', desc: 'Balanced approach' },
  { value: 'high', label: '🔴 High', desc: 'I want maximum returns' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ budget: '', interests: [], riskLevel: 'low' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const toggleInterest = (value) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }
    setLoading(true);
    try {
      await updateProfile(form);
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong, try again');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>💰 InvestSmart</h2>
        <div style={styles.stepIndicator}>
          <div style={{ ...styles.step, ...(step >= 1 ? styles.stepActive : {}) }}>1</div>
          <div style={styles.stepLine} />
          <div style={{ ...styles.step, ...(step >= 2 ? styles.stepActive : {}) }}>2</div>
          <div style={styles.stepLine} />
          <div style={{ ...styles.step, ...(step >= 3 ? styles.stepActive : {}) }}>3</div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>

          {/* Step 1 - Budget */}
          {step === 1 && (
            <div>
              <div style={styles.stepEmoji}>💵</div>
              <h2 style={styles.title}>What's your investment budget?</h2>
              <p style={styles.subtitle}>Enter the amount you want to invest</p>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Budget (₹)</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>

              <button
                style={styles.button}
                onClick={() => {
                  if (!form.budget) {
                    setError('Please enter your budget');
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
              >
                Next →
              </button>
              {error && <p style={styles.error}>{error}</p>}
            </div>
          )}

          {/* Step 2 - Interests */}
          {step === 2 && (
            <div>
              <div style={styles.stepEmoji}>🎯</div>
              <h2 style={styles.title}>What are you interested in?</h2>
              <p style={styles.subtitle}>Select all that apply</p>

              <div style={styles.interestGrid}>
                {interestOptions.map((interest) => (
                  <button
                    key={interest.value}
                    type="button"
                    onClick={() => toggleInterest(interest.value)}
                    style={{
                      ...styles.interestBtn,
                      ...(form.interests.includes(interest.value) ? styles.interestBtnActive : {})
                    }}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>

              <div style={styles.buttonRow}>
                <button style={styles.backButton} onClick={() => setStep(1)}>← Back</button>
                <button
                  style={styles.button}
                  onClick={() => {
                    if (form.interests.length === 0) {
                      setError('Please select at least one interest');
                      return;
                    }
                    setError('');
                    setStep(3);
                  }}
                >
                  Next →
                </button>
              </div>
              {error && <p style={styles.error}>{error}</p>}
            </div>
          )}

          {/* Step 3 - Risk Level */}
          {step === 3 && (
            <div>
              <div style={styles.stepEmoji}>⚖️</div>
              <h2 style={styles.title}>What's your risk appetite?</h2>
              <p style={styles.subtitle}>Choose your investment style</p>

              <div style={styles.riskGrid}>
                {riskOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, riskLevel: option.value })}
                    style={{
                      ...styles.riskBtn,
                      ...(form.riskLevel === option.value ? styles.riskBtnActive : {})
                    }}
                  >
                    <span style={styles.riskLabel}>{option.label}</span>
                    <span style={styles.riskDesc}>{option.desc}</span>
                  </button>
                ))}
              </div>

              <div style={styles.buttonRow}>
                <button style={styles.backButton} onClick={() => setStep(2)}>← Back</button>
                <button style={styles.button} onClick={handleSubmit} disabled={loading}>
                  {loading ? '⏳ Saving...' : '🚀 Get Suggestions!'}
                </button>
              </div>
              {error && <p style={styles.error}>{error}</p>}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9ff',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    margin: 0,
    fontSize: '22px',
    fontWeight: '800',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  step: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
  },
  stepActive: {
    backgroundColor: 'white',
    color: '#667eea',
  },
  stepLine: {
    width: '40px',
    height: '2px',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  content: {
    maxWidth: '600px',
    margin: '60px auto',
    padding: '0 20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '48px',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
  },
  stepEmoji: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '26px',
    fontWeight: '800',
    color: '#1a1a2e',
  },
  subtitle: {
    margin: '0 0 32px',
    color: '#888',
    fontSize: '16px',
  },
  inputGroup: {
    marginBottom: '24px',
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
    fontSize: '18px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  interestGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '32px',
  },
  interestBtn: {
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #eee',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    color: '#444',
    transition: 'all 0.2s',
  },
  interestBtnActive: {
    border: '2px solid #667eea',
    backgroundColor: '#f0f0ff',
    color: '#667eea',
  },
  riskGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  riskBtn: {
    padding: '16px 20px',
    borderRadius: '12px',
    border: '2px solid #eee',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    transition: 'all 0.2s',
  },
  riskBtnActive: {
    border: '2px solid #667eea',
    backgroundColor: '#f0f0ff',
  },
  riskLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  riskDesc: {
    fontSize: '13px',
    color: '#888',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    flex: 1,
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(102,126,234,0.4)',
  },
  backButton: {
    padding: '16px 24px',
    backgroundColor: '#f0f0ff',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  error: {
    color: '#cc0000',
    marginTop: '12px',
    fontSize: '14px',
  },
};