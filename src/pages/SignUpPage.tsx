import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Facebook, X, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../lib/auth';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp(email, password, name);
      // Show success message and redirect to login
      alert('Please check your email to confirm your account');
      navigate('/login');
    } catch (error) {
      let errorMessage = 'An error occurred during signup';
      
      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          errorMessage = 'This email is already registered. Please try logging in instead.';
        } else {
          errorMessage = error.message;
        }
      }
      
      console.error('Signup error:', errorMessage);
      
      // Show error message in a more user-friendly way
      const errorDiv = document.createElement('div');
      errorDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        isDarkMode 
          ? 'bg-red-500/20 border border-red-500/30 text-white' 
          : 'bg-red-100 border border-red-200 text-red-800'
      } backdrop-blur-md animate-fade-in z-50`;
      errorDiv.textContent = errorMessage;
      document.body.appendChild(errorDiv);
      
      // Remove error message after 5 seconds
      setTimeout(() => {
        errorDiv.classList.add('animate-fade-out');
        setTimeout(() => errorDiv.remove(), 500);
      }, 5000);
      
      // If user already exists, offer to redirect to login
      if (error.message.includes('User already registered')) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-5">
      <div className="glass-card max-w-md w-full p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Name</label>
            <div className="glass-input flex items-center">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent flex-1 text-white outline-none"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Email</label>
            <div className="glass-input flex items-center">
              <Mail className="w-5 h-5 text-white/50 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 text-white outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Password</label>
            <div className="glass-input flex items-center">
              <Lock className="w-5 h-5 text-white/50 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent flex-1 text-white outline-none"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full glass-button bg-emerald-500/10 hover:bg-emerald-500/20 
                     text-emerald-200 hover:text-emerald-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-white/50 glass">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button className="glass-button flex items-center justify-center">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="glass-button flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
            <button className="glass-button flex items-center justify-center">
              <Instagram className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-white/70">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-white hover:text-white/90 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}