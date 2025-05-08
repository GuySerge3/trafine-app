import React, { useEffect, useState } from "react";
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import axios from "axios";
import "../styles/Statistiques.css";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

function StatsDashboard() {
  const [summary, setSummary] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [incidentsByType, setIncidentsByType] = useState([]);
  const [topRoutes, setTopRoutes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const baseURL = "http://localhost:3006/api/stats";

    axios.get(`${baseURL}/summary/realtime`).then(res => setSummary(res.data));
    axios.get(`${baseURL}/predictions`).then(res => setPredictions(res.data.predictions));
    axios.get(`${baseURL}/incidents-by-type`).then(res => setIncidentsByType(res.data));
    axios.get(`${baseURL}/top-routes`).then(res => setTopRoutes(res.data));
  }, []);

  return (
    <div className={`stats-dashboard ${darkMode ? "dark" : "light"}`}>
      <div className="header">
        <h1>📈 Tableau de bord - Statistiques Trafic</h1>
        <label className="switch">
          <input type="checkbox" onChange={() => setDarkMode(!darkMode)} />
          <span className="slider round"></span>
        </label>
      </div>

      <div className="stats-summary">
        <div className="card">
          <h2>Incidents (1h)</h2>
          <p>{summary.incidents_last_hour ?? "-"}</p>
        </div>
        <div className="card">
          <h2>Routes (1h)</h2>
          <p>{summary.routes_last_hour ?? "-"}</p>
        </div>
      </div>

      <div className="chart-section fade-in">
        <h2>📊 Incidents par heure (24h)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictions}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="incidents" stroke="#ff7300" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section fade-in delay-1">
        <h2>🧯 Répartition des types d'incidents</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={incidentsByType}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {incidentsByType.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section fade-in delay-2">
        <h2>🛣️ Top 5 des routes les plus empruntées</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRoutes}>
            <XAxis dataKey="_id.from" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0088FE" name="Nombre de passages" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatsDashboard;
