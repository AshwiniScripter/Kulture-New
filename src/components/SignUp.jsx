import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { IoChevronBack, IoCheckmark, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: 'parthbhalala2101@gmail.com',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 font-mono text-neutral-300">
      {/* Container Frame */}
      <div className="w-full max-w-xs sm:max-w-sm bg-[#0d0d0d] border border-neutral-900 rounded-[30px] p-6 shadow-2xl flex flex-col justify-between min-h-640px">
        
        <div>
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="text-neutral-400 hover:text-white transition p-1 -ml-1 mb-6"
          >
            <IoChevronBack className="text-xl" />
          </button>

          {/* Page Heading */}
          <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white mb-8">
            CREATE YOUR ACCOUNT
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            
            {/* First Name & Last Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full bg-transparent border-b border-neutral-800 pb-2 text-neutral-200 outline-none focus:border-neutral-500 transition placeholder:text-neutral-600 text-xs tracking-wide"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full bg-transparent border-b border-neutral-800 pb-2 text-neutral-200 outline-none focus:border-neutral-500 transition placeholder:text-neutral-600 text-xs tracking-wide"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1 relative">
              <label className="block text-[10px] text-neutral-500 uppercase tracking-wider">
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-800 pb-2 text-neutral-200 outline-none focus:border-neutral-500 transition text-xs tracking-wide pr-6"
                  required
                />
                {/* Validation Checkmark Icon */}
                <IoCheckmark className="absolute right-0 text-neutral-400 text-sm mb-2" />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-1">
              <div className="flex items-center border-b border-neutral-800 pb-2 text-xs">
                <span className="text-neutral-500 pr-2 border-r border-neutral-800 mr-2">
                  +91
                </span>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full bg-transparent text-neutral-200 outline-none placeholder:text-neutral-600 tracking-wide"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1 relative">
              <div className="relative flex items-center border-b border-neutral-800 pb-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-transparent text-neutral-200 outline-none focus:border-neutral-500 transition placeholder:text-neutral-600 tracking-wide pr-8"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 text-neutral-500 hover:text-neutral-300 transition"
                >
                  {showPassword ? <IoEyeOffOutline className="text-sm" /> : <IoEyeOutline className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1 relative">
              <div className="relative flex items-center border-b border-neutral-800 pb-2">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full bg-transparent text-neutral-200 outline-none focus:border-neutral-500 transition placeholder:text-neutral-600 tracking-wide pr-8"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 text-neutral-500 hover:text-neutral-300 transition"
                >
                  {showConfirmPassword ? <IoEyeOffOutline className="text-sm" /> : <IoEyeOutline className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              {/* Primary Sign In / Sign Up Button */}
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

          </form>
        </div>

      </div>
    </div>
  );
};

export default SignUp;