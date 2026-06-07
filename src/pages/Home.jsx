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
      <section className="relative min-h-[90vh] flex items-center bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #c9a96e 1px, transparent 1px)', backgroundSize: '50px 50px'
        }} />
        <div className="absolute right-0 top-0 bottom-0 w-2/5 bg-gradient-to-l from-gold/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 pb-48 md:pb-20 w-full">
          <div className="max-w-2xl">
            <p className="text-gold tracking-[.25em] text-sm mb-6 font-medium">ДОБРО ПОЖАЛОВАТЬ</p>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6">
              {(() => {
                const name = settings.hotelName || 'Grand Hotel';
                const parts = name.trim().split(/\s+/);
                if (parts.length === 1) return <span className="text-gold">{name}</span>;
                const first = parts[0];
                const rest = parts.slice(1).join(' ');
                return <>{first}<br/><span className="text-gold">{rest}</span></>;
              })()}
            </h1>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg">
              Откройте для себя мир изысканного комфорта в историческом сердце столицы. Каждый номер — произведение искусства.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/rooms" className="bg-gold hover:bg-gold-dark text-charcoal px-8 py-4 rounded-full font-medium tracking-wide transition-all hover:shadow-xl hover:shadow-gold/20">Забронировать</Link>
              <Link to="/services" className="border border-white/20 text-white hover:border-gold hover:text-gold px-8 py-4 rounded-full font-medium tracking-wide transition-all">Услуги отеля</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 border-t border-white/10">
            {[{ num: `${rooms.length}+`, label: 'Номеров' }, { num: '15', label: 'Лет опыта' }, { num: '50K+', label: 'Довольных гостей' }].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-3xl text-gold font-bold">{s.num}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gold tracking-[.2em] text-sm text-center mb-3 font-medium">ПРЕИМУЩЕСТВА</p>
          <h2 className="font-serif text-4xl md:text-5xl text-center text-charcoal mb-16">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">{f.icon}</div>
                <h3 className="font-serif text-xl text-charcoal mb-3">{f.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gold tracking-[.2em] text-sm text-center mb-3 font-medium">НОМЕРА</p>
          <h2 className="font-serif text-4xl md:text-5xl text-center text-charcoal mb-4">Выберите свой номер</h2>
          <p className="text-slate text-center mb-16 max-w-lg mx-auto">
            От уютных стандартов до президентских апартаментов — у нас есть идеальный вариант для каждого
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {preview.map((r) => (
              <Link key={r.id} to="/rooms" className="group bg-cream rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="h-52 bg-gradient-to-br from-charcoal to-charcoal-light flex items-center justify-center text-6xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition" />
                  {r.image?.startsWith('/')
                    ? <img src={r.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    : <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">{r.image || '🛏️'}</span>
                  }
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-charcoal mb-1">{r.name}</h3>
                  <p className="text-slate text-sm mb-4">{r.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate mb-4">
                    <span>👥 {r.capacity} гостей</span>
                    <span>📐 {r.size} м²</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="font-serif text-2xl text-charcoal font-bold">{r.price.toLocaleString()} ₽</span>
                    <span className="text-slate text-xs">/ ночь</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/rooms" className="inline-block border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white px-8 py-3.5 rounded-full font-medium tracking-wide transition-all">Все номера →</Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, #c9a96e 1px, transparent 1px)', backgroundSize: '40px 40px'
        }} />
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <p className="text-gold tracking-[.2em] text-sm mb-4 font-medium">ЗАБРОНИРУЙТЕ СЕЙЧАС</p>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">Готовы к идеальному отдыху?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
            Забронируйте номер прямо сейчас и получите бутылку шампанского в подарок
          </p>
          <Link to="/rooms" className="inline-block bg-gold hover:bg-gold-dark text-charcoal px-10 py-4 rounded-full font-medium text-lg tracking-wide transition-all hover:shadow-xl hover:shadow-gold/20">Выбрать номер</Link>
        </div>
      </section>
    </div>
  );
}
