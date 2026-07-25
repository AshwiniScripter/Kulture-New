import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { IoEyeOutline, IoEyeOffOutline, IoCheckmarkSquare } from 'react-icons/io5';

const SignIn = () => {
  const [email, setEmail] = useState('parthbhalala@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 font-mono">
      {/* Mobile Device Frame Container */}
      <div className="w-full max-w-xs sm:max-w-sm bg-[#0d0d0d] border border-neutral-900 rounded-[40px] overflow-hidden shadow-2xl flex flex-col pb-8">
        
        {/* Status Bar Mockup */}
        <div className="flex justify-between items-center px-6 pt-3 text-neutral-400 text-xs font-semibold select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1 text-[10px]">
            <span>􀁗</span> {/* Signal */}
            <span>􀙇</span> {/* Wifi */}
            <span>􀛨</span> {/* Battery */}
          </div>
        </div>

        {/* Hero Image Header */}
        <div className="px-3 pt-2">
          <div className="relative w-full h-64 rounded-b-[40px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800"
              alt="Friends smiling"
              className="w-full h-full object-cover"
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
              <IoCheckmarkSquare 
                className={`text-sm ${rememberMe ? 'text-neutral-300' : 'text-neutral-700'}`} 
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              className="hover:text-neutral-200 transition"
            >
              Forgot Password?
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-3">
            {/* Primary Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#5a5a5a] hover:bg-[#6e6e6e] text-neutral-200 text-xs font-semibold tracking-widest py-3 rounded-full uppercase transition active:scale-[0.98]"
            >
              SIGN IN
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