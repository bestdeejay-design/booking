import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const FEATURES = [
  { icon: '✦', title: '5 звёзд', desc: 'Безупречный сервис и внимание к каждой детали вашего пребывания' },
  { icon: '⌂', title: 'Расположение', desc: 'Исторический центр Москвы — Кремль в 5 минутах пешком' },
  { icon: '❋', title: 'Ресторан', desc: 'Авторская кухня от шеф-повара, отмеченная гидом Michelin' },
  { icon: '❦', title: 'Спа-центр', desc: 'Термальный комплекс, массажи и эксклюзивные процедуры' },
];

export default function Home() {
  const { rooms, settings } = useData();
  const preview = rooms.slice(0, 3);

  return (
    <div>
      {/* ===== HERO: фото + градиентный оверлей ===== */}
      <section className="relative bg-charcoal overflow-hidden">
        <div
          className="hero-photo absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/rooms/penthause.webp)` }}
        />
        <div className="hero-overlay absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div
          className="absolute -right-32 -top-32 w-[520px] h-[520px] rounded-full pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle, rgba(201,169,110,.16), transparent 65%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10 md:pt-28 md:pb-20 w-full">
          <div className="max-w-2xl animate-rise">
            <span className="badge-demo">✦ Демо AXIIOM</span>
            <p className="eyebrow eyebrow-light mt-6 md:mt-8 mb-4 md:mb-5">ДОБРО ПОЖАЛОВАТЬ</p>
            <h1 className="display-1 text-white mb-4 md:mb-6">
              {(() => {
                const name = settings.hotelName || 'Grand Hotel';
                const parts = name.trim().split(/\s+/);
                if (parts.length === 1) return <span className="text-gold">{name}</span>;
                const first = parts[0];
                const rest = parts.slice(1).join(' ');
                return <>{first}<br className="hidden md:block" /><span className="text-gold"> {rest}</span></>;
              })()}
            </h1>
            <p className="text-gray-300 text-base md:text-lg mb-8 md:mb-10 leading-relaxed max-w-lg">
              Откройте для себя мир изысканного комфорта в историческом сердце столицы.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/rooms" className="btn btn-primary px-8 py-4 text-base">Забронировать</Link>
              <Link to="/services" className="btn btn-outline-light px-8 py-4 text-base">Услуги отеля</Link>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-black/25 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
            <div className="flex justify-around md:grid md:grid-cols-3 gap-4 md:gap-0">
              {[{ num: `${rooms.length}+`, label: 'Номеров' }, { num: '15', label: 'Лет опыта' }, { num: '50K+', label: 'Довольных гостей' }].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-serif text-2xl md:text-4xl text-gold font-bold">{s.num}</p>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ПРЕИМУЩЕСТВА ===== */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <p className="eyebrow text-center mb-3">ПРЕИМУЩЕСТВА</p>
          <h2 className="display-2 text-center text-charcoal mb-12 md:mb-16">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card card-hover p-8 text-center group"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-b from-gold-light to-cream border border-gold/30 flex items-center justify-center text-2xl text-gold-deep shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">{f.icon}</div>
                <h3 className="font-serif text-xl text-charcoal mb-3">{f.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== НОМЕРА (превью) ===== */}
      <section className="py-16 md:py-24 bg-white border-y border-line">
        <div className="max-w-7xl mx-auto px-6">
          <p className="eyebrow text-center mb-3">НОМЕРА</p>
          <h2 className="display-2 text-center text-charcoal mb-4">Выберите свой номер</h2>
          <p className="text-slate text-center mb-12 md:mb-16 max-w-lg mx-auto">
            От уютных стандартов до президентских апартаментов — у нас есть идеальный вариант для каждого
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preview.map((r) => (
              <Link key={r.id} to="/rooms" className="group card card-hover overflow-hidden flex flex-col">
                <div className="relative overflow-hidden bg-gradient-to-br from-charcoal to-charcoal-light" style={{ aspectRatio: '4 / 3' }}>
                  {r.image?.startsWith('/')
                    ? <img src={r.image} alt={r.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <span className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">{r.image || '🛏️'}</span>
                  }
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-2xl text-charcoal mb-1">{r.name}</h3>
                  <p className="text-slate text-sm mb-4 line-clamp-2">{r.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate mb-4">
                    <span>👥 {r.capacity} гостей</span>
                    <span aria-hidden="true" className="w-px h-3.5 bg-line" />
                    <span>📐 {r.size} м²</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-auto">
                    <span className="price text-2xl">{r.price.toLocaleString()} ₽</span>
                    <span className="text-slate text-xs">/ ночь</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/rooms" className="btn btn-outline px-8 py-3.5">Все номера →</Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-24 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, #c9a96e 1px, transparent 1px)', backgroundSize: '40px 40px'
        }} />
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <p className="eyebrow eyebrow-light mb-4">ЗАБРОНИРУЙТЕ СЕЙЧАС</p>
          <h2 className="display-2 md:text-5xl lg:text-6xl text-white mb-6">Готовы к идеальному отдыху?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
            Забронируйте номер прямо сейчас и получите бутылку шампанского в подарок
          </p>
          <Link to="/rooms" className="btn btn-primary px-10 py-4 text-lg">Выбрать номер</Link>
        </div>
      </section>
    </div>
  );
}
