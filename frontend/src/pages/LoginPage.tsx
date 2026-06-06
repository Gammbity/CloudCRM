import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Cloud, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@crmcloud.uz');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // error is already set in useAuth
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-600 rounded-lg mb-3 shadow-md">
            <Cloud className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-amber-900">CRM Cloud</h1>
          <p className="text-amber-700 mt-1 text-sm">Wholesale Fashion Management</p>
        </div>

        <div className="card max-w-md mx-auto p-8">
          <h2 className="text-lg font-semibold text-amber-900 mb-4">Welcome back</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-amber-50/60 rounded-lg">
            <p className="text-xs text-amber-700 font-medium mb-1">Demo credentials:</p>
            <p className="text-xs text-amber-700">Admin: admin@crmcloud.uz / admin123</p>
            <p className="text-xs text-amber-700">Sales: sales1@crmcloud.uz / sales123</p>
          </div>
        </div>

        <p className="text-center text-amber-700 text-xs mt-6">
          BTEC Unit 6 — Cloud Network Infrastructure
        </p>
      </div>
    </div>
  );
}
