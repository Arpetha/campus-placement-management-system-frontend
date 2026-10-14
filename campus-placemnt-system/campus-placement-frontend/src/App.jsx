import { useEffect, useState } from 'react';
import './App.css';
import StudentLogin from './StudentLogin';

const API_URL = 'http://localhost:8080/students';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('ECE');
  const [cgpa, setCgpa] = useState('');
  const [password, setPassword] = useState('');
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadStudents() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Could not load students');
      }

      const data = await response.json();
      setStudents(data);
    } catch {
      setMessage(
        'Cannot connect to the backend. Please start Spring Boot.'
      );
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function registerStudent(event) {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    const student = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department,
      cgpa: Number(cgpa),
      password
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      setName('');
      setEmail('');
      setPhone('');
      setDepartment('ECE');
      setCgpa('');
      setPassword('');

      setMessage('Student registered successfully! 🎉');
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="navbar">
        <h2>CampusConnect</h2>
        <nav>
          <a href="#home">Home</a>
          <a href="#register">Register</a>
          <a href="#login">Login</a>
          <a href="#students">Students</a>
          <a href="#jobs">Jobs</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <h1>Campus Placement Management System</h1>
        <p>
          Your future starts here. Discover opportunities and
          prepare for success!
        </p>
        <a href="#register">Register Now</a>
      </section>

      <section className="section" id="register">
        <h2>Student Registration</h2>
        <p>Enter your details to get started.</p>

        <form onSubmit={registerStudent}>
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password (at least 8 characters)"
            minLength={8}
            autoComplete="new-password"
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
          />

          <label>Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="ECE">ECE</option>
            <option value="CSE">CSE</option>
            <option value="EEE">EEE</option>
            <option value="IT">IT</option>
            <option value="MECH">Mechanical</option>
            <option value="CIVIL">Civil</option>
          </select>

          <label>CGPA (out of 10)</label>
          <input
            type="number"
          
            min="0"
            max="10"
            step="0.01"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            placeholder="Enter your CGPA"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register Student'}
          </button>
        </form>

        {message && <p role="status">{message}</p>}
      </section>

      <StudentLogin />

      <section className="section" id="students">
        <h2>Registered Students</h2>
        <p>Students registered in the placement system.</p>

        {students.length === 0 ? (
          <p>No students registered yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>CGPA</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.department}</td>
                    <td>{student.cgpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button type="button" onClick={loadStudents}>
          Refresh Students
        </button>
      </section>

      <section className="section" id="jobs">
        <h2>Placement Opportunities</h2>
        <h3>Software Developer</h3>
        <p>
          Explore careers in Java, web development, and programming.
        </p>
        <h3>Graduate Engineer Trainee</h3>
        <p>
          Discover technical opportunities for engineering students.
        </p>
      </section>

      <footer>
        <p>
          CampusConnect © 2026 | Campus Placement Management System
        </p>
      </footer>
    </div>
  );
}

export default App;