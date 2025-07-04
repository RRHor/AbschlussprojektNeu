import React from 'react';
import RegisterForm from '../components/RegisterForm.jsx';
import Footer from '../components/Footer';

const Register = ({ onSuccess }) => {
  return (
    <div className="register-page">
      <RegisterForm onSuccess={onSuccess} />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Register;