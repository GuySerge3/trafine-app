import React, { useState, useEffect } from "react";

const AlertNotification = ({ incident }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000); // Notification disparaît après 5 secondes
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      marginBottom: "10px", 
      padding: "10px",
      top: "20px", 
      left: "50%", 
      transform: "translateX(-50%)", 
      backgroundColor: "red", 
      color: "white", 
      padding: "10px", 
      borderRadius: "8px"
    }}>
      <strong>Alerte : </strong>{incident.type} - {incident.description}
    </div>
  );
};

export default AlertNotification;