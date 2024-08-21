import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginRegister() {
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [validationErrors, setValidationErrors] = useState({}); // Validation errors state
  const navigate = useNavigate();

  const handleSwitchContent = () => {
    setIsActive(!isActive);
    setErrorMessage(""); // Reset error message when switching forms
    setValidationErrors({}); // Reset validation errors
  };

  const validateUsername = (name) => {
    if (!name) {
      return "Username is required";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return "Email is invalid";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    } else if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      username: validateUsername(value),
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      email: validateEmail(value),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      password: validatePassword(value),
    }));
  };

  const register = (event) => {
    event.preventDefault();

    // Revalidate inputs before submission
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (usernameError || emailError || passwordError) {
      setValidationErrors({ username: usernameError, email: emailError, password: passwordError });
      return;
    }

    axios.post("http://localhost:8001/register", { username, email, password })
      .then(res => {
        // Save user data in local storage after successful registration
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate("/home");
      })
      .catch(err => {
        // Set error message based on server response
        setErrorMessage(err.response ? err.response.data.message : "Registration failed");
      });
  };

  const login = (event) => {
    event.preventDefault();
    axios.post("http://localhost:8001/login", { email: loginEmail, password: loginPassword })
        .then(res => {
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate("/home");
        })
        .catch(err => {
            // Set error message based on server response
            setErrorMessage(err.response ? err.response.data.message : "Login failed");
        });
  };

  return (
    <div className={`content justify-content-center align-items-center d-flex shadow-ig ${isActive ? 'active' : ''}`} id='content'>
      {/* Registration Form */}
      <div className='col-md-6 d-flex justify-content-center'>
        <form onSubmit={register}>
          <div className="header-text mb-4">
            <h1>Create account</h1>
          </div>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Display error message */}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
            />
            {validationErrors.username && <small className="text-danger">{validationErrors.username}</small>}
          </div>
          <div className="input-group mb-3">
            <input
              type="email"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="E-mail"
              value={email}
              onChange={handleEmailChange}
            />
            {validationErrors.email && <small className="text-danger">{validationErrors.email}</small>}
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {validationErrors.password && <small className="text-danger">{validationErrors.password}</small>}
          </div>
          <div className="input-group mb-3">
            <button className='btn border-white text-white w-50 fs-6'>Register</button>
          </div>
        </form>
      </div>

      {/* Login Form */}
      
      <div className='col-md-6 right-box'>
        <form onSubmit={login}>
          <div className="header-text mb-4">
            <h1>Sign in</h1>
          </div>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Display error message */}
          <div className="input-group mb-3">
            <input
              type="email"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="E-mail"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
            />
          </div>
          <div className='input-group mb-5 justify-content-between'>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
              <label htmlFor='flexCheckDefault' className='form-check-label text-secondary'><small>Remember me</small></label>
            </div>
            <div className="forgot">
              <small><a href='/'>Forgot password</a></small>
            </div>
          </div>
          <div className="input-group mb-3">
            <button className='btn border-white text-white w-50 fs-6'>Login</button>
          </div>
        </form>
      </div>

      {/* Switch Panel */}
      <div className="switch-content">
        <div className="switch">
          <div className="switch-panel switch-left">
            <h1>Hello Again</h1>
            <p>We are happy to see you back</p>
            <button className='btn text-white w-50 fs-6 border-white' id='login' onClick={handleSwitchContent}>Login</button>
          </div>
          <div className="switch-panel switch-right">
            <h1>Welcome</h1>
            <p>Join our new platform and explore your experience</p>
            <button className='btn text-white w-50 fs-6 border-white' id='register' onClick={handleSwitchContent}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
