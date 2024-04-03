import './App.css';
import './FuelQuoteForm.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { AuthProvider } from './context/AuthContext'
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PrivateRoute from './utils/PrivateRoute'
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import { Outlet } from 'react-router';
import Navx from './components/Nav'
import QuoteForm from './pages/QuoteForm';
import QuoteHistory from './pages/QuoteHistory';

function App() {
  return (
    <div className="App">
      <Router>
      <ToastContainer />
      <AuthProvider>
        <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <>
              <Navx />
              <Outlet />
              <Footer />
            </>
          }
        >
          <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>} />        
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/quoteform" element={<PrivateRoute><QuoteForm /></PrivateRoute>} />
          <Route path="/quotehistory" element={<PrivateRoute><QuoteHistory /></PrivateRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
      </Router>
    </div>
  );
}

export default App;