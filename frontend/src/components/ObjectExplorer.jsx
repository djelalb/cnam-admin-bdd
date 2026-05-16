import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, User, ChevronDown, ChevronRight, RefreshCw, Server, ShieldCheck } from 'lucide-react';

const ObjectExplorer = ({ activeConnection }) => {
  const [databases, setDatabases] = useState([]);
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({ databases: true, logins: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dbRes, loginRes] = await Promise.all([
        axios.get('http://localhost:5000/api/explorer/databases'),
        axios.get('http://localhost:5000/api/explorer/logins')
      ]);
      setDatabases(dbRes.data);
      setLogins(loginRes.data);
    } catch (err) {
      console.error('Failed to fetch explorer data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeConnection]);

  const toggle = (section) => {
    setExpanded({ ...expanded, [section]: !expanded[section] });
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] border-r border-slate-700/50 w-72 overflow-hidden shadow-2xl z-30">
      {/* Explorer Header */}
      <div className="p-5 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <Server className="w-5 h-5 text-blue-500" />
          <h3 className="text-slate-100 font-bold text-xs uppercase tracking-[0.15em]">Explorateur</h3>
        </div>
        <button 
          onClick={fetchData} 
          disabled={loading}
          className="text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 p-1.5 rounded-lg transition-all disabled:opacity-30"
          title="Actualiser"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Explorer Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
        {/* Databases Section */}
        <div className="space-y-1">
          <button 
            onClick={() => toggle('databases')}
            className="flex items-center gap-2 w-full text-left text-slate-300 hover:bg-slate-700/40 p-2 rounded-xl transition-all text-[13px] font-semibold group"
          >
            <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
              {expanded.databases ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            <Database className="w-4 h-4 text-blue-500/80" />
            <span>Bases de données</span>
            <span className="ml-auto bg-slate-700/50 text-[10px] px-1.5 py-0.5 rounded-md text-slate-400 group-hover:bg-slate-700 transition-colors">
              {databases.length}
            </span>
          </button>
          
          {expanded.databases && (
            <div className="ml-4 pl-4 border-l border-slate-700/50 space-y-0.5 py-1 animate-in slide-in-from-left-2 duration-200">
              {databases.length === 0 && !loading && (
                <div className="text-slate-500 text-[11px] py-2 px-3 italic">Aucune base utilisateur</div>
              )}
              {databases.map(db => (
                <div 
                  key={db.database_id} 
                  className="flex items-center gap-3 text-slate-400 hover:text-slate-100 cursor-pointer py-1.5 px-3 hover:bg-slate-700/30 rounded-lg text-xs transition-all group"
                  title={`Créée le : ${new Date(db.create_date).toLocaleString()}`}
                >
                  <Database className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400/70 transition-colors" />
                  <span className="truncate">{db.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logins Section */}
        <div className="space-y-1 pt-2">
          <button 
            onClick={() => toggle('logins')}
            className="flex items-center gap-2 w-full text-left text-slate-300 hover:bg-slate-700/40 p-2 rounded-xl transition-all text-[13px] font-semibold group"
          >
            <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
              {expanded.logins ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
            <span>Sécurité / Logins</span>
            <span className="ml-auto bg-slate-700/50 text-[10px] px-1.5 py-0.5 rounded-md text-slate-400 group-hover:bg-slate-700 transition-colors">
              {logins.length}
            </span>
          </button>
          
          {expanded.logins && (
            <div className="ml-4 pl-4 border-l border-slate-700/50 space-y-0.5 py-1 animate-in slide-in-from-left-2 duration-200">
              {logins.map(login => (
                <div 
                  key={login.name} 
                  className="flex items-center gap-3 text-slate-400 hover:text-slate-100 cursor-pointer py-1.5 px-3 hover:bg-slate-700/30 rounded-lg text-xs transition-all group"
                >
                  <User className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400/70 transition-colors" />
                  <span className="truncate">{login.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Connection Info */}
      <div className="p-4 bg-slate-900/80 border-t border-slate-700/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Connecté à</p>
            <p className="text-xs text-blue-400 truncate font-mono font-medium">{activeConnection?.server}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectExplorer;
