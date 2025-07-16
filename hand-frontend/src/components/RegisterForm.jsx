import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import logo from "../assets/logo.png";
import register from "../assets/animation/Animation - register.json";
import Lottie from "lottie-react";
// Die API-Basis-URL wird aus der .env-Datei gelesen.
// Vorteil: Du musst die URL nur an einer Stelle (in .env) ändern, nicht im Code!
const API_URL = import.meta.env.VITE_API_URL;

const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();

   // Hier werden die Werte aus dem Formular gespeichert
  // Die Formulardaten werden flach gehalten, aber beim Absenden als addresses-Array umgewandelt
  const [formData, setFormData] = useState({

    nickname: '',
    email: '',
    password: '',
    firstName: '', // Wird in die Adresse verschoben (DSGVO: optional)
    lastName: '',  // Wird in die Adresse verschoben (DSGVO: optional)
    street: '',
    city: '',
    district: '',
    zip: '',

  });

  // // Speichert, ob Feld verlassen wurde UND Inhalt hat
  // const [touchedFields, setTouchedFields] = useState({
  //   nickname: false,
  //   email: false,
  //   password: false,
  //   firstName: false,
  //   lastName: false,
  //   street: false,
  //   city: false,
  //   district: false,
  //   zip: false,
  // });


  // Für Fehlermeldungen und Status
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Wird aufgerufen, wenn ein Feld geändert wird
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Wird aufgerufen, wenn ein Feld verlassen wird (für Styling)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const isFilled = value.trim() !== "";
    setTouchedFields((prev) => ({
      ...prev,
      [name]: isFilled,
    }));
  };

  // Prüft, ob alle Felder ausgefüllt sind
  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        errors[key] = "Dieses Feld darf nicht leer sein.";
      }
    });
    return errors;
  };

  // Wird beim Klick auf "Registrieren" ausgeführt
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setFormErrors({});

    // Prüfe, ob alle Felder ausgefüllt sind
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {

      // const response = await fetch('http://localhost:4000/api/register', {
      
      // Sende die Daten an das Backend (API)
      // Die URL kommt aus der .env-Datei!
      // Beim Absenden werden die Adressdaten als Array gesendet,
      // damit ein User mehrere Adressen haben kann.
      // firstName und lastName sind in der Adresse gespeichert (DSGVO: optional, nur für Nachbarschaftskontakt)
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
          addresses: [
            {
              firstName: formData.firstName, // Datenschutz: optional
              lastName: formData.lastName,   // Datenschutz: optional
              street: formData.street,
              city: formData.city,
              district: formData.district,
              zip: parseInt(formData.zip, 10),
            }
          ],
        }),
      });

      const data = await response.json();
      if (response.ok) {

        // Bei Erfolg: Token speichern, Callback ausführen, zur Login-Seite weiterleiten
        localStorage.setItem('token', data.token);
        onSuccess(data);
        navigate("/login");
      } else {
        setMessage(`❌ Fehler: ${data.message || "Unbekannter Fehler"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Serverfehler.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldLabels = {
    nickname: "Spitzname",
    email: "E-Mail",
    password: "Passwort",
    firstName: "Vorname",
    lastName: "Nachname",
    street: "Straße",
    city: "Stadt",
    district: "Landkreis oder Stadtteil",
    zip: "PLZ",
  };

  return (
    <div className="register-section">
      <div className="register-form-container">
        {/* Animation on the left */}
        <div className="animation-container">
          <Lottie
            animationData={register}
            loop={true}
            className="register-animation"
          />
        </div>
        {/* Form on the right */}
        <div className="form-card">
          <h2 className="register-title">Hand in Hand Registrieren</h2>
          <form onSubmit={handleSubmit} className="register-form" noValidate>
            {Object.keys(fieldLabels).map((field) => (
              <label key={field} className="register-label">
                {fieldLabels[field]}:
                <input
                  type={
                    field === 'email'
                      ? 'email'
                      : field === 'password'
                      ? 'password'
                      : field === 'zip'
                      ? 'number'
                      : 'text'
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`register-input ${
                    touchedFields[field] ? 'filled' : ''
                  }`}
                  autoComplete="off"
                />
                {formErrors[field] && (
                  <p className="register-warning">{formErrors[field]}</p>
                )}
              </label>
            ))}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`register-button ${isSubmitting ? 'disabled' : ''}`}
            >
              {isSubmitting ? 'Wird gesendet…' : 'Registrieren'}
            </button>
            {message && <p className="register-warning">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
