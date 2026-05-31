import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL; // ← add this

const LandingPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSession(data.session);
      if (data.session?.questions?.length > 0) {
        setSelectedQuestion(data.session.questions[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetExplanation = async (question) => {
    setLoadingExplanation(true);
    setExplanation(null);
    try {
      const res = await fetch(`${BASE_URL}/api/ai/generate-explanation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: question.question }),
      });
      const data = await res.json();
      setExplanation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handlePinQuestion = async (questionId) => {
    try {
      await fetch(`${BASE_URL}/api/questions/${questionId}/pin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSession();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-blue-600 font-semibold text-lg">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-blue-900">
          Interview <span className="text-blue-500">Prep AI</span>
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-200 transition"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-900">{session?.role}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {session?.experience} years experience • {session?.topicsToFocus}
          </p>
        </div>

        <div className="flex gap-6">
          <div className="w-1/3 bg-white rounded-2xl shadow-md p-4 h-fit">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Questions</h3>
            <div className="space-y-2">
              {session?.questions?.map((q, index) => (
                <div
                  key={q._id}
                  onClick={() => { setSelectedQuestion(q); setExplanation(null); }}
                  className={`p-3 rounded-xl cursor-pointer transition ${
                    selectedQuestion?._id === q._id
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Q{index + 1}. {q.question.substring(0, 40)}...</span>
                    {q.isPinned && <span>📌</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {selectedQuestion && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-blue-900 flex-1">
                    {selectedQuestion.question}
                  </h3>
                  <button
                    onClick={() => handlePinQuestion(selectedQuestion._id)}
                    className="ml-4 px-3 py-1 bg-yellow-100 text-yellow-600 rounded-xl text-sm font-semibold hover:bg-yellow-200 transition"
                  >
                    {selectedQuestion.isPinned ? '📌 Pinned' : '📌 Pin'}
                  </button>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-bold text-blue-900 mb-2">Answer:</h4>
                  <div className="text-slate-600 text-sm prose prose-sm max-w-none">
                    <ReactMarkdown>{selectedQuestion.answer}</ReactMarkdown>
                  </div>
                </div>

                <button
                  onClick={() => handleGetExplanation(selectedQuestion)}
                  disabled={loadingExplanation}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                  {loadingExplanation ? "Generating Explanation..." : "✨ Get AI Explanation"}
                </button>

                {explanation && (
                  <div className="mt-4 bg-purple-50 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-purple-900 mb-2">{explanation.title}</h4>
                    <div className="text-slate-600 text-sm prose prose-sm max-w-none">
                      <ReactMarkdown>{explanation.explanation}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;