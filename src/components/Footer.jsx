import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export default function Footer() {
  const { settings } = useData();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-gray-400">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
          <h4 className="footer-title font-serif text-white text-lg">Навигация</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/rooms" className="inline-block py-1.5 hover:text-gold transition-colors">Номера</Link></li>
            <li><Link to="/services" className="inline-block py-1.5 hover:text-gold transition-colors">Услуги</Link></li>
            <li><Link to="/cart" className="inline-block py-1.5 hover:text-gold transition-colors">Корзина</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-title font-serif text-white text-lg">Контакты</h4>
          <div className="space-y-2 text-sm">
            <p>📍 {settings.address}</p>
            <p>📞 {settings.phone}</p>
            <p>✉️ {settings.email}</p>
          </div>
        </div>
        <div>
          <h4 className="footer-title font-serif text-white text-lg">Часы работы</h4>
          <div className="space-y-2 text-sm">
            <p>Ресепшн: {settings.receptionHours}</p>
            <p>Ресторан: {settings.restaurantHours}</p>
            <p>Спа: {settings.spaHours}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>&copy; {year} {settings.hotelName}. Все права защищены.</p>
          <p>
            Разработка{' '}
            <a
              href="https://axiiom.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors font-medium"
            >
              AXIIOM
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
