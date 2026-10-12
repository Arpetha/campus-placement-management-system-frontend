import { useEffect, useState } from 'react';
import './App.css';
import StudentLogin from './StudentLogin';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

const API_URL = 'http://localhost:8080/students';

function App() {
  const [loggedInStudent, setLoggedInStudent] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    cgpa: ''
  });

  async function loadStudents() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Could not load students');

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Loading students failed:', error);
    } finally {
      setLoadingStudents(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
  }

  async function registerStudent(event) {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cgpa: Number(formData.cgpa)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || 'Registration failed.');
        return;
      }

      setMessage('Registration successful! You can now log in.');
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        cgpa: ''
      });

      await loadStudents();
    } catch {
      setMessage('Cannot connect to backend. Make sure Spring Boot is running.');
    }
  }

  async function deleteStudent(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this student?'
    );
    if (!confirmed) return;

    try {
      const response = await fetch('${API_URL}/${id}', {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Could not delete student');

      setMessage('Student deleted successfully.');
      await loadStudents();
    } catch {
      setMessage('Could not delete student. Please try again.');
    }
  }

  if (showAdmin) {
    return (
      <div className="app">
        <button
          type="button"
          onClick={() => setShowAdmin(false)}
          style={{ margin: '16px' }}
        >
          Back to Home
        </button>
        <AdminDashboard />
      </div>
    );
  }

  if (loggedInStudent) {
    return (
      <div className="app">
        <Dashboard
          student={loggedInStudent}
          onLogout={() => {
            setLoggedInStudent(null);
            setMessage('');
          }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>CampusConnect</h2>
        <div>
          <a href="#home">Home</a>{' '}
          <a href="#register">Register</a>{' '}
          <a href="#login">Login</a>{' '}
          <a href="#students">Students</a>{' '}
          <button
            type="button"
            onClick={() => setShowAdmin(true)}
          >
            Admin Dashboard
          </button>
        </div>
      </nav>

      <header className="hero" id="home">
        <h1>Campus Placement Management System</h1>
        <p>
          Register, log in, and explore placement opportunities
          through CampusConnect.
        </p>
        </header>

      <main>
        <section className="section" id="register">
          <h2>Register Student</h2>

          <form onSubmit={registerStudent}>
            <label htmlFor="student-name">Full Name</label>
            <input
              id="student-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />

            <label htmlFor="student-email">Email Address</label>
            <input
              id="student-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="student-password">Password</label>
            <input
              id="student-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />

            <label htmlFor="student-phone">Phone Number</label>
            <input
              id="student-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />

            <label htmlFor="student-department">Department</label>
            <select
              id="student-department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="ECE">ECE</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="IT">IT</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>

            <label htmlFor="student-cgpa">CGPA</label>
            <input
              id="student-cgpa"
              name="cgpa"
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="Enter your CGPA"
              required
            />

            <button type="submit">Register Student</button>
          </form>

          {message && <p role="status">{message}</p>}
        </section>

        <StudentLogin
          onLoginSuccess={student => setLoggedInStudent(student)}
        />

        <section className="section" id="students">
          <h2>Registered Students</h2>

          {loadingStudents ? (
            <p>Loading students...</p>
          ) : students.length === 0 ? (
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.department}</td>
                      <td>{student.cgpa}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => deleteStudent(student.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '24px' }}>
        <p>CampusConnect | Campus Placement Management System</p>
      </footer>
    </div>
  );
}

export default App;