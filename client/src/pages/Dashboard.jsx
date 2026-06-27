import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getSuggestions } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchProfile();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError('');
    setSuggestions('');
    try {
      const res = await getSuggestions();
      setSuggestions(res.data.suggestions);
    } catch (err) {
      setError('Could not get suggestions. Try again.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getRiskColor = (risk) => {
    if (risk === 'low') return '#22c55e';
    if (risk === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  if (!user) return (
    <div style={styles.loadingScreen}>
      <div style={styles.loadingText}>⏳ Loading your dashboard...</div>
    </div>
  );

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>💰 InvestSmart</h2>
        <div style={styles.headerRight}>
          <span style={styles.welcomeText}>Hello, {user.name}! 👋</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>💵</div>
            <div style={styles.statValue}>₹{Number(user.budget).toLocaleString()}</div>
            <div style={styles.statLabel}>Investment Budget</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>🎯</div>
            <div style={styles.statValue}>{user.interests.length}</div>
            <div style={styles.statLabel}>Interests Selected</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>⚖️</div>
            <div style={{ ...styles.statValue, color: getRiskColor(user.riskLevel) }}>
              {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)}
            </div>
            <div style={styles.statLabel}>Risk Level</div>
          </div>
        </div>

        <div style={styles.mainGrid}>

          {/* Profile Card */}
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={styles.profileName}>{user.name}</h3>
                <p style={styles.profileEmail}>{user.email}</p>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.profileDetail}>
              <span style={styles.detailLabel}>Budget</span>
              <span style={styles.detailValue}>₹{Number(user.budget).toLocaleString()}</span>
            </div>
            <div style={styles.profileDetail}>
              <span style={styles.detailLabel}>Risk Level</span>
              <span style={{
                ...styles.detailValue,
                color: getRiskColor(user.riskLevel),
                fontWeight: '700'
              }}>
                {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)}
              </span>
            </div>
            <div style={styles.profileDetail}>
              <span style={styles.detailLabel}>Interests</span>
            </div>
            <div style={styles.interestTags}>
              {user.interests.map((interest) => (
                <span key={interest} style={styles.tag}>{interest}</span>
              ))}
            </div>

            <button
              onClick={() => navigate('/onboarding')}
              style={styles.editBtn}
            >
              ✏️ Edit Profile
            </button>
          </div>

          {/* AI Suggestions Card */}
          <div style={styles.suggestionsCard}>
            <div style={styles.suggestionsHeader}>
              <div>
                <h3 style={styles.suggestionsTitle}>🤖 AI Investment Suggestions</h3>
                <p style={styles.suggestionsSubtitle}>
                  Personalized just for you based on your profile
                </p>
              </div>
            </div>

            {!suggestions && !loading && (
              <div style={styles.emptyState}>
                <div style={styles.emptyEmoji}>✨</div>
                <p style={styles.emptyText}>
                  Click the button below to get your personalized investment suggestions powered by AI!
                </p>
                <button onClick={fetchSuggestions} style={styles.suggestBtn}>
                  🚀 Get My Suggestions
                </button>
              </div>
            )}

            {loading && (
              <div style={styles.emptyState}>
                <div style={styles.loadingEmoji}>⏳</div>
                <p style={styles.emptyText}>AI is analyzing your profile and generating personalized suggestions...</p>
              </div>
            )}

            {error && (
              <div style={styles.errorBox}>
                <p>{error}</p>
                <button onClick={fetchSuggestions} style={styles.retryBtn}>
                  🔄 Try Again
                </button>
              </div>
            )}

            {suggestions && (
              <div>
                <div style={styles.suggestionsBox}>
                  {suggestions.split('\n').map((line, i) => (
                    line.trim() && (
                      <p key={i} style={{
                        ...styles.suggestionLine,
                        ...(line.startsWith('#') || /^\d\./.test(line) ? styles.suggestionTitle : {})
                      }}>
                        {line.replace(/^#+\s/, '')}
                      </p>
                    )
                  ))}
                </div>
                <button onClick={fetchSuggestions} style={styles.refreshBtn}>
                  🔄 Regenerate Suggestions
                </button>
              </div>
            )}
          </div>

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
  loadingScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9ff',
  },
  loadingText: {
    fontSize: '20px',
    color: '#667eea',
    fontWeight: '600',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '16px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(102,126,234,0.3)',
  },
  headerTitle: {
    color: 'white',
    margin: 0,
    fontSize: '24px',
    fontWeight: '800',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '15px',
    fontWeight: '600',
  },
  logoutBtn: {
    padding: '8px 20px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  content: {
    maxWidth: '1100px',
    margin: '32px auto',
    padding: '0 24px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    textAlign: 'center',
  },
  statEmoji: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#888',
    fontWeight: '600',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '24px',
  },
  profileCard: {
    backgroundColor: 'white',
    padding: '28px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    height: 'fit-content',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '800',
    flexShrink: 0,
  },
  profileName: {
    margin: '0 0 4px',
    fontSize: '18px',
    fontWeight: '800',
    color: '#1a1a2e',
  },
  profileEmail: {
    margin: 0,
    fontSize: '13px',
    color: '#888',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f0f0f0',
    marginBottom: '20px',
  },
  profileDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  detailLabel: {
    fontSize: '14px',
    color: '#888',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  interestTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px',
  },
  tag: {
    padding: '6px 12px',
    background: 'linear-gradient(135deg, #667eea20, #764ba220)',
    color: '#667eea',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  editBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f8f9ff',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
  },
  suggestionsCard: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  suggestionsHeader: {
    marginBottom: '24px',
  },
  suggestionsTitle: {
    margin: '0 0 8px',
    fontSize: '20px',
    fontWeight: '800',
    color: '#1a1a2e',
  },
  suggestionsSubtitle: {
    margin: 0,
    color: '#888',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyEmoji: {
    fontSize: '56px',
    marginBottom: '16px',
  },
  loadingEmoji: {
    fontSize: '56px',
    marginBottom: '16px',
  },
  emptyText: {
    color: '#888',
    fontSize: '16px',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  suggestBtn: {
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(102,126,234,0.4)',
  },
  errorBox: {
    backgroundColor: '#fff0f0',
    border: '1px solid #ffcccc',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#cc0000',
  },
  retryBtn: {
    padding: '10px 24px',
    backgroundColor: '#cc0000',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '8px',
  },
  suggestionsBox: {
    backgroundColor: '#f8f9ff',
    borderRadius: '16px',
    padding: '24px',
    borderLeft: '4px solid #667eea',
    marginBottom: '20px',
    lineHeight: '1.8',
  },
  suggestionLine: {
    margin: '4px 0',
    color: '#333',
    fontSize: '15px',
  },
  suggestionTitle: {
    fontWeight: '800',
    color: '#1a1a2e',
    fontSize: '16px',
    marginTop: '16px',
  },
  refreshBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(102,126,234,0.3)',
  },
};