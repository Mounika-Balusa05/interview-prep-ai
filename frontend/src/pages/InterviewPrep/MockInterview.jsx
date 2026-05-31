import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL;

const MockInterview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [scores, setScores] = useState([]);
  const [evaluating, setEvaluating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    if (!loading && !finished) {
      startTimer();
      speak(questions[currentIndex]?.question);
    }
    return () => {
      clearInterval(timerRef.current);
      window.speechSynthesis.cancel();
    };
  }, [currentIndex, loading, finished]);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice input. Please type your answer.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setUserAnswer((prev) => prev + ' ' + transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const fetchSession = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setQuestions(data.session.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimeLeft(120);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNext(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleNext = (autoSkip = false) => {
    clearInterval(timerRef.current);
    window.speechSynthesis.cancel();
    stopListening();
    const savedAnswer = autoSkip ? '(No answer — time ran out)' : userAnswer;
    const updatedAnswers = [...answers, { question: questions[currentIndex].question, answer: savedAnswer }];
    setAnswers(updatedAnswers);
    setUserAnswer('');
    if (currentIndex + 1 >= questions.length) {
      evaluateAll(updatedAnswers);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const evaluateAll = async (allAnswers) => {
    setFinished(true);
    setEvaluating(true);
    try {
      const results = await Promise.all(
        allAnswers.map(async ({ question, answer }) => {
          const res = await fetch(`${BASE_URL}/api/ai/evaluate-answer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ question, answer }),
          });
          const data = await res.json();
          return { question, answer, score: data.score, feedback: data.feedback };
        })
      );
      setScores(results);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalScore = scores.reduce((sum, s) => sum + (Number(s.score) || 0), 0);
  const maxScore = scores.length * 10;

  if (loading) return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center">
      <p className="text-purple-600 font-semibold text-lg">Loading interview...</p>
    </div>
  );

  if (finished) return (
    <div className="min-h-screen bg-purple-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-purple-900 mb-2 text-center">Interview Complete! 🎉</h1>
        {evaluating ? (
          <p className="text-center text-purple-500 mt-10 text-lg">AI is scoring your answers...</p>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6 text-center">
              <p className="text-slate-500 text-sm mb-1">Overall Score</p>
              <p className="text-5xl font-extrabold text-purple-700">{totalScore}<span className="text-2xl">/{maxScore}</span></p>
            </div>
            <div className="space-y-4">
              {scores.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-blue-900 text-lg">Q{i + 1}. {item.question}</p>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      !item.score ? 'bg-gray-100 text-gray-400' :
                      item.score >= 7 ? 'bg-green-100 text-green-700' :
                      item.score >= 4 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.score ? `${item.score}/10` : 'N/A'}
                    </span>
                  </div>
                  <p className="text-base text-slate-500 mb-2"><span className="font-semibold">Your answer:</span> {item.answer}</p>
                  <p className="text-base text-purple-700 bg-purple-50 rounded-lg p-2">{item.feedback}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-8 w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );

  const current = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <p className="text-purple-700 font-semibold">Question {currentIndex + 1} of {questions.length}</p>
          <p className={`text-lg font-extrabold ${timeLeft <= 30 ? 'text-red-500' : 'text-purple-700'}`}>
            ⏱ {formatTime(timeLeft)}
          </p>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2 mb-6">
          <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <p className="text-lg font-bold text-blue-900 mb-4">{current.question}</p>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type or speak your answer here..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-purple-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
          <button
            onClick={isListening ? stopListening : startListening}
            className={`mt-3 w-full py-2 rounded-xl font-semibold text-sm transition ${
              isListening ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {isListening ? '🔴 Stop Recording' : '🎙️ Speak Answer'}
          </button>
          {isListening && (
            <p className="text-center text-xs text-red-400 mt-2 animate-pulse">Listening... speak now</p>
          )}
        </div>
        <button
          onClick={() => handleNext(false)}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
        >
          {currentIndex + 1 === questions.length ? 'Finish Interview 🎯' : 'Next Question →'}
        </button>
      </div>
    </div>
  );
};

export default MockInterview;