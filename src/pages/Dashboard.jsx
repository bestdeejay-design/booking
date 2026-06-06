import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const STATUS = {
  confirmed: { text: 'Подтверждено', classes: 'bg-emerald-50 text-emerald-700' },
  pending: { text: 'Ожидает', classes: 'bg-amber-50 text-amber-700' },
  cancelled: { text: 'Отменено', classes: 'bg-red-50 text-red-500' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const q = query(collection(db, 'bookings'), where('guestId', '==', user.uid));
        const snap = await getDocs(q);
        setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-sm p-10 mb-10">
          <p className="text-gold tracking-[.2em] text-sm font-medium mb-2">ЛИЧНЫЙ КАБИНЕТ</p>
          <h1 className="font-serif text-3xl text-charcoal">
            {user?.displayName || 'Гость'}
          </h1>
          <p className="text-slate mt-1">{user?.email}</p>
        </div>

        <h2 className="font-serif text-2xl text-charcoal mb-6">Мои бронирования</h2>

        {loading ? (
          <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
            <p className="text-slate mb-6">У вас пока нет бронирований</p>
            <Link to="/rooms" className="text-gold font-medium hover:text-gold-dark">
              Забронировать номер →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const s = STATUS[b.status] || STATUS.pending;
              return (
                <div key={b.id} className="bg-white rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-charcoal">{b.name}</h3>
                    <p className="text-slate text-sm mt-1">
                      {b.checkIn ? `📅 ${b.checkIn} → ${b.checkOut} · ${b.nights} ночей` : `${b.type === 'service' ? '🎁' : '🏨'} ${b.quantity > 1 ? `×${b.quantity}` : ''}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-serif text-xl font-bold text-charcoal">{(b.total || b.price).toLocaleString()} ₽</span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${s.classes}`}>{s.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
