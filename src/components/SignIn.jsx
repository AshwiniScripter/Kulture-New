import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { IoEyeOutline, IoEyeOffOutline, IoCheckbox } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import signin from '../assets/sign-in.jpeg';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result && result.success) {
        navigate('/profile', { replace: true });
      } else {
        setError(result?.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 pt-24 pb-12 font-mono">
      {/* Mobile Device Frame Container */}
      <div className="w-full max-w-xs sm:max-w-sm bg-[#0d0d0d] border border-neutral-900 rounded-[40px] overflow-hidden shadow-2xl flex flex-col pb-8 my-6">
        
        {/* Hero Storefront Image Header */}
        <div className="px-3 pt-3">
          <div className="relative w-full h-72 rounded-t-[30px] rounded-b-[30px] overflow-hidden bg-black flex items-center justify-center">
            <img
              src={signin}
              alt="Kulture Vintage Store Front"
              className="w-full h-full object-contain rounded-t-[30px]"
            />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="px-6 pt-6 space-y-5 text-neutral-400 text-xs">
          
          {/* Email Input */}
          <div className="space-y-1">
            <label className="block text-[10px] text-neutral-500 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-800 pb-2 text-neutral-200 outline-none focus:border-neutral-500 transition text-xs tracking-wide"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1 relative">
            <label className="block text-[10px] text-neutral-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent border-b border-neutral-800 pb-2 text-neutral-200 outline-none focus:border-neutral-500 transition text-xs tracking-wide pr-8"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 pb-2 text-neutral-500 hover:text-neutral-300 transition"
              >
                {showPassword ? <IoEyeOffOutline className="text-sm" /> : <IoEyeOutline className="text-sm" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="hidden"
              />
              <IoCheckbox 
                className={`text-sm ${rememberMe ? 'text-neutral-300' : 'text-neutral-700'}`} 
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="hover:text-neutral-200 transition"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-[11px] tracking-wide">{error}</p>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-3">
            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5a5a5a] hover:bg-[#6e6e6e] disabled:opacity-60 text-neutral-200 text-xs font-semibold tracking-widest py-3 rounded-full uppercase transition active:scale-[0.98]"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>

            {/* Google Sign In Button */}
            <button
              type="button"
              className="w-full bg-transparent border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-semibold tracking-wider py-2.5 rounded-full flex items-center justify-center gap-2 uppercase transition active:scale-[0.98]"
            >
              <FcGoogle className="text-base" />
              <span>SIGN IN WITH GOOGLE</span>
            </button>
          </div>

          {/* Register Footer */}
          <div className="text-center pt-2 text-[11px] text-neutral-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-neutral-400 hover:text-white transition font-medium underline"
            >
              Register
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default SignIn;