/**
 * ═══════════════════════════════════════════════════════════
 * POWERED BY SURITARGETS N.V. - PROPRIETARY SOFTWARE
 * ═══════════════════════════════════════════════════════════
 * Copyright © 2026 Suritargets N.V. All Rights Reserved.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 * ═══════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  ipAddress: string;
  userName: string;
  userEmail: string;
  companyName: string;
  signatureData: any;
  hasCopied: boolean;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [data, setData] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<LogEntry | null>(null);

  // Disable right-click, inspect, and screenshot
  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const disableInspect = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    };

    const disableScreenshot = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots zijn uitgeschakeld op deze pagina.');
      }
    };

    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableInspect);
    document.addEventListener('keydown', disableScreenshot);

    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableInspect);
      document.removeEventListener('keydown', disableScreenshot);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/analytics?username=Ken&code=OG4712345');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(entry => 
    entry.companyName.toLowerCase().includes(filter.toLowerCase()) ||
    entry.userName.toLowerCase().includes(filter.toLowerCase()) ||
    entry.userEmail.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'IP Address', 'Name', 'Email', 'Company', 'Copied'];
    const rows = filteredData.map(entry => [
      formatDate(entry.timestamp),
      entry.ipAddress,
      entry.userName,
      entry.userEmail,
      entry.companyName,
      entry.hasCopied ? 'Ja' : 'Nee'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `suritargets-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const companyCounts = filteredData.reduce((acc, entry) => {
    acc[entry.companyName] = (acc[entry.companyName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#002060] to-[#c62828] text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">ADMIN DASHBOARD</h1>
            <p className="text-white/60 text-sm font-bold uppercase tracking-wider mt-1">Suritargets Analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">Totaal Gebruikers</p>
                <p className="text-3xl font-black text-[#002060] mt-1">{data.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-users text-[#002060] text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">Gekopieerd</p>
                <p className="text-3xl font-black text-green-600 mt-1">{data.filter(e => e.hasCopied).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">Unieke Bedrijven</p>
                <p className="text-3xl font-black text-[#c62828] mt-1">{Object.keys(companyCounts).length}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-building text-[#c62828] text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">Vandaag</p>
                <p className="text-3xl font-black text-[#fbc02d] mt-1">
                  {data.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-calendar-day text-[#fbc02d] text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Zoek op bedrijf, naam of email..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#002060] focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-[#002060] text-white rounded-xl font-bold hover:bg-[#003080] transition-all whitespace-nowrap"
            >
              <i className="fas fa-download mr-2"></i> Export CSV
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 font-bold">Loading...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center">
              <i className="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 font-bold">Geen gegevens gevonden</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-600">Timestamp</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-600">IP Address</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-600">Naam</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-600">Bedrijf</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-gray-600">Copied</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-gray-600">Actie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(entry.timestamp)}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{entry.ipAddress}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{entry.userName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.userEmail}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#002060]">{entry.companyName}</td>
                      <td className="px-6 py-4 text-center">
                        {entry.hasCopied ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            <i className="fas fa-check mr-1"></i> Ja
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                            <i className="fas fa-times mr-1"></i> Nee
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="px-3 py-1 bg-[#002060] text-white rounded-lg text-xs font-bold hover:bg-[#003080] transition-all"
                        >
                          <i className="fas fa-eye mr-1"></i> Bekijk
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEntry(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#002060] text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">SIGNATURE DETAILS</h2>
                  <p className="text-white/60 text-sm mt-1">{selectedEntry.userName}</p>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <pre className="bg-gray-50 p-4 rounded-xl text-xs overflow-auto border-2 border-gray-100">
                {JSON.stringify(selectedEntry.signatureData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
