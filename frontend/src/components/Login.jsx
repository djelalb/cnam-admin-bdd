import React, { useState } from 'react';
import axios from 'axios';
import { Database, Shield, Server, Lock, User, Info, AlertCircle } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    server: 'localhost',
    database: 'master',
    user: 'sa',
    password: 'Password123!',
    authType: 'sql'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      onLoginSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion échouée. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                <Database className="text-white w-10 h-10" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-center text-white mb-2 tracking-tight">SSMS Web</h2>
            <p className="text-slate-400 text-center mb-8 text-sm">Gestionnaire SQL Server moderne</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Instance Serveur</label>
                <div className="relative group">
                  <Server className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    name="server"
                    value={formData.server}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm placeholder:text-slate-600"
                    placeholder="ex: localhost, 192.168.1.100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Base de données</label>
                  <input
                    type="text"
                    name="database"
                    value={formData.database}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm placeholder:text-slate-600"
                    placeholder="master"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Authentification</label>
                  <select
                    name="authType"
                    value={formData.authType}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="sql">SQL Server Auth</option>
                    <option value="windows">Windows Auth</option>
                  </select>
                </div>
              </div>

              {formData.authType === 'sql' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="space-y-1.5">
                    <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Utilisateur</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        name="user"
                        value={formData.user}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm placeholder:text-slate-600"
                        placeholder="sa"
                        required={formData.authType === 'sql'}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Mot de passe</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm placeholder:text-slate-600"
                        placeholder="••••••••"
                        required={formData.authType === 'sql'}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connexion...
                  </>
                ) : 'Se connecter'}
              </button>
            </form>
          </div>
          
          <div className="bg-slate-900/50 border-t border-slate-700/50 p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pour une connexion locale (Docker), utilisez <span className="text-slate-400 font-mono">localhost</span> avec l'utilisateur <span className="text-slate-400 font-mono">sa</span>. Assurez-vous que le port 1433 est ouvert.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
