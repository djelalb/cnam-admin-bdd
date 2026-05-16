import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, HardDrive, AlertCircle, CheckCircle2, ShieldPlus, DatabaseZap, Save, RotateCcw } from 'lucide-react';

const AdminActions = () => {
  const [dbName, setDbName] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [backupDb, setBackupDb] = useState('');
  const [backupPath, setBackupPath] = useState('/var/opt/mssql/data/backup.bak');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleAction = async (endpoint, data) => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.post(`http://localhost:5000/api/admin/${endpoint}`, data);
      setMessage({ text: response.data.message, type: 'success' });
      // Reset relevant fields on success
      if (endpoint.includes('create')) {
        if (endpoint.includes('databases')) setDbName('');
        if (endpoint.includes('logins')) { setLoginName(''); setLoginPassword(''); }
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.error || err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#0f172a] h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-4">
            <div className="bg-blue-600/20 p-2.5 rounded-xl border border-blue-500/30">
              <DatabaseZap className="text-blue-500 w-8 h-8" />
            </div>
            Actions d'Administration
          </h2>
          <p className="text-slate-400 text-sm ml-14">Gérez vos bases de données, vos accès de sécurité et vos sauvegardes en toute simplicité.</p>
        </header>

        {message.text && (
          <div className={`mb-8 p-5 rounded-2xl flex items-center gap-4 border animate-in zoom-in duration-300 shadow-lg ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5' 
              : 'bg-red-500/10 border-red-500/30 text-red-400 shadow-red-500/5'
          }`}>
            <div className={`p-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <span className="font-semibold tracking-wide">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Database Management */}
          <section className="bg-slate-800/40 backdrop-blur-md p-7 rounded-3xl border border-slate-700/50 shadow-xl hover:border-blue-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 tracking-tight">Gestion des Bases</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-widest ml-1">Nom de la base de données</label>
                <input
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm placeholder:text-slate-700"
                  placeholder="ex: MaNouvelleBase"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleAction('databases/create', { name: dbName })}
                  disabled={loading || !dbName}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Créer
                </button>
                <button
                  onClick={() => handleAction('databases/drop', { name: dbName })}
                  disabled={loading || !dbName}
                  className="flex-1 bg-slate-700 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 border border-slate-600/50 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </section>

          {/* Login Management */}
          <section className="bg-slate-800/40 backdrop-blur-md p-7 rounded-3xl border border-slate-700/50 shadow-xl hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldPlus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 tracking-tight">Accès & Sécurité</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-widest ml-1">Utilisateur (Login)</label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm placeholder:text-slate-700"
                    placeholder="ex: app_user"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-widest ml-1">Mot de passe</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm placeholder:text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleAction('logins/create', { name: loginName, password: loginPassword })}
                  disabled={loading || !loginName || !loginPassword}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Créer Login
                </button>
                <button
                  onClick={() => handleAction('logins/drop', { name: loginName })}
                  disabled={loading || !loginName}
                  className="flex-1 bg-slate-700 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 border border-slate-600/50 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </section>

          {/* Backup & Restore Management */}
          <section className="bg-slate-800/40 backdrop-blur-md p-7 rounded-3xl border border-slate-700/50 shadow-xl hover:border-purple-500/30 transition-all duration-300 group lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                <HardDrive className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 tracking-tight">Sauvegarde & Restauration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-3 space-y-2">
                <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-widest ml-1">Base de données cible</label>
                <input
                  type="text"
                  value={backupDb}
                  onChange={(e) => setBackupDb(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm placeholder:text-slate-700"
                  placeholder="Nom de la base"
                />
              </div>
              <div className="md:col-span-5 space-y-2">
                <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-widest ml-1">Chemin du fichier (.bak)</label>
                <input
                  type="text"
                  value={backupPath}
                  onChange={(e) => setBackupPath(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm font-mono placeholder:text-slate-700"
                  placeholder="/var/opt/mssql/data/..."
                />
              </div>
              <div className="md:col-span-4 flex gap-3">
                <button
                  onClick={() => handleAction('databases/backup', { name: backupDb, path: backupPath })}
                  disabled={loading || !backupDb || !backupPath}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </button>
                <button
                  onClick={() => handleAction('databases/restore', { name: backupDb, path: backupPath })}
                  disabled={loading || !backupDb || !backupPath}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  title="Restaurer la base à partir du fichier (écrase l'existante)"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurer
                </button>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-start gap-3 bg-purple-500/5 p-4 rounded-xl border border-purple-500/10">
                <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  Note : La restauration <strong>écrase</strong> la base de données existante. Assurez-vous qu'aucune transaction n'est en cours.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminActions;
