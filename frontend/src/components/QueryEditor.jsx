import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Play, Trash2, AlertCircle, CheckCircle2, Table as TableIcon, Terminal, Clock, Copy, ChevronDown, FileUp } from 'lucide-react';

const QueryEditor = () => {
  const [query, setQuery] = useState('SELECT TOP 100 * FROM sys.databases');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [executionTime, setExecutionTime] = useState(null);
  const fileInputRef = useRef(null);

  const executeQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    setStatus('');
    const startTime = performance.now();
    
    try {
      const response = await axios.post('http://localhost:5000/api/query/execute', { query });
      const endTime = performance.now();
      setResults(response.data.recordset);
      setStatus(`Success: ${response.data.rowsAffected} row(s) affected.`);
      setExecutionTime(((endTime - startTime) / 1000).toFixed(3));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError('');
    setStatus('');
    setExecutionTime(null);
  };

  const copyResults = () => {
    if (!results) return;
    const csv = [
      Object.keys(results[0]).join(','),
      ...results.map(row => Object.values(row).join(','))
    ].join('\n');
    navigator.clipboard.writeText(csv);
    alert('Résultats copiés en format CSV !');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setQuery(event.target.result);
      setStatus(`Fichier "${file.name}" importé avec succès.`);
    };
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier.");
    };
    reader.readAsText(file);
    // Reset input value to allow the same file to be uploaded again if needed
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
      {/* Editor Toolbar */}
      <div className="bg-slate-800/40 backdrop-blur-md p-3 border-b border-slate-700/50 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={executeQuery}
            disabled={loading}
            className="group flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            <Play className={`w-4 h-4 fill-current ${loading ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
            <span>Exécuter</span>
          </button>

          <input
            type="file"
            accept=".sql"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 border border-slate-600/30"
            title="Importer un fichier .sql"
          >
            <FileUp className="w-4 h-4" />
            <span>Importer</span>
          </button>

          <button
            onClick={clearResults}
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 border border-slate-600/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>Effacer</span>
          </button>
          {results && (
            <button
              onClick={copyResults}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 border border-slate-600/30"
            >
              <Copy className="w-4 h-4" />
              <span>Copier CSV</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 text-slate-500 text-[11px] font-mono uppercase tracking-widest bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <Terminal className="w-3.5 h-3.5 text-blue-500" />
          Éditeur SQL
        </div>
      </div>

      {/* SQL Input Area */}
      <div className="h-[40%] min-h-[200px] relative group">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-900/50 border-r border-slate-800 flex flex-col items-center py-4 text-[10px] font-mono text-slate-600 select-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-5">{i + 1}</div>
          ))}
        </div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-full bg-[#0f172a] text-blue-100 p-4 pl-16 font-mono text-[13px] leading-relaxed focus:outline-none resize-none border-b border-slate-700/50 placeholder:text-slate-700 selection:bg-blue-500/30"
          placeholder="Entrez votre commande SQL ici..."
          spellCheck="false"
        />
        {loading && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300">
            <div className="flex items-center gap-4 bg-slate-800 p-5 rounded-2xl shadow-2xl border border-slate-700/50 scale-110">
              <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-100 font-bold tracking-wide">Exécution en cours...</span>
            </div>
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-slate-900/50 border-b border-slate-700/50 text-[11px] font-medium transition-all">
        <div className="flex items-center gap-4">
          {(status || error) && (
            <div className={`flex items-center gap-2 ${error ? 'text-red-400' : 'text-emerald-400'}`}>
              {error ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span className="truncate max-w-md">{error || status}</span>
            </div>
          )}
        </div>
        {executionTime && (
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Temps d'exécution : {executionTime}s</span>
          </div>
        )}
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-auto bg-[#020617] relative custom-scrollbar">
        {!results && !error && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 animate-in fade-in zoom-in duration-700">
            <div className="bg-slate-900/50 p-6 rounded-full mb-6 border border-slate-800/50">
              <TableIcon className="w-16 h-16 opacity-10" />
            </div>
            <p className="text-sm font-medium tracking-wide">Prêt pour l'exécution</p>
            <p className="text-xs opacity-50 mt-1 italic">Entrez une requête SQL et appuyez sur "Exécuter"</p>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="p-0">
            <table className="w-full text-left border-collapse min-w-max table-fixed">
              <thead className="sticky top-0 bg-slate-800 z-10 shadow-md">
                <tr>
                  <th className="w-12 px-4 py-2.5 border-r border-b border-slate-700 text-slate-500 text-[10px] font-bold text-center">#</th>
                  {Object.keys(results[0]).map((key) => (
                    <th key={key} className="px-5 py-2.5 border-r border-b border-slate-700 text-slate-200 text-[11px] font-bold uppercase tracking-wider bg-slate-800/80">
                      <div className="flex items-center justify-between gap-2">
                        <span>{key}</span>
                        <ChevronDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-300 font-mono text-[12px]">
                {results.map((row, i) => (
                  <tr key={i} className="hover:bg-blue-900/10 transition-colors border-b border-slate-800/50 group">
                    <td className="w-12 px-4 py-2 border-r border-slate-800 text-slate-600 text-center text-[10px] bg-slate-900/30">{i + 1}</td>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-5 py-2 border-r border-slate-800/30 truncate max-w-[300px] group-hover:text-blue-200 transition-colors">
                        {val === null ? <span className="text-slate-600 italic opacity-50">NULL</span> : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results && results.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 italic text-sm animate-in fade-in duration-300">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/20 mb-3" />
            Commande exécutée avec succès.
            <span className="text-xs opacity-50 mt-1">Aucune ligne retournée.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryEditor;
