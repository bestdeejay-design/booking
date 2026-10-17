import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useCart } from '../contexts/CartContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

export default function RoomDetail() {
  const { id } = useParams();
  const { rooms, loading } = useData();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!checkIn || !checkOut) { setBookings([]); return; }
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'bookings'));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setBookings(all.filter(b =>
          b.type === 'room' && b.status !== 'cancelled' &&
          b.checkIn && b.checkOut &&
          b.checkIn < checkOut && b.checkOut > checkIn
        ));
      } catch { setBookings([]); }
    })();
  }, [checkIn, checkOut]);

  if (loading) {
    return <div className="flex justify-center py-40"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  const room = rooms.find(r => r.id === id);

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h2 className="font-serif text-3xl">Номер не найден</h2>
        <Link to="/rooms" className="text-gold mt-4 inline-block">← К списку номеров</Link>
      </div>
    );
  }

  const dateSelected = checkIn && checkOut;
  const isAvailable = !dateSelected || !bookings.some(b => b.roomId === id);
  const nights = dateSelected ? Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 0;
  const amenities = room.amenities || ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар'];

  const handleBook = () => {
    if (!checkIn || !checkOut) { toast.error('Выберите даты'); return; }
    if (!isAvailable) { toast.error('Номер занят на эти даты'); return; }
    addToCart({ id: room.id, type: 'room', name: room.name, price: room.price, image: room.image, description: room.description, checkIn, checkOut, nights });
    toast.success(`${room.name} добавлен в корзину`);
    navigate('/cart');
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/rooms" className="text-slate hover:text-gold-dark transition text-sm inline-flex items-center gap-1">← Назад</Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 mt-6">
          <div>
            <div className="relative overflow-hidden bg-gradient-to-br from-charcoal to-charcoal-light rounded-2xl shadow-2xl shadow-charcoal/25" style={{ aspectRatio: '4 / 3' }}>
              <div className="absolute inset-0 bg-gold/5" />
              {dateSelected && (
                <div className="absolute top-4 left-4 z-20">
                  {isAvailable
                    ? <span className="bg-emerald-500 text-white text-sm font-medium px-4 py-1.5 rounded-full">Свободен</span>
                    : <span className="bg-red-500 text-white text-sm font-medium px-4 py-1.5 rounded-full">Занят</span>
                  }
                </div>
              )}
              {room.image?.startsWith('/')
                ? <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
                : <span className="absolute inset-0 flex items-center justify-center text-9xl">{room.image || '🛏️'}</span>
              }
            </div>
          </div>
          <div>
            <p className="eyebrow">НОМЕР</p>
            <h1 className="display-2 text-charcoal mt-2">{room.name}</h1>
            <p className="text-slate mt-6 leading-relaxed text-lg">{room.description}</p>
            <div className="flex items-center gap-8 mt-6 text-slate">
              <span className="text-lg">👥 {room.capacity} гостей</span>
              <span className="text-lg">📐 {room.size} м²</span>
            </div>
            <div className="mt-8">
              <h3 className="font-serif text-lg text-charcoal mb-3">Удобства</h3>
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => <span key={a} className="badge py-2 px-4 text-sm">{a}</span>)}
              </div>
            </div>
            <div className="mt-10 glass p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Заезд</label>
                  <input type="date" value={checkIn} onChange={e => { setCheckIn(e.target.value); if (!checkOut) setCheckOut(e.target.value); }}
                    min={new Date().toISOString().split('T')[0]}
                    className="field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Выезд</label>
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="field" />
                </div>
              </div>
              {nights > 0 && (
                <div className="flex items-baseline justify-center gap-3 mb-6">
                  <span className="text-slate text-sm">{nights} {nights === 1 ? 'ночь' : 'ночей'} —</span>
                  <span className="price text-3xl">{(room.price * nights).toLocaleString()} ₽</span>
                </div>
              )}
              <button onClick={handleBook}
                disabled={dateSelected && !isAvailable}
                className="btn btn-dark w-full py-4 text-base">
                {dateSelected && !isAvailable ? 'Занят на эти даты' : `Забронировать · ${room.price.toLocaleString()} ₽ / ночь`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
