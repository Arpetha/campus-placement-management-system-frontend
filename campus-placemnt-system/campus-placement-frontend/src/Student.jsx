import './App.css';

function StudentLogin() {
  return (
    <section className="section" id="login">
      <h2>Student Login</h2>
      <p>Welcome back to CampusConnect!</p>

      <form onSubmit={(event) => event.preventDefault()}>
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          required
        />

        <button type="submit">Login</button>
      </form>
    </section>
  );
}

export default StudentLogin;