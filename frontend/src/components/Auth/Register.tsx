// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast} from 'react-toastify'
import { FiEye, FiEyeOff } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css'
import api from '../../services/api';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState ('');
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

const validatePassword = (password: string): string | null => {
  const minLenght = 8;
  const hasUppercas = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLenght) {
    return `Password must be atleast ${minLenght} characters long.`;
  }
  if (!hasUppercas) {
    return `Password must contain at least one uppercase letter.`;
  }
  if (!hasNumber) {
    return `Password must contain at least one number.`;
  }
  if (!hasSpecialChar) {
    return `Password must contain at least one special character.`;
  }
  return null;
};

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  if (password !== ConfirmPassword) {
    toast.error('Passwords do not match.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setLoading(false);
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    toast.error(passwordError, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setLoading(false);
    return;
  }

  try {
    await api.post('/auth/register', { username, email, password, accepted_privacy_policy: acceptedPrivacyPolicy });
    toast.success('Registration successful! You can now log in.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Lägg till en fördröjning innan navigationen
    setTimeout(() => navigate('/login'), 3000);
  } catch (error) {
    console.error(error);
    toast.error('Registration failed. Please check your details.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } finally {
    setLoading(false);
  }
};

const togglePasswordVisibility = () => {
  setShowPassword((prev) => !prev);
};

const toggleConfirmPasswordVisibility = () => {
  setShowConfirmPassword((prev) => !prev);
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#EDECEB] dark:bg-[#101010] text-gray-900 dark:text-gray-100">
       <ToastContainer />
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister}>
          {/* Användarnamn */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white"
            />
          </div>

          {/* E-post */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              E-mail:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white"
            />
          </div>

          {/* Lösenord */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password:
            </label>
            <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300 focus:outline-none"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm password:
            </label>
            <div className="relative">
            <input
              id="ConfirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300 focus:outline-none"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="mb-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={acceptedPrivacyPolicy}
                onChange={(e) => setAcceptedPrivacyPolicy(e.target.checked)}
                required
                className="mr-2"
              />
              I accept the{' '}
              <a
              href="/privacy-policy" 
              className="text-[#D26000] hover:underline dark:text-[#D26000]"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Registrera-knapp */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-medium rounded bg-[#D26000] dark:bg-[#D26000] hover:bg[#ff7505] focus:outline-none focus:ring-2 focus:ring-[#ff7505] dark:focus:ring-[#ff7505] dark:hover:bg-[#ff7505] ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/* Länk till inloggning */}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-[#D26000] hover:underline dark:text-[#D26000]"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
