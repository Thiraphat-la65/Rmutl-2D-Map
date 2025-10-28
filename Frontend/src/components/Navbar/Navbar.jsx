// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, UserPlus, Globe } from 'lucide-react';
// ใช้โลโก้จาก public (ไม่ต้อง import)
const logoUrl = '/assets/images/rmutl-logo.png'; // วางไฟล์ใน public/assets/images/

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState('th');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const t = lang === 'th' ? th : en;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-xl border-b border-gray-200' 
          : 'bg-gray-900 shadow-2xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* === โลโก้จริง RMUTL === */}
            <div 
              onClick={() => scrollTo('home')} 
              className="flex items-center space-x-3 cursor-pointer"
            >
              <img 
                src={"/public/assets/images/rmutl-logo.png"} 
                alt="RMUTL Logo" 
                className="h-11 w-auto object-contain"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              {t.menu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`font-semibold text-sm px-4 py-2 rounded-lg transition-all ${
                    scrolled 
                      ? 'text-gray-800 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="flex items-center space-x-3 ml-4">
                <button className={`flex items-center space-x-2 px-5 py-2 rounded-full font-medium text-sm transition-all ${
                  scrolled
                    ? 'bg-[#00843D] text-white hover:bg-[#006400]'
                    : 'bg-white text-[#00843D] hover:bg-gray-100'
                }`}>
                  <LogIn size={16} />
                  <span>{t.login}</span>
                </button>
                <button className={`flex items-center space-x-2 px-5 py-2 rounded-full font-medium text-sm border-2 transition-all ${
                  scrolled
                    ? 'border-[#00843D] text-[#00843D] hover:bg-[#00843D] hover:text-white'
                    : 'border-white text-white hover:bg-white/20'
                }`}>
                  <UserPlus size={16} />
                  <span>{t.register}</span>
                </button>
              </div>

              <button
                onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
                className={`p-2 rounded-full transition-all ${
                  scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                }`}
              >
                <Globe size={20} className={scrolled ? 'text-gray-700' : 'text-white'} />
              </button>
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
                className="p-2"
              >
                <Globe size={20} className={scrolled ? 'text-gray-700' : 'text-white'} />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2"
              >
                {isOpen ? 
                  <X size={28} className={scrolled ? 'text-gray-900' : 'text-white'} /> : 
                  <Menu size={28} className={scrolled ? 'text-gray-900' : 'text-white'} />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-40">
          <div className="px-6 py-4 space-y-3">
            {t.menu.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left text-lg font-medium text-gray-800 py-3 border-b border-gray-100"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-[#00843D] text-white font-medium">
                <LogIn size={18} />
                <span>{t.login}</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-full border-2 border-[#00843D] text-[#00843D] font-medium hover:bg-[#00843D] hover:text-white">
                <UserPlus size={18} />
                <span>{t.register}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const th = {
  menu: [
    { id: 'home', label: 'หน้าแรก' },
    { id: 'map', label: 'แผนที่' },
    { id: 'about', label: 'เกี่ยวกับ' },
    { id: 'contact', label: 'ติดต่อเรา' },
  ],
  login: 'เข้าสู่ระบบ',
  register: 'สมัครสมาชิก',
};

const en = {
  menu: [
    { id: 'home', label: 'Home' },
    { id: 'map', label: 'Map' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ],
  login: 'Login',
  register: 'Register',
};

export default Navbar;