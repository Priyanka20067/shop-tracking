import React, { useState } from "react";
import './sign.css';
const Signup = () => {
  // State to manage form inputs and UI
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors({...errors, confirmPassword: 'Passwords must match'});
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Account created successfully!');
      console.log("Form submitted:", formData);
    } catch (error) {
      setErrors({...errors, form: 'Signup failed. Please try again.'});
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign-up (placeholder)
  const handleGoogleSignUp = () => {
    console.log("Continue with Google clicked");
    // Add Google OAuth logic here
  };

  // Handle skip action (placeholder)
  const handleSkip = () => {
    console.log("Skip clicked");
    // Add navigation or skip logic here
  };

  return (
    <div className="login-container">
        
      <div className="login-box">
        <h1 className="login-title">Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn primary-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {errors.form && (
            <div className="error-message">{errors.form}</div>
          )}
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="btn google-btn" onClick={handleGoogleSignUp}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="google-icon"
          />
          Continue with Google
        </button>

        <button className="skip-btn" onClick={handleSkip}>
          Skip
        </button>
      </div>
    </div>
  );
};

export default Signup;
