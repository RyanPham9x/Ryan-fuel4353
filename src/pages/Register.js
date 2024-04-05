import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "../FuelQuoteForm.css";
import { toast } from 'react-toastify';
import winnerImg from '../img/yes.png';
import { cardio } from 'ldrs'
import PasswordChecklist from "react-password-checklist";

const Register = () => {
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '', // Confirm password
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors] = useState({});
  cardio.register()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          password2: formData.password2,
        }),
      });

      if (response.ok) {
        toast.success("Registration is successful! \n Please log in.");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorData = await response.json();
        // Handle errors from backend
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((key) => {
            const message = errorData.errors[key].join(' '); // Join messages if array
            toast.error(`${message}`); //`${key}: ${message}`
          });
        } else {
          toast.error("An error occurred during registration. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-image-section">
          <div className="image-text-content">
            <h2>Smart+</h2>
            <p>Discover Fuel Rates <br />with our great quote tool</p>
          </div>
          <img className="login-image" src={winnerImg} alt="Start" />
        </div>
        <div className="login-form-section">
          <div className="login-form-content">
            <h1>Register with Smart+</h1>
            <p>Already have an account? <Link to="/login" className="text-success">Sign in</Link></p>

            <form onSubmit={handleSubmit}>
              <div className="login-form-group">
                <label htmlFor="username">Username:</label>
                <input type="text"
                  name="username"
                  className="retrieve-address"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  required />
              </div>
              <div className="login-form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  className="retrieve-address"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="login-form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="password2"
                  className="retrieve-address"
                  placeholder="Confirm password"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
                {errors.password2 && <p style={{ color: 'red' }}>{errors.password2}</p>}
              </div>

              {formData.password.length > 0 && (
                <PasswordChecklist
                  className="password-checklist"
                  rules={["minLength", "specialChar", "number", "capital", "match"]}
                  minLength={5}
                  value={formData.password}
                  valueAgain={formData.password2}
                  onChange={(isValid) => setIsPasswordValid(isValid)}
                />
              )}
              <br />
              <button type="submit" className="button-login" disabled={loading || !isPasswordValid}>
                {loading ? <l-cardio
                  size="20"
                  stroke="2"
                  speed="0.9"
                  color="white"
                ></l-cardio> : 'Create Account'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
