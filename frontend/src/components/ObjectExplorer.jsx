import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Database, User, ChevronDown, ChevronRight, RefreshCw, Server, ShieldCheck, Table as TableIcon } from 'lucide-react';

const ObjectExplorer = ({ activeConnection, onSelectTable }) => {
  const [databases, setDatabases] = useState([]);
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ databases: true, logins: false });
  const [dbTables, setDbTables] = useState({}); // { dbName: [tables] }
  const [loadingTables, setLoadingTables] = useState({});

  // Use a ref to track if we've initialized for the current connection
  const initializedRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dbRes, loginRes] = await Promise.all([
        axios.get('http://localhost:5000/api/explorer/databases'),
        axios.get('http://localhost:5000/api/explorer/logins')
      ]);
      setDatabases(dbRes.data.map(db => ({ ...db, isExpanded: false })));
      setLogins(loginRes.data);
    } catch (err) {
      console.error('Failed to fetch explorer data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async (dbName) => {
    if (dbTables[dbName] || loadingTables[dbName]) return;
    
    setLoadingTables(prev => ({ ...prev, [dbName]: true }));
    try {
      const response = await axios.get(`http://localhost:5000/api/explorer/databases/${dbName}/tables`);
      setDbTables(prev => ({ ...prev, [dbName]: response.data }));
    } catch (err) {
      console.error(`Failed to fetch tables for ${dbName}`, err);
    } finally {
      setLoadingTables(prev => ({ ...prev, [dbName]: false }));
    }
  };

  // Reset and fetch when connection changes
  useEffect(() => {
    if (activeConnection && initializedRef.current !== activeConnection.server) {
      initializedRef.current = activeConnection.server;
      fetchData();
      setDbTables({});
    }
  }, [activeConnection]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleDatabase = (dbName) => {
    setDatabases(prev => {
      const isNowExpanded = !prev.find(d => d.name === dbName)?.isExpanded;
      if (isNowExpanded) {
        fetchTables(dbName);
      }
      return prev.map(db => 
        db.name === dbName ? { ...db, isExpanded: isNowExpanded } : db
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] border-r border-slate-700/50 w-72 overflow-hidden shadow-2xl z-30">
      <div className="p-5 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <Server className="w-5 h-5 text-blue-500" />
          <h3 className="text-slate-100 font-bold text-xs uppercase tracking-[0.15em]">Explorateur</h3>
        </div>
        <button 
          onClick={fetchData} 
          disabled={loading}
          className="text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 p-1.5 rounded-lg transition-all disabled:opacity-30"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
        <div className="space-y-1">
          <button 
            onClick={() => toggleSection('databases')}
            className="flex items-center gap-2 w-full text-left text-slate-300 hover:bg-slate-700/40 p-2 rounded-xl transition-all text-[13px] font-semibold group"
          >
            <div className="text-slate-500 group-hover:text-slate-300">
              {expandedSections.databases ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            <Database className="w-4 h-4 text-blue-500/80" />
            <span>Bases de données</span>
          </button>
          
          {expandedSections.databases && (
            <div className="ml-2 pl-2 border-l border-slate-700/30 space-y-1 py-1">
              {databases.map(db => (
                <div key={db.name} className="space-y-1">
                  <div 
                    onClick={() => toggleDatabase(db.name)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-100 cursor-pointer py-1 px-2 hover:bg-slate-700/30 rounded-lg text-xs transition-all group"
                  >
                    <div className="text-slate-600 group-hover:text-slate-400">
                      {db.isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>
                    <Database className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400/70" />
                    <span className="truncate">{db.name}</span>
                    {loadingTables[db.name] && <RefreshCw className="w-3 h-3 animate-spin ml-auto opacity-50" />}
                  </div>

                  {db.isExpanded && (
                    <div className="ml-4 pl-4 border-l border-slate-700/20 space-y-0.5">
                      {!dbTables[db.name] && !loadingTables[db.name] && (
                        <div className="text-[10px] text-slate-600 italic py-1">Chargement...</div>
                      )}
                      {dbTables[db.name]?.map(table => (
                        <div 
                          key={`${table.TABLE_SCHEMA}.${table.TABLE_NAME}`}
                          onClick={() => onSelectTable(db.name, table.TABLE_NAME, table.TABLE_SCHEMA)}
                          className="flex items-center gap-2 text-slate-500 hover:text-blue-300 cursor-pointer py-1 px-2 hover:bg-blue-500/10 rounded transition-all text-[11px]"
                        >
                          <TableIcon className="w-3 h-3 opacity-50" />
                          <span className="truncate">{table.TABLE_NAME}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1 pt-2">
          <button 
            onClick={() => toggleSection('logins')}
            className="flex items-center gap-2 w-full text-left text-slate-300 hover:bg-slate-700/40 p-2 rounded-xl transition-all text-[13px] font-semibold group"
          >
            <div className="text-slate-500 group-hover:text-slate-300">
              {expandedSections.logins ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
            <span>Sécurité / Logins</span>
          </button>
          
          {expandedSections.logins && (
            <div className="ml-4 pl-4 border-l border-slate-700/50 space-y-0.5 py-1">
              {logins.map(login => (
                <div 
                  key={login.name} 
                  className="flex items-center gap-3 text-slate-400 hover:text-slate-100 cursor-pointer py-1.5 px-3 hover:bg-slate-700/30 rounded-lg text-xs transition-all group"
                >
                  <User className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400/70" />
                  <span className="truncate">{login.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
