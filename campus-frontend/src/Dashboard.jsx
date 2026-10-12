import { useEffect, useState } from 'react';

function Dashboard({ student, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingCompany, setLoadingCompany] = useState('');

  const placements = [
    {
      company: 'TCS',
      role: 'Graduate Trainee',
      color: '#e8efff'
    },
    {
      company: 'Infosys',
      role: 'Systems Engineer',
      color: '#e5f7ee'
    },
    {
      company: 'Wipro',
      role: 'Project Engineer',
      color: '#fff0e5'
    }
  ];

  async function loadApplications() {
    if (!student || !student.email) return;

    try {
      const response = await fetch(
        'http://localhost:8080/placement-applications?email=' +
          encodeURIComponent(student.email)
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Could not load applications:', response.status);
      }
    } catch (error) {
      console.error('Could not load applications:', error);
    }
  }

  useEffect(() => {
    loadApplications();
  }, [student?.email]);

  async function applyForPlacement(job) {
    setMessage('');
    setLoadingCompany(job.company);

    try {
      const response = await fetch(
        'http://localhost:8080/placement-applications',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentName: student.name,
            studentEmail: student.email,
            company: job.company,
            role: job.role
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.message || 'Unable to submit application.'
        );
        return;
      }

      setMessage(
        'Successfully applied to ' + job.company + '!'
      );

      await loadApplications();
    } catch (error) {
      console.error('Application error:', error);

      setMessage(
        'Cannot connect to backend. Please check that Spring Boot is running.'
      );
    } finally {
      setLoadingCompany('');
    }
  }

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '30px auto',
        padding: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#202747'
      }}
    >
      <header
        style={{
          background: 'linear-gradient(135deg, #5145cd, #8278f5)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '24px'
        }}
      >
        <h1>Welcome, {student.name || 'Student'}!</h1>
        <p>Your CampusConnect Student Dashboard</p>

        <button
          type="button"
          onClick={onLogout}
          style={{
            background: 'white',
            color: '#5145cd',
            border: 'none',
            borderRadius: '7px',
            padding: '11px 20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </header>

      <section
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '14px',
          boxShadow: '0 3px 15px #00000010',
          marginBottom: '28px'
        }}
      >
        <h2>My Student Profile</h2>
        <p>
          <strong>Name:</strong> {student.name || 'Not available'}
        </p>
        <p>
          <strong>Email:</strong> {student.email || 'Not available'}
        </p>
        <p>
          <strong>Department:</strong>{' '}
          {student.department || 'Not provided'}
        </p>
        <p>
          <strong>CGPA:</strong> {student.cgpa ?? 'Not provided'}
        </p>
      </section>

      <h2>Placement Opportunities</h2>
      <p>Explore opportunities and apply for your preferred role.</p>

      {message && (
        <p
          role="status"
          style={{
            fontWeight: 'bold',
            color: message.startsWith('Successfully') ? 'green' : '#c0392b'
          }}
        >
          {message}
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px'
        }}
      >
        {placements.map((job) => {
          const alreadyApplied = applications.some(
            (application) =>
              application.company?.toLowerCase() ===
              job.company.toLowerCase()
          );

          return (
            <article
              key={job.company}
              style={{
                background: job.color,
                padding: '22px',
                borderRadius: '14px',
                border: '1px solid #e5e7eb'
              }}
            >
              <h3>{job.company}</h3>
              <p>
                <strong>Role:</strong> {job.role}
              </p>
              <p>Check the official company eligibility criteria.</p>

              <button
                type="button"
                disabled={loadingCompany !== '' || alreadyApplied}
                onClick={() => applyForPlacement(job)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '7px',
                  background: alreadyApplied ? '#777' : '#5145cd',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: alreadyApplied ? 'default' : 'pointer'
                }}
              >
                {loadingCompany === job.company
                  ? 'Applying...'
                  : alreadyApplied
                    ? 'Already Applied'
                    : 'Apply Now'}
              </button>
            </article>
          );
        })}
      </div>

      <section
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '14px',
          boxShadow: '0 3px 15px #00000010',
          marginTop: '28px'
        }}
      >
        <h2>My Applications</h2>

        {applications.length === 0 ? (
          <p>You haven't applied to any placements yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px' }}>
                    Company
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>
                    Role
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>
                    Status
                  </th>
                </tr>
              </thead>
               <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td style={{ padding: '10px' }}>
                      {application.company}
                    </td>
                    <td style={{ padding: '10px' }}>
                      {application.role}
                    </td>
                    <td style={{ padding: '10px' }}>
                      {application.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer
        style={{
          textAlign: 'center',
          marginTop: '35px',
          color: '#666'
        }}
      >
        CampusConnect | Campus Placement Management System
      </footer>
    </div>
  );
}

export default Dashboard;