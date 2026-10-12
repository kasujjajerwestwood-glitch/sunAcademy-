import React, { useState } from 'react';
import { UserProfile } from '../../types/builder';
import { signInUser, saveUser } from '../../lib/database';
import { X, Lock, Mail, Phone, MapPin, User, ShieldCheck, Sparkles, Check, School, Cpu, Award } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

const DEMO_ACCOUNTS: Array<{ name: string; email: string; role: 'Student' | 'Educator' | 'Maker'; badge: string }> = [
  { name: 'Kasujja Jerwestwood', email: 'kasujjajerwestwood@gmail.com', role: 'Maker', badge: 'Creator' },
  { name: 'Alex Turner', email: 'alex.turner@sunacademy.edu', role: 'Student', badge: 'Robotics 101' },
  { name: 'Sarah Chen', email: 'sarah.chen@stanford.edu', role: 'Student', badge: 'Arduino Lab' },
  { name: 'Prof. David Miller', email: 'david.miller@mit.edu', role: 'Educator', badge: 'Instructor' }
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'quickpass'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [street, setStreet] = useState('742 Hardware Way, Suite 101');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zipCode, setZipCode] = useState('94107');
  const [country, setCountry] = useState('United States');
  const [role, setRole] = useState<'Student' | 'Educator' | 'Maker'>('Maker');
  const [error, setError] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSocialSignIn = (provider: 'google' | 'github') => {
    setLoadingProvider(provider);
    setError('');

    setTimeout(() => {
      let socialUser: UserProfile;
      if (provider === 'google') {
        socialUser = {
          id: `usr-google-${Date.now()}`,
          name: name.trim() || 'Kasujja Jerwestwood',
          email: email.trim() || 'kasujjajerwestwood@gmail.com',
          phone: '+1 (555) 234-5678',
          address: {
            street: '742 Hardware Way, Suite 101',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94107',
            country: 'United States'
          },
          role: 'Maker',
          createdAt: new Date().toISOString()
        };
      } else {
        socialUser = {
          id: `usr-github-${Date.now()}`,
          name: 'Hardware Maker (GitHub)',
          email: 'maker@github.sunacademy.io',
          phone: '+1 (555) 888-9999',
          address: {
            street: '100 GitHub Way',
            city: 'Austin',
            state: 'TX',
            zipCode: '78701',
            country: 'United States'
          },
          role: 'Maker',
          createdAt: new Date().toISOString()
        };
      }

      saveUser(socialUser);
      onSuccess(socialUser);
      setLoadingProvider(null);
      onClose();
    }, 400);
  };

  const handleQuickDemoPass = (account: typeof DEMO_ACCOUNTS[0]) => {
    const demoUser: UserProfile = {
      id: `usr-${account.role.toLowerCase()}-${Date.now()}`,
      name: account.name,
      email: account.email,
      phone: '+1 (555) 345-6789',
      address: {
        street: '123 Innovation Boulevard',
        city: 'Boston',
        state: 'MA',
        zipCode: '02138',
        country: 'United States'
      },
      role: account.role,
      createdAt: new Date().toISOString()
    };
    saveUser(demoUser);
    onSuccess(demoUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide an email address.');
      return;
    }

    if (mode === 'signin') {
      const user = signInUser(email, password || 'password123');
      onSuccess(user);
      onClose();
    } else {
      if (!name) {
        setError('Please enter your full name.');
        return;
      }
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        phone,
        address: {
          street,
          city,
          state,
          zipCode,
          country
        },
        role,
        createdAt: new Date().toISOString()
      };
      saveUser(newUser);
      onSuccess(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0084FF] to-amber-500 p-0.5 flex items-center justify-center shadow-sm">
              <div className="w-full h-full bg-[#1B2733] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Sun Academy</span>
                <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950/60 text-[#0084FF] px-1.5 py-0.5 rounded font-bold">
                  STUDIO
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {mode === 'quickpass'
                  ? 'Instant 1-click access without password'
                  : mode === 'signin'
                  ? 'Sign in to access your saved circuits and tutorials'
                  : 'Set up your maker profile and hardware delivery address'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Fast Social & Demo Login Section */}
        <div className="p-5 pb-3 space-y-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Google Sign-in */}
            <button
              type="button"
              onClick={() => handleSocialSignIn('google')}
              disabled={!!loadingProvider}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loadingProvider === 'google' ? 'Connecting...' : 'Google'}</span>
            </button>

            {/* GitHub Sign-in */}
            <button
              type="button"
              onClick={() => handleSocialSignIn('github')}
              disabled={!!loadingProvider}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>{loadingProvider === 'github' ? 'Connecting...' : 'GitHub'}</span>
            </button>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setMode('quickpass')}
              className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer border ${
                mode === 'quickpass'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Student & Educator Demo Passes</span>
              </div>
              <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded font-mono">
                1-CLICK
              </span>
            </button>
          </div>
        </div>

        {/* Tab switch (Sign In / Register / QuickPass) */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'border-b-2 border-[#0084FF] text-[#0084FF] font-bold bg-blue-50/50 dark:bg-blue-950/20'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Email Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'border-b-2 border-[#0084FF] text-[#0084FF] font-bold bg-blue-50/50 dark:bg-blue-950/20'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body or QuickPass Grid */}
        {mode === 'quickpass' ? (
          <div className="p-5 space-y-3">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Select any verified Sun Academy demo profile to immediately start wiring circuits and running simulations:
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickDemoPass(acc)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0084FF] hover:bg-blue-50/60 dark:hover:bg-blue-950/30 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0084FF] text-white flex items-center justify-center font-bold text-xs">
                      {acc.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#0084FF]">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {acc.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {acc.badge}
                    </span>
                    <span className="text-xs text-[#0084FF] font-bold group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3 max-h-[65vh] overflow-y-auto text-xs">
            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kasujja Jerwestwood"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0084FF]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kasujjajerwestwood@gmail.com"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0084FF]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === 'signin' && (
                  <span className="text-[10px] text-slate-400">Default: password123</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0084FF]"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0084FF]"
                    />
                  </div>
                </div>

                {/* Physical Address Section */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#0084FF]" />
                    <span>Physical / Shipping Address</span>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Street Address"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0084FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0084FF]"
                    />
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State / Province"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0084FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="ZIP / Postal Code"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0084FF]"
                    />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0084FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0084FF]"
                  >
                    <option value="Maker">Hardware Maker & Hobbyist</option>
                    <option value="Student">Student</option>
                    <option value="Educator">Teacher / Educator</option>
                  </select>
                </div>
              </>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0084FF] hover:bg-[#0070E0] active:bg-[#005DBF] text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                {mode === 'signin' ? 'Sign In' : 'Complete Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
