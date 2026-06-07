import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export default function Footer() {
  const { settings } = useData();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          {(() => {
            const name = settings.hotelName || 'Grand Hotel';
            const parts = name.trim().split(/\s+/);
            if (parts.length === 1) return <span className="font-serif text-2xl font-bold text-gold">{name}</span>;
            return <><span className="font-serif text-2xl font-bold text-gold">{parts[0]}</span><span className="font-serif text-2xl font-light text-white"> {parts.slice(1).join(' ')}</span></>;
          })()}
          <p className="mt-4 text-sm leading-relaxed">
            Изысканный отдых в атмосфере роскоши и безупречного сервиса.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-white text-lg mb-4">Навигация</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/rooms" className="hover:text-gold transition block py-2">Номера</Link></li>
            <li><Link to="/services" className="hover:text-gold transition block py-2">Услуги</Link></li>
            <li><Link to="/cart" className="hover:text-gold transition block py-2">Корзина</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-white text-lg mb-4">Контакты</h4>
          <div className="space-y-2 text-sm">
            <p>📍 {settings.address}</p>
            <p>📞 {settings.phone}</p>
            <p>✉️ {settings.email}</p>
          </div>
        </div>
        <div>
          <h4 className="font-serif text-white text-lg mb-4">Часы работы</h4>
          <div className="space-y-2 text-sm">
            <p>Ресепшн: {settings.receptionHours}</p>
            <p>Ресторан: {settings.restaurantHours}</p>
            <p>Спа: {settings.spaHours}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-gray-600">
        &copy; {year} {settings.hotelName}. Все права защищены.
      </div>
    </footer>
  );
}
