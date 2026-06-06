import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import RoomCard from '../components/RoomCard';

export default function Rooms() {
  const { rooms, loading } = useData();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [sort, setSort] = useState('default');
  const [filterCapacity, setFilterCapacity] = useState(0);
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
          b.type === 'room' &&
          b.status !== 'cancelled' &&
          b.checkIn &&
          b.checkOut &&
          b.checkIn < checkOut &&
          b.checkOut > checkIn
        ));
      } catch { setBookings([]); }
    })();
  }, [checkIn, checkOut]);

  const isRoomAvailable = (roomId) => {
    if (!checkIn || !checkOut) return true;
    return !bookings.some(b => b.roomId === roomId);
  };

  if (loading) {
    return <div className="flex justify-center py-40"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  let filtered = [...rooms];
  if (filterCapacity > 0) filtered = filtered.filter(r => r.capacity >= filterCapacity);
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'capacity') filtered.sort((a, b) => b.capacity - a.capacity);

  const dateSelected = checkIn && checkOut;

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-gold tracking-[.2em] text-sm mb-3 font-medium">НОМЕРА</p>
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-8">Выберите свой номер</h1>

        <div className="glass rounded-2xl p-4 mb-10">
          <p className="text-xs text-slate uppercase tracking-wider mb-3 font-medium">Выберите даты, чтобы увидеть доступные номера</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate">Заезд</label>
              <input type="date" value={checkIn} onChange={e => { setCheckIn(e.target.value); if (!checkOut) setCheckOut(e.target.value); }}
                min={today} className="bg-white border-0 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate">Выезд</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                min={checkIn || today} className="bg-white border-0 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold" />
            </div>
            <div className="w-px h-6 bg-gray-200" />

            <select value={sort} onChange={e => setSort(e.target.value)}
              className="bg-transparent border-0 text-charcoal text-sm font-medium focus:ring-0 cursor-pointer outline-none">
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
              <option value="capacity">Вместимость</option>
            </select>
            <div className="w-px h-6 bg-gray-200" />
            <select value={filterCapacity} onChange={e => setFilterCapacity(Number(e.target.value))}
              className="bg-transparent border-0 text-charcoal text-sm font-medium focus:ring-0 cursor-pointer outline-none">
              <option value={0}>Любая вместимость</option>
              <option value={1}>От 1 гостя</option>
              <option value={2}>От 2 гостей</option>
              <option value={3}>От 3 гостей</option>
              <option value={4}>От 4 гостей</option>
            </select>

            <span className="text-slate text-sm ml-auto">
              {dateSelected && <>Доступно: {filtered.filter(r => isRoomAvailable(r.id)).length} из {filtered.length}</>}
              {!dateSelected && <>Найдено: {filtered.length}</>}
            </span>
          </div>
        </div>

        {dateSelected && filtered.filter(r => isRoomAvailable(r.id)).length === 0 && (
          <div className="text-center py-8 text-slate">
            <p className="text-lg mb-2">😔 На эти даты все номера заняты</p>
            <p>Попробуйте другие даты</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(room => (
            <RoomCard key={room.id} room={room} available={isRoomAvailable(room.id)} checkIn={checkIn} checkOut={checkOut} />
          ))}
        </div>
      </div>
    </div>
  );
}
