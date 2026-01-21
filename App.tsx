/**
 * ═══════════════════════════════════════════════════════════
 * POWERED BY SURITARGETS N.V. - PROPRIETARY SOFTWARE
 * ═══════════════════════════════════════════════════════════
 * Copyright © 2026 Suritargets N.V. All Rights Reserved.
 * This software is the proprietary property of Suritargets N.V.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 * ═══════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useEffect } from 'react';
import { SignatureData, DEFAULT_SIGNATURE } from './types';
import SignaturePreview from './components/SignaturePreview';
import Editor from './components/Editor';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

/* ═══════════════════════════════════════════════════════════
 * SURITARGETS N.V. - PROTECTED CODE
 * ═══════════════════════════════════════════════════════════ */

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [data, setData] = useState<SignatureData>(DEFAULT_SIGNATURE);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Reset consent when signature data changes
  useEffect(() => {
    // Skip the first render to avoid resetting on initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Any change to signature data resets consent
    setConsentGiven(false);
  }, [data]);

  // Listen for popstate events (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track user data on page load (only for main app, not admin)
  useEffect(() => {
    if (currentPath !== '/STADMIN') {
      trackUserVisit();
    }
  }, []);

  const trackUserVisit = async () => {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureData: data,
          hasCopied: false
        })
      });
    } catch (error) {
      console.error('Failed to track visit:', error);
    }
  };

  const handleCopy = async () => {
    if (!signatureRef.current || !consentGiven) return;
    
    const range = document.createRange();
    range.selectNode(signatureRef.current);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Track the copy action
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureData: data,
          hasCopied: true
        })
      });
    } catch (err) {
      console.error('Failed to copy signature:', err);
    }
    selection?.removeAllRanges();
  };

  const HelpModal = () => (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${helpOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-[#002060]/80 backdrop-blur-sm" onClick={() => setHelpOpen(false)} />
      <div className={`relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 transform ${helpOpen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>
        <div className="bg-[#002060] p-8 text-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-black italic tracking-tighter">HELP & INSTRUCTIES</h2>
            <button onClick={() => setHelpOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Suritargets Branding Tool v2.0</p>
        </div>
        
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-red-50 rounded-xl flex items-center justify-center text-[#c62828] font-black text-lg">1</div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#002060]">Branding & Logo</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Pas de huiskleuren aan naar je voorkeur. Upload je eigen bedrijfslogo via de upload knop of plak een directe URL.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-blue-50 rounded-xl flex items-center justify-center text-[#002060] font-black text-lg">2</div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#002060]">Thema Selectie</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Kies een layout die bij je past. We hebben speciale 'Mobile' layouts die geoptimaliseerd zijn voor weergave op telefoons.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-yellow-50 rounded-xl flex items-center justify-center text-[#fbc02d] font-black text-lg">3</div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#002060]">Persoonlijk & Bedrijf</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Vul je gegevens in. Gebruik de 'Show' toggles om velden zoals slogan, foto of openingstijden aan of uit te zetten.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-black text-lg">4</div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#002060]">Kopiëren & Gebruik</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Klaar? Klik op de grote rode knop. De handtekening wordt gekopieerd inclusief opmaak. Plak deze direct in de instellingen van Outlook of Gmail.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Vragen of support nodig?</p>
            <a href="mailto:support@suritargets.com" className="inline-flex items-center gap-2 px-6 py-3 bg-[#002060] text-white rounded-2xl font-bold text-sm hover:scale-105 transition-transform shadow-lg">
              <i className="fas fa-envelope"></i> support@suritargets.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  // Admin panel routing
  if (currentPath === '/STADMIN') {
    if (!isAdminAuthenticated) {
      return <AdminLogin onLogin={setIsAdminAuthenticated} />;
    }
    return <AdminDashboard onLogout={() => {
      setIsAdminAuthenticated(false);
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }} />;
  }

  // Main signature app
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <style>{`
        .preview-scale-wrapper {
          transform-origin: center center;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .view-mode-desktop .preview-scale-wrapper {
          transform: scale(1);
        }

        .view-mode-mobile .preview-scale-wrapper {
          transform: scale(0.65);
        }

        @media (max-width: 1024px) {
           .view-mode-desktop .preview-scale-wrapper {
            transform: scale(0.8);
          }
        }

        @media (max-width: 640px) {
          .view-mode-desktop .preview-scale-wrapper {
            transform: scale(0.6);
          }
          .view-mode-mobile .preview-scale-wrapper {
            transform: scale(0.5);
          }
        }

        .sidebar-transition {
          transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>

      {/* Help Modal */}
      <HelpModal />

      {/* Main Canvas Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden order-1">
        {/* Mobile Sidebar Toggle & Header */}
        <header className="p-4 bg-white border-b border-gray-200 flex items-center justify-between lg:hidden shadow-sm">
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter text-[#002060] italic">SURITARGETS</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-3 bg-[#002060] text-white rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            <i className="fas fa-edit mr-2"></i> Edit
          </button>
        </header>

        {/* Toolbar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-white/50">
          <div className="flex bg-gray-100/50 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                viewMode === 'desktop' ? 'bg-white text-[#002060] shadow-md' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <i className="fas fa-desktop"></i> Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                viewMode === 'mobile' ? 'bg-white text-[#002060] shadow-md' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <i className="fas fa-mobile-alt"></i> Mobile
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        <div className={`flex-1 flex items-center justify-center p-8 transition-colors duration-500 bg-gray-50 ${viewMode === 'mobile' ? 'bg-gray-200/50' : ''}`}>
           <div 
             className={`relative bg-white border-2 border-dashed border-gray-300 transition-all duration-500 flex items-center justify-center overflow-auto shadow-2xl ${
               viewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-[3rem] ring-8 ring-gray-900 border-solid' : 'w-full max-w-[1100px] aspect-[4/3] rounded-[2rem]'
             }`}
           >
              {/* Device Frame Decorations (Only Mobile) */}
              {viewMode === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
              )}

              <div className={`preview-scale-wrapper w-full flex justify-center p-4`}>
                <div ref={signatureRef} className="bg-white p-6 shadow-sm inline-block">
                  <SignaturePreview data={data} />
                </div>
              </div>
           </div>
        </div>
      </main>

      {/* Sidebar Editor (Moved to right) */}
      <aside 
        className={`sidebar-transition fixed inset-y-0 right-0 z-50 w-[400px] bg-white border-l border-gray-200 shadow-2xl flex flex-col ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:relative lg:translate-x-0 lg:w-[450px] order-2`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#002060] text-white">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-black tracking-tighter italic">SURITARGETS</h1>
            <p className="text-[9px] uppercase font-bold tracking-[0.3em] opacity-50 ml-0.5">Signature Generator</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setHelpOpen(true)}
              className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              title="Help & Instructies"
            >
              <i className="fas fa-question text-lg"></i>
            </button>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
           <Editor data={data} onChange={setData} />
           
           <div className="pt-8 space-y-4">
              {/* Consent Checkbox */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-[#002060] focus:ring-2 focus:ring-[#002060] cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 leading-relaxed">
                      Ik ga akkoord dat de ingevulde gegevens correct zijn en de preview er goed uitziet.
                    </p>
                  </div>
                </label>
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                disabled={!consentGiven}
                className={`w-full flex items-center justify-center gap-3 px-8 py-5 font-bold text-lg rounded-2xl transition-all shadow-xl ${
                  copied 
                    ? 'bg-green-600 text-white hover:brightness-110 active:scale-[0.98] shadow-green-200/50' 
                    : !consentGiven 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed shadow-gray-200/30 opacity-60' 
                      : 'bg-[#c62828] text-white hover:brightness-110 active:scale-[0.98] shadow-red-200/50'
                }`}
              >
                {copied ? (
                  <><i className="fas fa-check-double"></i> Gekopieerd!</>
                ) : (
                  <><i className="fas fa-copy"></i> Kopieer Handtekening</>
                )}
              </button>
           </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
           Branding Tool v2.0 &copy; {new Date().getFullYear()}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
