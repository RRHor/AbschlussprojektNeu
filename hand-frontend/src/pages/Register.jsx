import RegisterForm from '../components/RegisterForm.jsx';

const Register = ({ onSuccess }) => {
  return (
    <div>
      <RegisterForm onSuccess={onSuccess} />
    </div>
  );
};
export default Register;