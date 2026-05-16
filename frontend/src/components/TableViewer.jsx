import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table as TableIcon, 
  Columns, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  Database,
  RefreshCw,
  Search
} from 'lucide-react';

const TableViewer = ({ dbName, tableName, schema }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [primaryKeys, setPrimaryKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRow, setEditingRow] = useState(null); // index of row being edited
  const [editData, setEditData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newData, setNewData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/explorer/databases/${dbName}/tables/${tableName}?schema=${schema}`);
      setData(response.data.data);
      setColumns(response.data.columns);
      setPrimaryKeys(response.data.primaryKeys);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load table details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    setEditingRow(null);
    setIsAdding(false);
  }, [dbName, tableName, schema]);

  const handleEdit = (index, row) => {
    setEditingRow(index);
    setEditData({ ...row });
  };

  const handleSaveUpdate = async (index) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/data/databases/${dbName}/tables/${tableName}/row`, {
        schema,
        primaryKeys,
        oldData: data[index],
        newData: editData
      });
      setSuccess('Ligne mise à jour avec succès');
      setEditingRow(null);
      fetchDetails();
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/data/databases/${dbName}/tables/${tableName}/row`, {
        data: { schema, primaryKeys, data: data[index] }
      });
      setSuccess('Ligne supprimée');
      fetchDetails();
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = async () => {
    // Filter out primary key (assuming it's identity) and empty values
    const dataToInsert = { ...newData };
    primaryKeys.forEach(pk => delete dataToInsert[pk]);
    
    if (Object.keys(dataToInsert).length === 0) {
      setError("Veuillez remplir au moins un champ.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/data/databases/${dbName}/tables/${tableName}/row`, {
        schema,
        data: dataToInsert
      });
      setSuccess('Nouvelle ligne ajoutée');
      setIsAdding(false);
      setNewData({});
      fetchDetails();
    } catch (err) {
      setError(err.response?.data?.error || 'Insert failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col h-full bg-[#0f172a] animate-in fade-in duration-500">
      {/* Table Header */}
      <div className="bg-slate-800/40 backdrop-blur-md p-4 border-b border-slate-700/50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
            <TableIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{dbName}</span>
              <span className="text-slate-700">/</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{schema}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 leading-tight">{tableName}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher dans les données..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/50 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all"
            />
          </div>
          <button 
            onClick={fetchDetails}
            className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => { setIsAdding(true); setNewData({}); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Messages */}
      {(error || success) && (
        <div className={`px-6 py-2 text-xs flex items-center justify-between border-b border-slate-700/50 ${error ? 'bg-red-900/20 text-red-400' : 'bg-emerald-900/20 text-emerald-400'}`}>
          <div className="flex items-center gap-2">
            {error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span className="font-semibold">{error || success}</span>
          </div>
          <button onClick={() => { setError(''); setSuccess(''); }}><X className="w-4 h-4 opacity-50 hover:opacity-100" /></button>
        </div>
      )}

      {/* Main Grid View */}
      <div className="flex-1 overflow-auto bg-[#020617] custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="sticky top-0 bg-slate-800 z-10 shadow-md">
            <tr>
              <th className="px-6 py-3 border-r border-b border-slate-700 text-slate-200 text-[11px] font-bold uppercase tracking-wider w-24">Actions</th>
              {columns.map(col => (
                <th key={col.COLUMN_NAME} className="px-6 py-3 border-r border-b border-slate-700 text-slate-200 text-[11px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>{col.COLUMN_NAME}</span>
                    {primaryKeys.includes(col.COLUMN_NAME) && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Primary Key"></div>}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5 normal-case font-medium">{col.DATA_TYPE}{col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : ''}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-300 font-mono text-xs">
            {/* Adding Row Input */}
            {isAdding && (
              <tr className="bg-blue-900/10 border-b border-blue-500/30 animate-in slide-in-from-top-2">
                <td className="px-6 py-3 border-r border-slate-700 flex items-center gap-2">
                  <button onClick={handleInsert} className="p-1.5 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500 transition-all"><Save className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setIsAdding(false)} className="p-1.5 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-all"><X className="w-3.5 h-3.5" /></button>
                </td>
                {columns.map(col => (
                  <td key={col.COLUMN_NAME} className="px-6 py-3 border-r border-slate-700/50">
                    <input 
                      type="text" 
                      className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                      onChange={(e) => setNewData({ ...newData, [col.COLUMN_NAME]: e.target.value })}
                      placeholder="NULL"
                    />
                  </td>
                ))}
              </tr>
            )}

            {filteredData.map((row, i) => (
              <tr key={i} className={`hover:bg-slate-800/40 border-b border-slate-800/50 transition-colors group ${editingRow === i ? 'bg-blue-900/5' : ''}`}>
                <td className="px-6 py-2 border-r border-slate-800/50">
                  {editingRow === i ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleSaveUpdate(i)} className="p-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-all"><Save className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditingRow(null)} className="p-1.5 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-all"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(i, row)} className="p-1.5 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(i)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </td>
                {columns.map(col => (
                  <td key={col.COLUMN_NAME} className="px-6 py-2 border-r border-slate-800/30 truncate max-w-xs">
                    {editingRow === i ? (
                      <input 
                        type="text" 
                        value={editData[col.COLUMN_NAME] === null ? '' : editData[col.COLUMN_NAME]}
                        className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                        onChange={(e) => setEditData({ ...editData, [col.COLUMN_NAME]: e.target.value })}
                      />
                    ) : (
                      <span className={row[col.COLUMN_NAME] === null ? 'text-slate-600 italic' : ''}>
                        {row[col.COLUMN_NAME] === null ? 'NULL' : String(row[col.COLUMN_NAME])}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {!loading && filteredData.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-slate-600 italic">
            <Database className="w-12 h-12 mb-3 opacity-10" />
            Aucune donnée à afficher
          </div>
        )}
      </div>
    </div>
  );
};

export default TableViewer;
