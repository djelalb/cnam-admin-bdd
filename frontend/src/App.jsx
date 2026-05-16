import React, { useState } from 'react';
import Login from './components/Login';
import ObjectExplorer from './components/ObjectExplorer';
import QueryEditor from './components/QueryEditor';
import AdminActions from './components/AdminActions';
import TableViewer from './components/TableViewer';
import { Database, LogOut, Code, Settings, Table as TableIcon } from 'lucide-react';
import axios from 'axios';

function App() {
  const [activeConnection, setActiveConnection] = useState(null);
  const [activeTab, setActiveTab] = useState('query');
  const [selectedTable, setSelectedTable] = useState(null); // { dbName, tableName, schema }

  const handleLoginSuccess = (connectionData) => {
    setActiveConnection(connectionData);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      setActiveConnection(null);
    } catch (err) {
      console.error('Logout failed', err);
      setActiveConnection(null);
    }
  };

  const handleSelectTable = (dbName, tableName, schema) => {
    setSelectedTable({ dbName, tableName, schema });
    setActiveTab('viewer');
  };

  if (!activeConnection) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 overflow-hidden font-sans">
      {/* Sidebar - Object Explorer */}
      <ObjectExplorer 
        activeConnection={activeConnection} 
        onSelectTable={handleSelectTable} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header / Navigation */}
        <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shadow-md z-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded text-white">
                <Database className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-100 hidden sm:block">SSMS Web</span>
            </div>
            
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('query')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'query' 
                    ? 'bg-slate-700 text-blue-400 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <Code className="w-4 h-4" />
                Query Editor
              </button>
              
              {selectedTable && (
                <button
                  onClick={() => setActiveTab('viewer')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'viewer' 
                      ? 'bg-slate-700 text-blue-400 shadow-inner' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <TableIcon className="w-4 h-4" />
                  Table: {selectedTable.tableName}
                </button>
              )}

              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'admin' 
                    ? 'bg-slate-700 text-blue-400 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin Actions
              </button>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* Tab Content */}
        <main className="flex-1 min-h-0 relative">
          {activeTab === 'query' && <QueryEditor />}
          {activeTab === 'admin' && <AdminActions />}
          {activeTab === 'viewer' && selectedTable && (
            <TableViewer 
              dbName={selectedTable.dbName} 
              tableName={selectedTable.tableName} 
              schema={selectedTable.schema} 
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
