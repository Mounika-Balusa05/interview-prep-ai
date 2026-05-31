import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Home/Dashboard';
import LandingPage from './pages/InterviewPrep/LandingPage';
import MockInterview from './pages/InterviewPrep/MockInterview';  // ← add this
import { UserProvider } from './Context/userContext';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview-prep/:sessionId" element={<LandingPage />} />
          <Route path="/mock-interview/:sessionId" element={<MockInterview />} />  {/* ← add this */}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;