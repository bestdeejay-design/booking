import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

export default function RoomCard({ room, available = true, checkIn = '', checkOut = '' }) {
  const { addToCart } = useCart();

  const dateSelected = checkIn && checkOut;
  const nights = dateSelected
    ? Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;

  const handleBook = (e) => {
    e.preventDefault();
    if (!available) { toast.error('Номер занят на эти даты'); return; }
    if (!dateSelected) { toast.error('Выберите даты заезда и выезда'); return; }
    addToCart({
      id: room.id, type: 'room', name: room.name,
      price: room.price, image: room.image, description: room.description,
      checkIn, checkOut, nights,
    });
    toast.success(`${room.name} добавлен в корзину`);
  };

  const amenities = (room.amenities || []).slice(0, 3);

  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative overflow-hidden bg-gradient-to-br from-charcoal to-charcoal-light" style={{ aspectRatio: '4 / 3' }}>
        {dateSelected && (
          <div className="absolute top-3 left-3 z-20">
            {available ? (
              <span className="bg-emerald-500/95 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">Свободен</span>
            ) : (
              <span className="bg-red-500/95 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">Занят</span>
            )}
          </div>
        )}
        {room.image?.startsWith('/')
          ? <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <span className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">{room.image || '🛏️'}</span>
        }
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl text-charcoal font-bold leading-snug">{room.name}</h3>
        <p className="text-slate text-sm mt-2 leading-relaxed line-clamp-2">{room.description}</p>

        <div className="flex items-center gap-3 mt-3 text-xs text-slate">
          <span>👥 {room.capacity} гостей</span>
          <span aria-hidden="true" className="w-px h-3.5 bg-line" />
          <span>📐 {room.size} м²</span>
        </div>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {amenities.map(a => <span key={a} className="badge">{a}</span>)}
            {(room.amenities?.length || 0) > 3 && (
              <span className="badge">+{room.amenities.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-baseline gap-1.5 mt-auto pt-4">
          <span className="price text-2xl">{room.price.toLocaleString()} ₽</span>
          <span className="text-slate text-xs">/ ночь</span>
        </div>
        {nights > 0 && (
          <p className="text-xs text-slate mt-1">
            {nights} {nights === 1 ? 'ночь' : 'ночей'} → {(room.price * nights).toLocaleString()} ₽
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <Link
            to={`/rooms/${room.id}`}
            className="btn btn-outline flex-1 py-3"
          >
            Подробнее
          </Link>
          <button
            onClick={handleBook}
            disabled={dateSelected && !available}
            className="btn btn-dark flex-1 py-3"
          >
            {dateSelected && !available ? 'Занят' : 'Забронировать'}
          </button>
        </div>
      </div>
    </div>
  );
}
