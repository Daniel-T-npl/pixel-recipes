import Link from 'next/link';
import { useUserData } from '../lib/hooks';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar({ darkData, isDynamicHome }) {
  const { user, loading } = useUserData();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isDynamicHome) return;
    const handleScroll = () => {
    // Use the hero height (if present) so the transition happens after the hero
    // falls out of view. Fallback to viewport height minus a small offset.
    let threshold = window.innerHeight - 120;
    try {
      const heroEl = document.getElementById('hero');
      if (heroEl && heroEl.offsetHeight) {
        threshold = heroEl.offsetHeight - 120;
      }
    } catch (e) {
      // ignore if DOM not ready
    }
    setShowSidebar(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    // Trigger once on load to set initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDynamicHome]);

  const textColorClass = (darkData || showSidebar || (isDynamicHome && !showSidebar)) ? 'text-white' : 'text-gray-900';
  const mutedTextClass = (darkData || showSidebar || (isDynamicHome && !showSidebar)) ? 'text-gray-300' : 'text-gray-500';

  const NavLinks = ({ isVertical = false }) => {
    if (!mounted) return null;
    return (
        <>
          {loading ? (
            <div className={`${mutedTextClass} text-sm font-medium`}>Loading...</div>
          ) : user ? (
            <div className={`flex ${isVertical ? 'flex-col items-end space-y-4' : 'items-center space-x-4'}`}>
                 <Link href="/create">
                  <button className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-800 font-bold rounded-full text-sm px-6 py-2.5 text-center shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95">
                    + New Log
                  </button>
                </Link>
                <Link href="/dashboard" className="group relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img className="w-10 h-10 rounded-full border-2 border-indigo-500/50 group-hover:border-indigo-400 cursor-pointer transition-transform duration-300 transform hover:scale-105" src={user.photoURL || `https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`} alt="Profile" />
                </Link>
                <button
                    onClick={async () => {
                        await signOut(auth);
                        router.push('/');
                    }}
                     className={`${mutedTextClass} hover:text-red-400 font-bold text-xs tracking-widest uppercase ${isVertical ? 'px-0' : 'px-3'} py-2 transition-colors`}
                >
                    Sign Out
                </button>
            </div>
          ) : (
             <Link href="/enter">
               <button className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-800 font-bold rounded-full text-sm px-5 py-2.5 text-center shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
                 Log In
               </button>
             </Link>
          )}
        </>
    );
  }

  // Small shared AI icon used in both top nav and sidebar so visuals match
  const AiIcon = ({ className = 'w-5 h-5 text-white' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4 12H2" />
      <path d="M22 12h-2" />
      <path d="M20.5 4.5l-1.5 1.5" />
      <path d="M5 19l1.5-1.5" />
    </svg>
  );

  return (
    <>
        {/* 1. STANDARD TOP NAVBAR */}
        <nav className={`fixed w-full z-50 top-0 start-0 transition-all duration-500 ease-in-out
            ${showSidebar && isDynamicHome ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
            ${isDynamicHome && !showSidebar ? 'bg-transparent py-8' : 'bg-gradient-to-r from-indigo-900/60 via-[#0b0b0b]/60 to-violet-900/40 backdrop-blur-md border-b border-white/5 py-4'}
            shadow-lg
        `}>
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-6">
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
               <div className="p-2 rounded-xl bg-indigo-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="12" y1="3" x2="12" y2="21" />
                        <path d="M8 8 l-3 3 3 3" />
                        <path d="M16 16 l3 -3 -3 -3" />
                    </svg>
               </div>
               <div className="flex flex-col leading-none">
                 <span className={`self-center text-2xl font-black tracking-tighter ${textColorClass}`}>image.raw</span>
                 <small className={`-mt-1 text-xs font-medium ${mutedTextClass}`}>pixel recipes</small>
               </div>
            </Link>

            <div className="flex items-center gap-4">
               {/* Desktop links */}
               <div className="hidden md:flex md:order-2 items-center space-x-3 rtl:space-x-reverse min-h-[40px] min-w-[100px] justify-end">
                  <Link href="/ai-theme" className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/6 transition-colors text-sm font-medium">
                    <AiIcon className="w-5 h-5 text-white" />
                    <span className="text-sm font-semibold text-white">AI Theme</span>
                  </Link>
                  <NavLinks isVertical={false} />
               </div>

               {/* Mobile menu toggle */}
               <div className="md:hidden">
                 <button
                   aria-label="Toggle menu"
                   onClick={() => setShowMobileMenu(v => !v)}
                   className="p-2 rounded-lg bg-white/6 hover:bg-white/10 text-white transition-colors focus:outline-none"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                   </svg>
                 </button>
               </div>
            </div>

            {/* Mobile dropdown */}
            {showMobileMenu && (
              <div className="absolute right-6 top-full mt-3 w-56 p-4 rounded-2xl bg-[#0b0b0b]/95 backdrop-blur-md border border-white/5 shadow-xl md:hidden">
                <Link href="/ai-theme" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/6 transition-colors text-sm font-medium mb-2">
                  <AiIcon className="w-5 h-5 text-white" />
                  <span className="text-white">AI Theme</span>
                </Link>
                <NavLinks isVertical={true} />
              </div>
            )}
          </div>
        </nav>

        {/* 2. DYNAMIC SIDEBAR NAVBAR */}
        {isDynamicHome && (
            <nav
                // UPDATED CSS: Using pointer-events instead of invisible, and translate-x-full for safer hiding
          className={`fixed right-4 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-end gap-6 p-5 rounded-3xl
            bg-white/6 backdrop-blur-lg backdrop-saturate-150 bg-clip-padding border border-white/10 shadow-2xl
            transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]
            ${showSidebar ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-full pointer-events-none'}
          `}>
                 <Link href="/" className="group">
           <div className="p-3 rounded-2xl bg-indigo-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="12" y1="3" x2="12" y2="21" />
              <path d="M8 8 l-3 3 3 3" />
              <path d="M16 16 l3 -3 -3 -3" />
            </svg>
           </div>
                </Link>
                <Link href="/ai-theme" className="group">
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-400/30">
                    <AiIcon className="w-6 h-6 text-white" />
                    <span className="text-xs font-semibold text-white uppercase">AI</span>
                  </div>
                </Link>
                <NavLinks isVertical={true} />
            </nav>
        )}
    </>
  );
}