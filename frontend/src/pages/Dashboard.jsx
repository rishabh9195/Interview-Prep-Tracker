import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/');
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>Interview Prep Tracker 🎯</h1>
        <div style={styles.navRight}>
          <span style={styles.username}>👋 {user.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>

        {/* Welcome */}
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>Welcome back, {user.name}! 💪</h2>
          <p style={styles.welcomeSubtitle}>Keep up the momentum — consistency is key to cracking interviews!</p>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>0</div>
            <div style={styles.statLabel}>Questions Solved</div>
          </div>
          <div style={{...styles.statCard, borderColor: '#7c3aed'}}>
            <div style={{...styles.statNumber, color: '#a78bfa'}}>0</div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
          <div style={{...styles.statCard, borderColor: '#059669'}}>
            <div style={{...styles.statNumber, color: '#34d399'}}>0%</div>
            <div style={styles.statLabel}>Completion</div>
          </div>
        </div>

        {/* Topics */}
        <h3 style={styles.sectionTitle}>📚 Topics</h3>
        <div style={styles.topicsGrid}>
          {['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Graphs'].map((topic) => (
            <div key={topic} style={styles.topicCard}>
              <div style={styles.topicName}>{topic}</div>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: '0%'}}></div>
              </div>
              <div style={styles.topicStats}>0 / 10 solved</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#030712' },
  navbar: {
    backgroundColor: '#111827',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #1f2937',
  },
  logo: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  username: { color: '#9ca3af' },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #374151',
    color: '#9ca3af',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  main: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
  welcomeCard: {
    backgroundColor: '#1e3a5f',
    border: '1px solid #2563eb',
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '32px',
  },
  welcomeTitle: { color: 'white', fontSize: '24px', fontWeight: 'bold' },
  welcomeSubtitle: { color: '#93c5fd', marginTop: '8px' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#111827',
    border: '1px solid #2563eb',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
  },
  statNumber: { fontSize: '36px', fontWeight: 'bold', color: '#60a5fa' },
  statLabel: { color: '#9ca3af', marginTop: '8px' },
  sectionTitle: { color: 'white', fontSize: '20px', marginBottom: '16px' },
  topicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  topicCard: {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '20px',
  },
  topicName: { color: 'white', fontWeight: '600', marginBottom: '12px' },
  progressBar: {
    backgroundColor: '#1f2937',
    borderRadius: '999px',
    height: '8px',
    marginBottom: '8px',
  },
  progressFill: {
    backgroundColor: '#2563eb',
    borderRadius: '999px',
    height: '8px',
  },
  topicStats: { color: '#6b7280', fontSize: '13px' },
};

export default Dashboard;