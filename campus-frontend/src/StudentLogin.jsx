import { useState } from 'react';
import './App.css';

function StudentLogin({ onLoginSuccess }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);

async function handleLogin(event) {
event.preventDefault();

setMessage('');
setSuccess(false);
setLoading(true);

try {
  const response = await fetch(
    'http://localhost:8080/students/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    setMessage(result.message || 'Login failed. Check your email and password.');
    return;
  }

  setSuccess(true);
  setMessage(
    'Login successful! Welcome, ' + (result.name || 'Student') + '!'
  );
  onLoginSuccess({
    name:result.name,
    email:result.email,
    department:result.department,
    cgpa:result.cgpa
  });
  setPassword('');
} catch (error) {
  setMessage(
    'Cannot connect to backend. Make sure Spring Boot is running.'
  );
} finally {
  setLoading(false);
}

}

return (
<section
className="section"
id="login"
style={{
display: 'block',
visibility: 'visible'
}}
>
<h2>Student Login</h2>
<p>Welcome back to CampusConnect!</p>

  <form onSubmit={handleLogin}>
    <label htmlFor="login-email">Email Address</label>
    <input
      id="login-email"
      type="email"
      placeholder="Enter your registered email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      required
    />

    <label htmlFor="login-password">Password</label>
    <input
      id="login-password"
      type="password"
      placeholder="Enter your password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      required
    />

    <button
      type="submit"
      disabled={loading}
      style={{
        display: 'block',
        width: '100%',
        minHeight: '48px',
        marginTop: '12px',
        padding: '14px',
        border: 'none',
        borderRadius: '7px',
        backgroundColor: '#5145cd',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: loading ? 'wait' : 'pointer'
      }}
    >
      {loading ? 'Logging in...' : 'Login'}
    </button>
  </form>

  {message && (
    <p
      role="status"
      style={{
        marginTop: '16px',
        color: success ? 'green' : '#c62828',
        fontWeight: 'bold'
      }}
    >
      {message}
    </p>
  )}
</section>

);
}
export default StudentLogin;