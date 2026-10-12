import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const API = 'http://localhost:8080';

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [studentsResponse, applicationsResponse] =
        await Promise.all([
          fetch(`${API}/students`),
          fetch(`${API}/placement-applications/all`)
        ]);

      if (!studentsResponse.ok) {
        throw new Error('Could not load registered students.');
      }

      if (!applicationsResponse.ok) {
        throw new Error('Could not load placement applications.');
      }

      const studentsData = await studentsResponse.json();
      const applicationsData = await applicationsResponse.json();

      setStudents(studentsData);
      setApplications(applicationsData);
    } catch (err) {
      setError(
        err.message ||
        'Unable to connect to the backend. Check whether Spring Boot is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function updateStatus(applicationId, newStatus) {
    setUpdatingId(applicationId);
    setError('');

    try {
      const response = await fetch(
        `${API}/placement-applications/${applicationId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(
          `Server error ${response.status}: ${result}`
        );
      }

      const updatedApplication = result
        ? JSON.parse(result)
        : null;

      setApplications(previous =>
        previous.map(app =>
          app.id === applicationId
            ? {
                ...app,
                status: updatedApplication?.status || newStatus
              }
            : app
        )
      );

      alert('Application status updated successfully!');
    } catch (err) {
      setError(err.message || 'Status update failed.');
      alert('Status update failed: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const th = {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#e8eef7'
  };

  const td = {
    border: '1px solid #ccc',
    padding: '10px'
  };

  return (
    <div
      style={{
        padding: '24px',
        fontFamily: 'Arial, sans-serif',
        overflowX: 'auto'
      }}
    >
      <h1>Admin Dashboard</h1>
      <p>Manage registered students and placement applications.</p>

      <button
        onClick={loadData}
        disabled={loading}
        style={{
          padding: '10px 16px',
          marginBottom: '16px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Loading...' : 'Refresh Data'}
      </button>

      {error && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <h2>Registered Students ({students.length})</h2>

          {students.length === 0 ? (
            <p>No registered students found.</p>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '35px'
              }}
            >
              <thead>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>Name</th>
                  <th style={th}>Email</th>
                  <th style={th}>Department</th>
                  <th style={th}>CGPA</th>
                </tr>
              </thead>

              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td style={td}>{student.id}</td>
                    <td style={td}>{student.name || '-'}</td>
                    <td style={td}>{student.email || '-'}</td>
                    <td style={td}>{student.department || '-'}</td>
                    <td style={td}>{student.cgpa ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2>Placement Applications ({applications.length})</h2>

          {applications.length === 0 ? (
            <p>No placement applications found.</p>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            >
              <thead>
                <tr>
                  <th style={th}>Application ID</th>
                  <th style={th}>Student</th>
                  <th style={th}>Company</th>
                  <th style={th}>Status</th>
                  <th style={th}>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td style={td}>{app.id}</td>

                    <td style={td}>
                      {app.studentName ||
                        app.name ||
                        app.studentEmail ||
                        app.email ||
                        '-'}
                    </td>

                    <td style={td}>
                      {app.companyName ||
                        app.company ||
                        '-'}
                    </td>

                    <td style={td}>{app.status || 'Applied'}</td>

                    <td style={td}>
                      <select
                        value={app.status || 'Applied'}
                        disabled={updatingId === app.id}
                        onChange={event =>
                          updateStatus(app.id, event.target.value)
                        }
                        style={{
                          padding: '8px',
                          minWidth: '130px'
                        }}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      {updatingId === app.id && (
                        <span> Saving...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}