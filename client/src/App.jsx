import React, { useState, useEffect } from 'react';
import {
  Search,
  Upload,
  LayoutGrid,
  List,
  ShieldAlert,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Settings,
  LogOut,
  Bell,
  SearchCode
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const App = () => {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('fuzzy'); // 'fuzzy' | 'semantic'
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/search?query=%&mode=fuzzy`);
      setFiles(res.data);
    } catch (err) {
      console.error('Failed to fetch files', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return fetchFiles();
    try {
      const res = await axios.get(`${API_BASE}/api/search?query=${searchQuery}&mode=${searchMode}`);
      setFiles(res.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/upload`, formData);
      setNotification({
        type: res.data.metadata.isPII ? 'warning' : 'success',
        message: res.data.metadata.isPII
          ? `Security Warning: ${res.data.metadata.piiType} detected!`
          : 'File uploaded successfully'
      });
      fetchFiles();
    } catch (err) {
      setNotification({ type: 'error', message: 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0f172a] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">N</div>
          <h1 className="text-xl font-bold tracking-tight">Nebula Cloud</h1>
        </div>

        <nav className="space-y-2">
          <NavItem icon={<LayoutGrid size={20} />} label="All Files" active />
          <NavItem icon={<SearchCode size={20} />} label="AI Insights" />
          <NavItem icon={<FolderOpen size={20} />} label="Recent" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="mt-auto">
          <NavItem icon={<LogOut size={20} />} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-white/5 backdrop-blur-md">
          <form onSubmit={handleSearch} className="relative w-1/2 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input
              type="text"
              placeholder={`Search files ${searchMode === 'semantic' ? 'semantically...' : 'by name...'}`}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setSearchMode(searchMode === 'fuzzy' ? 'semantic' : 'fuzzy')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-1 rounded border transition-colors ${searchMode === 'semantic' ? 'border-blue-500 text-blue-500 bg-blue-500/10' : 'border-white/20 text-white/40'}`}
            >
              {searchMode.toUpperCase()}
            </button>
          </form>

          <div className="flex items-center gap-6">
            <button className="text-white/60 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-all px-5 py-2.5 rounded-2xl font-semibold cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95">
              <Upload size={18} />
              <span>Upload File</span>
              <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
            </label>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold border-2 border-white/20">JS</div>
          </div>
        </header>

        {/* Browser Area */}
        <section className="flex-1 overflow-y-auto p-10">
          {notification && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ${notification.type === 'warning' ? 'bg-orange-500/10 border border-orange-500/30 text-orange-200' : 'bg-green-500/10 border border-green-500/30 text-green-200'}`}>
              {notification.type === 'warning' ? <ShieldAlert size={24} className="text-orange-500" /> : <FolderOpen size={24} className="text-green-500" />}
              <div>
                <p className="font-bold flex items-center gap-2">
                  {notification.type === 'warning' ? 'Security Alert' : 'Success'}
                </p>
                <p className="text-sm opacity-80">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="ml-auto text-sm opacity-40 hover:opacity-100">Dismiss</button>
            </div>
          )}

          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recent Files</h2>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button className="p-1.5 rounded-lg bg-white/10 text-white"><LayoutGrid size={18} /></button>
              <button className="p-1.5 rounded-lg text-white/40 hover:text-white"><List size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.length > 0 ? files.map(file => (
              <FileCard key={file.id} file={file} />
            )) : (
              <div className="col-span-full h-64 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
                <FileText size={48} className="mb-4" />
                <p>No files found</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

const FileCard = ({ file }) => {
  const getIcon = (type) => {
    if (type.includes('image')) return <ImageIcon className="text-purple-400" />;
    if (type.includes('pdf') || type.includes('word')) return <FileText className="text-blue-400" />;
    return <FileText className="text-slate-400" />;
  };

  return (
    <div className="group bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer relative overflow-hidden backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
          {getIcon(file.type)}
        </div>
        {file.is_pii && (
          <div className="bg-red-500/20 text-red-400 p-1.5 rounded-lg" title="PII Detected">
            <ShieldAlert size={16} />
          </div>
        )}
      </div>
      <div>
        <h3 className="font-bold text-white mb-1 truncate" title={file.title || file.name}>
          {file.title || file.name}
        </h3>
        <p className="text-xs text-white/40 mb-3 truncate italic">
          {file.summary || 'No description available'}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {file.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-white/60">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all pointer-events-none" />
    </div>
  );
};

export default App;
