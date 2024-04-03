import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from "react-router-dom";
import "../FuelQuoteForm.css";
import mainPageImage from '../img/yes.png';
import { cardio } from 'ldrs'
const LoginPage = () => {

  let { loginUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false);
  cardio.register()
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    loginUser(event).finally(() => {
      setLoading(false); // Reset loading state once the loginUser function completes
    });
  };
  return (
    <div className="login-container">
      <div className="login-image-section">
        <div className="image-text-content">
          <h2>Smart+</h2>
          <p>Discover Fuel Rates <br />with our great quote tool</p>
        </div>
        <img className="login-image" src={mainPageImage} alt="Start" />
      </div>
      <div className="login-form-section">
        <div className="login-form-content">
          <h1>Welcome to Smart+</h1>
          <p>New Here? <Link to="/register" className="text-success">Create Account</Link></p>

          <form onSubmit={handleLogin}>
            <div className="login-form-group">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" placeholder="Enter username" required />
            </div>
            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="Enter password" required />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? <l-cardio
                size="20"
                stroke="2"
                speed="0.9"
                color="white"
              ></l-cardio> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
