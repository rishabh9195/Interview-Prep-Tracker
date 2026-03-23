import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState({});
  const [notes, setNotes] = useState({});
  const [selectedTopic, setSelectedTopic] = useState('Arrays');
  const [activeNote, setActiveNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  const topics = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Graphs'];

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { navigate('/'); return; }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    fetchQuestions();
    fetchProgress(parsedUser.id);
    fetchStreak(parsedUser.id);
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/questions');
      setQuestions(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchProgress = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/progress/${userId}`);
      const progressMap = {};
      const notesMap = {};
      res.data.forEach(p => {
        progressMap[p.questionId] = p.status;
        notesMap[p.questionId] = p.notes || '';
      });
      setProgress(progressMap);
      setNotes(notesMap);
    } catch (err) { console.log(err); }
  };

  const fetchStreak = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/streak/${userId}`);
      setStreak(res.data.streak);
    } catch (err) { console.log(err); }
  };

  const updateProgress = async (questionId, status) => {
    try {
      await axios.post('http://localhost:5000/api/progress/update', {
        userId: user.id, questionId, status
      });
      setProgress(prev => ({ ...prev, [questionId]: status }));

      // Update streak when question is solved
      if (status === 'solved') {
        const res = await axios.post(`http://localhost:5000/api/streak/update/${user.id}`);
        setStreak(res.data.streak);
      }
    } catch (err) { console.log(err); }
  };

  const saveNote = async (questionId) => {
    try {
      await axios.post('http://localhost:5000/api/progress/update', {
        userId: user.id, questionId, notes: noteText
      });
      setNotes(prev => ({ ...prev, [questionId]: noteText }));
      setActiveNote(null);
      setNoteText('');
    } catch (err) { console.log(err); }
  };

  const openNote = (questionId) => {
    setActiveNote(questionId);
    setNoteText(notes[questionId] || '');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getTopicQuestions = (topic) => questions.filter(q => q.topic === topic);
  const getSolvedCount = () => Object.values(progress).filter(s => s === 'solved').length;
  const getInProgressCount = () => Object.values(progress).filter(s => s === 'in-progress').length;
  const getCompletion = () => questions.length > 0
    ? Math.round((getSolvedCount() / questions.length) * 100) : 0;
  const getTopicSolved = (topic) => {
    const topicQs = getTopicQuestions(topic);
    return topicQs.filter(q => progress[q._id] === 'solved').length;
  };
  const getStatusColor = (status) => {
    if (status === 'solved') return '#059669';
    if (status === 'in-progress') return '#d97706';
    return '#374151';
  };
  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return '#34d399';
    if (diff === 'Medium') return '#fbbf24';
    return '#f87171';
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>Interview Prep Tracker 🎯</h1>
        <div style={styles.navRight}>
          <Link to="/experiences" style={styles.navLink}>💼 Experiences</Link>
          <span style={styles.username}>👋 {user.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.main}>
        {/* Welcome */}
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeLeft}>
            <h2 style={styles.welcomeTitle}>Welcome back, {user.name}! 💪</h2>
            <p style={styles.welcomeSubtitle}>Keep up the momentum — consistency is key!</p>
          </div>
          <div style={styles.streakCard}>
            <div style={styles.streakFire}>🔥</div>
            <div style={styles.streakNumber}>{streak}</div>
            <div style={styles.streakLabel}>Day Streak</div>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{getSolvedCount()}</div>
            <div style={styles.statLabel}>Questions Solved</div>
          </div>
          <div style={{...styles.statCard, borderColor: '#7c3aed'}}>
            <div style={{...styles.statNumber, color: '#a78bfa'}}>{getInProgressCount()}</div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
          <div style={{...styles.statCard, borderColor: '#059669'}}>
            <div style={{...styles.statNumber, color: '#34d399'}}>{getCompletion()}%</div>
            <div style={styles.statLabel}>Completion</div>
          </div>
        </div>

        {/* Topic Tabs */}
        <div style={styles.tabs}>
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              style={{
                ...styles.tab,
                backgroundColor: selectedTopic === topic ? '#2563eb' : '#111827',
                color: selectedTopic === topic ? 'white' : '#9ca3af',
              }}
            >
              {topic} ({getTopicSolved(topic)}/{getTopicQuestions(topic).length})
            </button>
          ))}
        </div>

        {/* Questions List */}
        <div style={styles.questionsList}>
          {getTopicQuestions(selectedTopic).map(q => (
            <div key={q._id} style={styles.questionCard}>
              <div style={styles.questionTop}>
                <div style={styles.questionLeft}>
                  <span style={{...styles.difficulty, color: getDifficultyColor(q.difficulty)}}>
                    {q.difficulty}
                  </span>
                  <a href={q.link} target="_blank" rel="noreferrer" style={styles.questionTitle}>
                    {q.title}
                  </a>
                </div>
                <div style={styles.questionRight}>
                  {['unsolved', 'in-progress', 'solved'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateProgress(q._id, status)}
                      style={{
                        ...styles.statusBtn,
                        backgroundColor: progress[q._id] === status
                          ? getStatusColor(status) : 'transparent',
                        borderColor: getStatusColor(status),
                        color: progress[q._id] === status ? 'white' : '#9ca3af',
                      }}
                    >
                      {status === 'unsolved' ? '✗ Unsolved' :
                       status === 'in-progress' ? '⟳ In Progress' : '✓ Solved'}
                    </button>
                  ))}
                  <button
                    onClick={() => openNote(q._id)}
                    style={{
                      ...styles.noteBtn,
                      backgroundColor: notes[q._id] ? '#1e3a5f' : 'transparent',
                      borderColor: notes[q._id] ? '#2563eb' : '#374151',
                    }}
                  >
                    📝 {notes[q._id] ? 'Edit Note' : 'Add Note'}
                  </button>
                </div>
              </div>

              {/* Note display */}
              {notes[q._id] && activeNote !== q._id && (
                <div style={styles.noteDisplay}>
                  📝 {notes[q._id]}
                </div>
              )}

              {/* Note editor */}
              {activeNote === q._id && (
                <div style={styles.noteEditor}>
                  <textarea
                    style={styles.noteTextarea}
                    placeholder="Write your notes here... approach, complexity, key insights"
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    rows={3}
                  />
                  <div style={styles.noteActions}>
                    <button onClick={() => saveNote(q._id)} style={styles.saveNoteBtn}>
                      Save Note
                    </button>
                    <button onClick={() => setActiveNote(null)} style={styles.cancelNoteBtn}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
  main: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
  welcomeCard: {
    backgroundColor: '#1e3a5f',
    border: '1px solid #2563eb',
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeLeft: {},
  welcomeTitle: { color: 'white', fontSize: '24px', fontWeight: 'bold' },
  welcomeSubtitle: { color: '#93c5fd', marginTop: '8px' },
  streakCard: {
    backgroundColor: '#1a1a2e',
    border: '2px solid #f97316',
    borderRadius: '12px',
    padding: '16px 24px',
    textAlign: 'center',
    minWidth: '100px',
  },
  streakFire: { fontSize: '28px' },
  streakNumber: { fontSize: '32px', fontWeight: 'bold', color: '#f97316' },
  streakLabel: { color: '#9ca3af', fontSize: '12px', marginTop: '4px' },
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
  tabs: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
  tab: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  questionsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  questionCard: {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '16px 20px',
  },
  questionTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  questionLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  difficulty: { fontSize: '13px', fontWeight: '600', minWidth: '50px' },
  questionTitle: { color: 'white', textDecoration: 'none', fontSize: '15px' },
  questionRight: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  statusBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '13px',
  },
  noteBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#60a5fa',
  },
  noteDisplay: {
    marginTop: '12px',
    padding: '10px 14px',
    backgroundColor: '#1e3a5f',
    borderRadius: '8px',
    color: '#93c5fd',
    fontSize: '14px',
    borderLeft: '3px solid #2563eb',
  },
  noteEditor: { marginTop: '12px' },
  noteTextarea: {
    width: '100%',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #374151',
    fontSize: '14px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  noteActions: { display: 'flex', gap: '8px', marginTop: '8px' },
  saveNoteBtn: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  cancelNoteBtn: {
    backgroundColor: 'transparent',
    color: '#9ca3af',
    padding: '6px 16px',
    borderRadius: '6px',
    border: '1px solid #374151',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Dashboard;