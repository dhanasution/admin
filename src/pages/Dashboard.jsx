// src/pages/Dashboard.jsx
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Selamat datang, {user?.nama}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}