/**
 * ═══════════════════════════════════════════════════════════
 * POWERED BY SURITARGETS N.V. - PROPRIETARY SOFTWARE
 * ═══════════════════════════════════════════════════════════
 * Copyright © 2026 Suritargets N.V. All Rights Reserved.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 * ═══════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';

interface AdminLoginProps {
  onLogin: (authenticated: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Disable right-click, inspect, and screenshot
  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const disableInspect = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
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
      // Disable Print Screen
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots zijn uitgeschakeld op deze pagina.');
      }
    };

    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableInspect);
    document.addEventListener('keydown', disableScreenshot);

    // Disable text selection
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'Ken' && code === 'OG4712345') {
      onLogin(true);
    } else {
      setError('Onjuiste inloggegevens!');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002060] via-[#003080] to-[#c62828] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#002060] to-[#c62828] rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-shield-alt text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-[#002060] tracking-tight">ADMIN LOGIN</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2">Suritargets Analytics</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#002060] focus:outline-none transition-colors"
              placeholder="Voer username in"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Access Code
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#002060] focus:outline-none transition-colors"
              placeholder="Voer code in"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-center">
              <p className="text-red-600 font-bold text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#002060] to-[#c62828] text-white py-4 rounded-xl font-black text-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <i className="fas fa-sign-in-alt mr-2"></i> INLOGGEN
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Secure Admin Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
