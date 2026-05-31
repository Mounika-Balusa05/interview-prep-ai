import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../Context/userContext';

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }
      localStorage.setItem('token', data.token);
      updateUser(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border-t-4 border-blue-500">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-blue-900">
            Interview <span className="text-blue-500">Prep AI</span>
          </h1>
        </div>
        <h2 className="text-3xl font-bold text-blue-900 mb-1">Welcome Back</h2>
        <p className="text-slate-500 mb-8">Log in to continue your interview prep.</p>
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-blue-900 mb-2">Email</label>
            <input type="email" placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-blue-900 mb-2">Password</label>
            <input type="password" placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-200 shadow-md">
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-slate-500 text-sm mt-6">
          New to Prep AI?{' '}
          <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;