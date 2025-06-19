import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, API_BASE_URL } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    newPassword: '',
  });

  const [mode, setMode] = useState('login'); 

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const apiPost = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Request failed');
    }
    return res.json();
  };

  const handleNormalLogin = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRequestOtpLogin = async (e) => {
    e.preventDefault();
    try {
      await apiPost(`${API_BASE_URL}/api/auth/request-otp-login`, { email: formData.email });
      alert('OTP sent to your email');
      setMode('otpLoginVerify');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerifyOtpLogin = async (e) => {
    e.preventDefault();
    try {
      await apiPost(`${API_BASE_URL}/api/auth/verify-otp-login`, {
        email: formData.email,
        otp: formData.otp,
      });

      alert('Login successful!');
      window.location.href = '/'; // reload to trigger context check
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRequestForgetPassword = async (e) => {
    e.preventDefault();
    try {
      await apiPost(`${API_BASE_URL}/api/auth/forget-password`, { email: formData.email });
      alert('Password reset OTP sent to your email');
      setMode('forgetPasswordReset');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await apiPost(`${API_BASE_URL}/api/auth/reset-password`, {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      alert('Password reset successful! Please login with your new password.');
      setMode('login');
      setFormData({ email: '', password: '', otp: '', newPassword: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          {{
            login: 'Login to VolunteerHub',
            otpLoginRequest: 'Login with OTP',
            otpLoginVerify: 'Verify OTP',
            forgetPasswordRequest: 'Forget Password',
            forgetPasswordReset: 'Reset Password',
          }[mode]}
        </h2>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleNormalLogin} className="space-y-4">
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
            <SubmitButton text="Login" />
            <div className="mt-4 flex justify-between text-sm">
              <LinkButton text="Login with OTP" onClick={() => setMode('otpLoginRequest')} />
              <LinkButton text="Forgot Password?" onClick={() => setMode('forgetPasswordRequest')} />
            </div>
          </form>
        )}

        {/* OTP Login Request */}
        {mode === 'otpLoginRequest' && (
          <form onSubmit={handleRequestOtpLogin} className="space-y-4">
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
            <SubmitButton text="Send OTP" />
            <BackButton onClick={() => setMode('login')} />
          </form>
        )}

        {/* OTP Login Verify */}
        {mode === 'otpLoginVerify' && (
          <form onSubmit={handleVerifyOtpLogin} className="space-y-4">
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="OTP" name="otp" value={formData.otp} onChange={handleChange} />
            <SubmitButton text="Verify & Login" />
            <BackButton onClick={() => setMode('otpLoginRequest')} />
          </form>
        )}

        {/* Forget Password Request */}
        {mode === 'forgetPasswordRequest' && (
          <form onSubmit={handleRequestForgetPassword} className="space-y-4">
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
            <SubmitButton text="Send Reset OTP" />
            <BackButton onClick={() => setMode('login')} />
          </form>
        )}

        {/* Password Reset */}
        {mode === 'forgetPasswordReset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="OTP" name="otp" value={formData.otp} onChange={handleChange} />
            <Input label="New Password" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
            <SubmitButton text="Reset Password" />
            <BackButton onClick={() => setMode('login')} />
          </form>
        )}

        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{' '}
          <span
            className="text-indigo-600 hover:underline cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

// Reusable Components
const Input = ({ label, type = 'text', name, value, onChange }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      name={name}
      onChange={onChange}
      value={value}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
      required
    />
  </div>
);

const SubmitButton = ({ text }) => (
  <button
    type="submit"
    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
  >
    {text}
  </button>
);

const BackButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="mt-2 w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
  >
    Back
  </button>
);

const LinkButton = ({ text, onClick }) => (
  <button type="button" className="text-indigo-600 hover:underline" onClick={onClick}>
    {text}
  </button>
);

export default LoginForm;
