"use client"

import { useState } from "react"
import { User, Settings, Shield } from "lucide-react"
import "../styles/Profil.css"

const Profil = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState("info")

  // Données d'exemple pour le profil
  const userProfile = {
    name: "Thomas Dubois",
    email: "thomas.dubois@example.com",
    phone: "+33 6 12 34 56 78",
    joinDate: "15 mars 2023",
    avatar: "/placeholder.svg?height=100&width=100",
    vehicle: {
      model: "Renault Clio",
      year: "2019",
      color: "Gris",
    },
    preferences: {
      avoidTolls: true,
      avoidHighways: false,
      darkMode: false,
      notifications: true,
    },
  }

  return (
    <div className="content">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={userProfile.avatar || "/placeholder.svg"} alt="Avatar" />
        </div>
        <div className="profile-info">
          <h1>{userProfile.name}</h1>
          <p>Membre depuis {userProfile.joinDate}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={`profile-tab ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
          <User size={18} />
          Informations
        </button>
        <button
          className={`profile-tab ${activeTab === "preferences" ? "active" : ""}`}
          onClick={() => setActiveTab("preferences")}
        >
          <Settings size={18} />
          Préférences
        </button>
        <button
          className={`profile-tab ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <Shield size={18} />
          Sécurité
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "info" && (
          <div className="profile-section">
            <h2>Informations personnelles</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Nom complet</label>
                <p>{userProfile.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{userProfile.email}</p>
              </div>
              <div className="info-item">
                <label>Téléphone</label>
                <p>{userProfile.phone}</p>
              </div>
              <div className="info-item">
                <label>Date d'inscription</label>
                <p>{userProfile.joinDate}</p>
              </div>
            </div>

            <h2>Véhicule</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Modèle</label>
                <p>{userProfile.vehicle.model}</p>
              </div>
              <div className="info-item">
                <label>Année</label>
                <p>{userProfile.vehicle.year}</p>
              </div>
              <div className="info-item">
                <label>Couleur</label>
                <p>{userProfile.vehicle.color}</p>
              </div>
            </div>

            <button className="edit-button">Modifier les informations</button>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="profile-section">
            <h2>Préférences de navigation</h2>
            <div className="preference-list">
              <div className="preference-item">
                <div>
                  <h3>Éviter les péages</h3>
                  <p>Les itinéraires éviteront les routes à péage</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={userProfile.preferences.avoidTolls} onChange={() => {}} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <h3>Éviter les autoroutes</h3>
                  <p>Les itinéraires éviteront les autoroutes</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={userProfile.preferences.avoidHighways} onChange={() => {}} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <h3>Mode sombre</h3>
                  <p>Activer le thème sombre pour l'application</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={userProfile.preferences.darkMode} onChange={() => {}} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <h3>Notifications</h3>
                  <p>Recevoir des alertes sur les incidents et embouteillages</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={userProfile.preferences.notifications} onChange={() => {}} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <button className="save-button">Enregistrer les préférences</button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="profile-section">
            <h2>Sécurité du compte</h2>

            <div className="security-section">
              <h3>Changer le mot de passe</h3>
              <form className="password-form">
                <div className="form-group">
                  <label>Mot de passe actuel</label>
                  <input type="password" placeholder="Entrez votre mot de passe actuel" />
                </div>
                <div className="form-group">
                  <label>Nouveau mot de passe</label>
                  <input type="password" placeholder="Entrez votre nouveau mot de passe" />
                </div>
                <div className="form-group">
                  <label>Confirmer le mot de passe</label>
                  <input type="password" placeholder="Confirmez votre nouveau mot de passe" />
                </div>
                <button type="submit" className="change-password-button">
                  Changer le mot de passe
                </button>
              </form>
            </div>

            <div className="security-section">
              <h3>Authentification à deux facteurs</h3>
              <p>Ajoutez une couche de sécurité supplémentaire à votre compte</p>
              <button className="enable-2fa-button">Activer l'authentification à deux facteurs</button>
            </div>

            <div className="security-section">
              <h3>Sessions actives</h3>
              <p>Vous êtes actuellement connecté sur cet appareil</p>
              <button className="logout-all-button">Se déconnecter de tous les appareils</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profil
