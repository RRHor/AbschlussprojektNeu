import React from 'react';
import RegisterForm from '../components/RegisterForm.jsx';

const Register = ({ onSuccess }) => {
  return (
    <div className="register-page">
      <RegisterForm onSuccess={onSuccess} />
    </div>
  );
};

export default Register;