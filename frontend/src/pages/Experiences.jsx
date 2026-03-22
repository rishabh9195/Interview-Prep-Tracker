import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    company: '', role: '', difficulty: 'Medium', result: 'Pending', description: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/experiences');
      setExperiences(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/experiences', {
        ...form, userId: user.id
      });
      setShowForm(false);
      setForm({ company: '', role: '', difficulty: 'Medium', result: 'Pending', description: '' });
      fetchExperiences();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getResultColor = (result) => {
    if (result === 'Selected') return '#059669';
    if (result === 'Rejected') return '#dc2626';
    return '#d97706';
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return '#34d399';
    if (diff === 'Medium') return '#fbbf24';
    return '#f87171';
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>Interview Prep Tracker 🎯</h1>
        <div style={styles.navRight}>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          <span style={styles.username}>👋 {user?.name}</span>
          <button onClick={() => { localStorage.clear(); navigate('/'); }} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Interview Experiences 💼</h2>
            <p style={styles.subtitle}>Learn from real interview experiences shared by the community</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? 'Cancel' : '+ Share Experience'}
          </button>
        </div>

        {/* Add Experience Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Share Your Experience</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Company</label>
                  <input
                    style={styles.input}
                    placeholder="e.g. Google, Amazon"
                    value={form.company}
                    onChange={e => setForm({...form, company: e.target.value})}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Role</label>
                  <input
                    style={styles.input}
                    placeholder="e.g. SDE-1, Intern"
                    value={form.role}
                    onChange={e => setForm({...form, role: e.target.value})}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Difficulty</label>
                  <select
                    style={styles.input}
                    value={form.difficulty}
                    onChange={e => setForm({...form, difficulty: e.target.value})}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Result</label>
                  <select
                    style={styles.input}
                    value={form.result}
                    onChange={e => setForm({...form, result: e.target.value})}
                  >
                    <option>Selected</option>
                    <option>Rejected</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Your Experience</label>
                <textarea
                  style={{...styles.input, height: '120px', resize: 'vertical'}}
                  placeholder="Describe your interview experience, questions asked, tips..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  required
                />
              </div>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Experience'}
              </button>
            </form>
          </div>
        )}

        {/* Experiences List */}
        {experiences.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{color: '#6b7280', fontSize: '18px'}}>No experiences yet!</p>
            <p style={{color: '#4b5563', marginTop: '8px'}}>Be the first to share your interview experience 🚀</p>
          </div>
        ) : (
          <div style={styles.experiencesList}>
            {experiences.map(exp => (
              <div key={exp._id} style={styles.expCard}>
                <div style={styles.expHeader}>
                  <div>
                    <h3 style={styles.companyName}>{exp.company}</h3>
                    <p style={styles.roleName}>{exp.role}</p>
                  </div>
                  <div style={styles.badges}>
                    <span style={{...styles.badge, color: getDifficultyColor(exp.difficulty), borderColor: getDifficultyColor(exp.difficulty)}}>
                      {exp.difficulty}
                    </span>
                    <span style={{...styles.badge, color: getResultColor(exp.result), borderColor: getResultColor(exp.result)}}>
                      {exp.result}
                    </span>
                  </div>
                </div>
                <p style={styles.description}>{exp.description}</p>
                <p style={styles.author}>
                  Shared by {exp.userId?.name || 'Anonymous'} • {new Date(exp.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
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
  navLink: { color: '#60a5fa', textDecoration: 'none' },
  username: { color: '#9ca3af' },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #374151',
    color: '#9ca3af',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  main: { padding: '32px', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { color: 'white', fontSize: '24px', fontWeight: 'bold' },
  subtitle: { color: '#9ca3af', marginTop: '4px' },
  addBtn: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
  },
  formTitle: { color: 'white', fontSize: '18px', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '6px' },
  input: {
    width: '100%',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #374151',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
  },
  emptyState: { textAlign: 'center', padding: '80px 0' },
  experiencesList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  expCard: {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '24px',
  },
  expHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  companyName: { color: 'white', fontSize: '18px', fontWeight: 'bold' },
  roleName: { color: '#9ca3af', marginTop: '4px' },
  badges: { display: 'flex', gap: '8px' },
  badge: { padding: '4px 10px', borderRadius: '999px', border: '1px solid', fontSize: '13px' },
  description: { color: '#d1d5db', lineHeight: '1.6', marginBottom: '12px' },
  author: { color: '#6b7280', fontSize: '13px' },
};

export default Experiences;