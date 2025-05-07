"use client"

import { useState } from "react"
import { TrendingUp, Clock, Route } from "lucide-react"
import "../styles/Statistiques.css"

const Statistiques = ({ navigateTo }) => {
  const [period, setPeriod] = useState("week")

  // Données d'exemple pour les statistiques
  const stats = {
    totalDistance: 235,
    totalTime: 12.5,
    averageSpeed: 28,
    fuelSaved: 15,
    co2Reduced: 32,
  }

  // Données d'exemple pour le graphique
  const chartData = {
    week: [15, 22, 18, 25, 30, 12, 20],
    month: [
      45, 52, 38, 65, 70, 42, 50, 35, 60, 55, 48, 62, 58, 40, 45, 52, 38, 65, 70, 42, 50, 35, 60, 55, 48, 62, 58, 40,
      45, 52,
    ],
    year: [120, 150, 180, 210, 190, 220, 240, 260, 230, 250, 270, 290],
  }

  // Fonction pour obtenir les labels du graphique selon la période
  const getChartLabels = () => {
    switch (period) {
      case "week":
        return ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
      case "month":
        return Array.from({ length: 30 }, (_, i) => i + 1)
      case "year":
        return ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
      default:
        return []
    }
  }

  // Calculer la hauteur maximale pour le graphique
  const maxValue = Math.max(...chartData[period])

  return (
    <div className="content">
      <h1>Statistiques</h1>

      <div className="stats-period-selector">
        <button className={`period-button ${period === "week" ? "active" : ""}`} onClick={() => setPeriod("week")}>
          Semaine
        </button>
        <button className={`period-button ${period === "month" ? "active" : ""}`} onClick={() => setPeriod("month")}>
          Mois
        </button>
        <button className={`period-button ${period === "year" ? "active" : ""}`} onClick={() => setPeriod("year")}>
          Année
        </button>
      </div>

      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-icon">
            <Route size={24} />
          </div>
          <div className="stats-details">
            <h3>Distance totale</h3>
            <p className="stats-value">{stats.totalDistance} km</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon">
            <Clock size={24} />
          </div>
          <div className="stats-details">
            <h3>Temps total</h3>
            <p className="stats-value">{stats.totalTime} h</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stats-details">
            <h3>Vitesse moyenne</h3>
            <p className="stats-value">{stats.averageSpeed} km/h</p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2>Distance parcourue</h2>
        <div className="chart">
          <div className="chart-bars">
            {chartData[period].map((value, index) => (
              <div
                key={index}
                className="chart-bar"
                style={{ height: `${(value / maxValue) * 100}%` }}
                title={`${getChartLabels()[index]}: ${value} km`}
              ></div>
            ))}
          </div>
          <div className="chart-labels">
            {getChartLabels().map((label, index) => (
              <div key={index} className="chart-label">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="eco-stats">
        <h2>Impact environnemental</h2>
        <div className="eco-cards">
          <div className="eco-card">
            <h3>Carburant économisé</h3>
            <p className="eco-value">{stats.fuelSaved} L</p>
            <p className="eco-description">Grâce à l'optimisation des trajets</p>
          </div>

          <div className="eco-card">
            <h3>CO2 non émis</h3>
            <p className="eco-value">{stats.co2Reduced} kg</p>
            <p className="eco-description">Contribution à la réduction de l'empreinte carbone</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistiques
