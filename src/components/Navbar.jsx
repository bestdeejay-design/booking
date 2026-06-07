import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const { settings } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Вы вышли');
    navigate('/');
  };

  const linkClass = (path) =>
    `text-sm font-medium tracking-wide transition ${
      location.pathname === path ? 'text-gold' : 'text-gray-300 hover:text-gold'
    }`;

  return (
    <nav className="bg-charcoal/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-3xl">✦</span>
            <div>
              {(() => {
                const name = settings.hotelName || 'Grand Hotel';
                const parts = name.trim().split(/\s+/);
                if (parts.length === 1) return <span className="font-serif text-2xl font-bold text-gold tracking-wide">{name}</span>;
                return <>
                  <span className="font-serif text-2xl font-bold text-gold tracking-wide">{parts[0]}</span>
                  <span className="font-serif text-2xl font-light text-white"> {parts.slice(1).join(' ')}</span>
                </>;
              })()}
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link to="/rooms" className={linkClass('/rooms')}>Номера</Link>
            <Link to="/services" className={linkClass('/services')}>Услуги</Link>
            <Link to="/cart" className="relative text-gray-300 hover:text-gold transition p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-gold text-charcoal text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-300 hover:text-gold transition">
                  <span className="w-7 h-7 bg-gold/20 rounded-full flex items-center justify-center text-gold text-xs font-bold">
                    {(user.displayName || user.email)[0].toUpperCase()}
                  </span>
                  {user.displayName || 'Кабинет'}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-xs bg-gold/10 text-gold px-3 py-2 rounded-full hover:bg-gold/20 transition">Админ</Link>
                )}
                <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-red-400 transition py-2">Выйти</button>
              </div>
            ) : (
              <Link to="/login" className="bg-gold text-charcoal px-5 py-3.5 rounded-full text-sm font-medium hover:bg-gold-dark transition">Войти</Link>
            )}
          </div>

          <button className="lg:hidden text-gray-300 text-2xl p-2" onClick={() => setMenuOpen(v => !v)}>☰</button>
        </div>

        {menuOpen && (
          <div className="lg:hidden pb-6 space-y-3 border-t border-white/5 pt-4" onClick={() => setMenuOpen(false)}>
            <Link to="/rooms" className="block py-3 text-gray-300">Номера</Link>
            <Link to="/services" className="block py-3 text-gray-300">Услуги</Link>
            <Link to="/cart" className="block py-3 text-gray-300">Корзина ({items.length})</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block py-3 text-gray-300">Кабинет</Link>
                {isAdmin && <Link to="/admin" className="block py-3 text-gold">Админ</Link>}
                <button onClick={handleLogout} className="block py-3 text-red-400">Выйти</button>
              </>
            ) : (
              <Link to="/login" className="block py-3 text-gold">Войти</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
