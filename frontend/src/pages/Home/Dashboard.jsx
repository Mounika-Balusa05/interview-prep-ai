import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/userContext';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    role: '', experience: '', topicsToFocus: '', description: '', numberOfQuestions: 5
  });

  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/sessions/my-sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const sorted = [...data].sort((a, b) => b.isPinned - a.isPinned);
      setSessions(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const aiRes = await fetch('http://localhost:8000/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: form.role,
          experience: form.experience,
          topicsToFocus: form.topicsToFocus,
          numberOfQuestions: form.numberOfQuestions,
        }),
      });
      const questions = await aiRes.json();
      const sessionRes = await fetch('http://localhost:8000/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: form.role,
          experience: form.experience,
          topicsToFocus: form.topicsToFocus,
          description: form.description,
          questions,
        }),
      });
      const session = await sessionRes.json();
      setShowModal(false);
      navigate(`/interview-prep/${session.session._id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await fetch(`http://localhost:8000/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePinSession = async (sessionId) => {
    try {
      await fetch(`http://localhost:8000/api/sessions/${sessionId}/pin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar — name + logout on LEFT, title on RIGHT */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-blue-900">
          Interview <span className="text-blue-500">Prep AI</span>
        </h1>
        
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-medium">👋 {user?.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>
      {/* Hero Heading */}
<div className="text-center mb-10 mt-10">
  <h1 className="text-5xl font-extrabold text-blue-900 mb-2">
    Ace Your Next Interview 🚀
  </h1>
  <h2 className="text-2xl font-semibold text-blue-500 mb-2">
    Practice. Improve. Get Hired.
  </h2>
  <p className="text-slate-800 text-base">
    Your AI-powered interview prep companion — study smarter, not harder.
  </p>
</div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">My Prep Kits</h2>
            <p className="text-slate-500 text-sm mt-1">Create and manage your interview prep sessions</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            + New Kit
          </button>
        </div>

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-5xl mb-4">🎯</p>
            <p className="text-lg font-medium">No prep kits yet!</p>
            <p className="text-sm">Click "New Session" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session._id}
                className={`bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition ${
                  session.isPinned ? 'border-yellow-400' : 'border-blue-100'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-blue-900">{session.role}</h3>
                  <button
                    onClick={() => handlePinSession(session._id)}
                    title={session.isPinned ? "Unpin" : "Pin to top"}
                    className={`text-xl transition-transform hover:scale-125 ${
                      session.isPinned ? 'opacity-100' : 'opacity-30 hover:opacity-100'
                    }`}
                  >
                    📌
                  </button>
                </div>
                {session.isPinned && (
                  <span className="text-xs text-yellow-600 font-semibold bg-yellow-50 px-2 py-1 rounded-lg mb-2 inline-block">
                    Pinned
                  </span>
                )}
                <p className="text-sm text-slate-500 mb-1">Experience: {session.experience} years</p>
                <p className="text-sm text-slate-500 mb-3">Topics: {session.topicsToFocus}</p>
                <p className="text-xs text-slate-400 mb-4">{session.questions?.length} Questions</p>

                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => navigate(`/interview-prep/${session._id}`)}
                    className="flex-1 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session._id)}
                    title="Delete"
                    className="px-3 py-2 bg-red-100 text-red-500 text-sm font-semibold rounded-xl transition-transform hover:scale-110 hover:bg-red-200"
                  >
                    🗑️
                  </button>
                </div>

                {/* 🎯 Mock Interview Button */}
                <button
                  onClick={() => navigate(`/mock-interview/${session._id}`)}
                  className="w-full py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition"
                >
                  🎯 Start Mock Interview
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal — unchanged */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-blue-900 mb-6">Create New Session</h3>
            <form onSubmit={handleCreateSession}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-blue-900 mb-2">Job Role</label>
                <input type="text" placeholder="e.g. Frontend Developer"
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-blue-900 mb-2">Experience (years)</label>
                <input type="number" placeholder="e.g. 2"
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-blue-900 mb-2">Topics to Focus</label>
                <input type="text" placeholder="e.g. React, JavaScript, CSS"
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setForm({ ...form, topicsToFocus: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-blue-900 mb-2">Description</label>
                <textarea placeholder="Brief description of your prep goal"
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-blue-900 mb-2">Number of Questions</label>
                <select className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setForm({ ...form, numberOfQuestions: e.target.value })}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
                  {loading ? "Generating..." : "Create Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;