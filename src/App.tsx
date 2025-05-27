import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { ToastContainer } from 'react-toastify';
import DetailDetectionHistoryPage from './pages/DetailDetectionHistoryPage';
import DetectionHistoryPage from './pages/DetectionHistoryPage';

// Import your pages or components
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/history" element={<DetectionHistoryPage />} />
          <Route path="/history/:id" element={<DetailDetectionHistoryPage />} />
        </Routes>
      </div>

      <ToastContainer />
    </Router>
  );
}

export default App;
