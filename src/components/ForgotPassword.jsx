import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoCheckmarkCircleOutline } from 'react-icons/io5';
import authService from '../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authService.sendOtp(email);
      if (result && result.success) {
        setStep(2);
      } else {
        setError(result?.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authService.verifyOtp(email, otp);
      if (result && result.success) {
        setVerificationToken(result.verification_token);
        setStep(3);
      } else {
        setError(result?.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const result = await authService.resetPassword(email, verificationToken, newPassword);
      if (result && result.success) {
        navigate('/login', { replace: true });
      } else {
        setError(result?.message || 'Password reset failed.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-xs sm:max-w-sm bg-[#0d0d0d] border border-neutral-900 rounded-[40px] overflow-hidden shadow-2xl flex flex-col pb-10">

        <div className="flex items-center justify-between px-6 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-neutral-400 hover:text-white transition p-1 -ml-1"
          >
            <IoChevronBack className="text-xl" />
          </button>
          <span className="text-[10px] text-neutral-600 tracking-widest uppercase">
            Step {step} of 3
          </span>
        </div>

        <div className="px-6 pt-4">
          <h1 className="text-xl font-black tracking-wider uppercase text-white mb-1">
            Forgot Password
          </h1>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            {step === 1 && 'Enter your registered email to receive a one-time password (valid for 5 minutes).'}
            {step === 2 && 'Enter the 6-digit OTP sent to your email.'}
            {step === 3 && 'Choose a new password for your account.'}
          </p>
        </div>

        <form onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword} className="px-6 pt-6 space-y-5 text-neutral-400 text-xs">
          {step === 1 && (
            <div className="space-y-1">
              <label className="block text-[10px] text-neutral-500 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent border-b border-neutral-800 pb-2 text-neutral-200 outline-none focus:border-neutral-500 transition text-xs tracking-wide"
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-1">
              <label className="block text-[10px] text-neutral-500 uppercase tracking-wider">OTP</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit code"
                className="w-full bg-transparent border-b border-neutral-800 pb-2 text-neutral-200 outline-none focus:border-neutral-500 transition text-xs tracking-widest"
                required
              />
            </div>
          )}

          {step === 3 && (
            <>
              <div className="space-y-1">
                <label className="block text-[10px] text-neutral-500 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full bg-transparent border-b border-neutral-800 pb-2 text-neutral-200 outline-none focus:border-neutral-500 transition text-xs tracking-wide"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-neutral-500 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-transparent border-b border-neutral-800 pb-2 text-neutral-200 outline-none focus:border-neutral-500 transition text-xs tracking-wide"
                  required
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-[11px]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5a5a5a] hover:bg-[#6e6e6e] disabled:opacity-60 text-neutral-200 text-xs font-semibold tracking-widest py-3 rounded-full uppercase transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading && <IoCheckmarkCircleOutline className="text-sm animate-spin" />}
            {step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;
