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

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
      <div className="h-48 bg-gradient-to-br from-charcoal to-charcoal-light flex items-center justify-center text-5xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition" />
        {dateSelected && (
          <div className="absolute top-3 left-3 z-20">
            {available ? (
              <span className="bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">Свободен</span>
            ) : (
              <span className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">Занят</span>
            )}
          </div>
        )}
        {room.image?.startsWith('/')
          ? <img src={room.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          : <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">{room.image || '🛏️'}</span>
        }
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl text-charcoal font-bold">{room.name}</h3>
        <p className="text-slate text-sm mt-2 leading-relaxed">{room.description}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate">
          <span>👥 {room.capacity} гостей</span>
          <span>📐 {room.size} м²</span>
        </div>
        <div className="flex items-baseline gap-1 mt-4">
          <span className="font-serif text-2xl font-bold text-charcoal">{room.price.toLocaleString()} ₽</span>
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
            className="flex-1 text-center border-2 border-charcoal text-charcoal py-2.5 rounded-full text-sm font-medium hover:bg-charcoal hover:text-white transition-all"
          >
            Подробнее
          </Link>
          <button
            onClick={handleBook}
            disabled={dateSelected && !available}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
              dateSelected && !available
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-charcoal text-white hover:bg-gold hover:text-charcoal'
            }`}
          >
            {dateSelected && !available ? 'Занят' : 'Забронировать'}
          </button>
        </div>
      </div>
    </div>
  );
}
