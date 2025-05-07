import React from "react";
import { QRCodeCanvas } from "qrcode.react";  // Changement ici : on importe QRCodeCanvas

const QRGenerator = ({ route }) => {
  const generateQRCode = () => {
    const routeData = JSON.stringify(route); // Convertir les données de l'itinéraire en chaîne JSON
    return <QRCodeCanvas value={routeData} size={256} />;
  };
  const routeString = JSON.stringify(route);

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>Générer un code QR pour cet itinéraire :</h4>
      <QRCodeCanvas value={routeString} size={256} /> {/* Remplacement ici */}
      <p>Scannez ce code avec votre téléphone pour voir l'itinéraire.</p>
    </div>
  );
};

export default QRGenerator;