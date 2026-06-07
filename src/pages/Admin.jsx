import { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const TABS = ['Шахматка', 'Номера', 'Бронирования', 'Услуги', 'Настройки'];
const DAYS = 21;

export default function Admin() {
  const { rooms, services, settings, loading: dataLoading, addRoom, updateRoom, deleteRoom, addService, deleteService, toggleService, updateSettings } = useData();
  const [tab, setTab] = useState('Шахматка');
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({ name: '', price: 0, capacity: 1, size: 20, description: '', image: '🛏️', amenities: '' });
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  // Service form state
  const [editingService, setEditingService] = useState(null);
  const [svcForm, setSvcForm] = useState({ name: '', price: 0, description: '', image: '🎁' });
  const [svcSaving, setSvcSaving] = useState(false);
  const svcFormRef = useRef(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  useEffect(() => { setSettingsForm({ ...settings }); }, [settings]);

  useEffect(() => {
    if (editingRoom && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [editingRoom]);

  useEffect(() => {
    if (editingService && svcFormRef.current) {
      svcFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [editingService]);

  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'bookings'));
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {}
    setBookingsLoading(false);
  };

  useEffect(() => { if (tab === 'Бронирования' || tab === 'Шахматка') loadBookings(); }, [tab]);

  // Room handlers
  const handleEditRoom = (room) => {
    setEditingRoom(room.id);
    setForm({
      name: room.name, price: room.price, capacity: room.capacity, size: room.size,
      description: room.description || '', image: room.image || '🛏️',
      amenities: (room.amenities || []).join(', '),
    });
  };

  const handleSaveRoom = async () => {
    if (!form.name) { toast.error('Введите название'); return; }
    setSaving(true);
    const data = {
      ...form,
      amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
    };
    if (editingRoom && editingRoom !== true) {
      await updateRoom(editingRoom, data);
      toast.success('Номер обновлён');
    } else {
      await addRoom(data);
      toast.success('Номер добавлен');
    }
    setSaving(false);
    setEditingRoom(null);
    setForm({ name: '', price: 0, capacity: 1, size: 20, description: '', image: '🛏️', amenities: '' });
  };

  const handleDeleteRoom = async (id) => { await deleteRoom(id); toast.success('Номер удалён'); };

  // Service handlers
  const handleEditService = (svc) => {
    setEditingService(svc.id);
    setSvcForm({ name: svc.name, price: svc.price, description: svc.description || '', image: svc.image || '🎁' });
  };

  const handleSaveService = async () => {
    if (!svcForm.name) { toast.error('Введите название'); return; }
    setSvcSaving(true);
    if (editingService && editingService !== true) {
      // Edit existing → update via Firestore
      try { await updateDoc(doc(db, 'services', editingService), svcForm); } catch {}
      toast.success('Услуга обновлена');
    } else {
      await addService({ ...svcForm, active: true });
      toast.success('Услуга добавлена');
    }
    setSvcSaving(false);
    setEditingService(null);
    setSvcForm({ name: '', price: 0, description: '', image: '🎁' });
  };

  const handleDeleteService = async (id) => { await deleteService(id); toast.success('Услуга удалена'); };
  const handleToggleService = async (id, active) => { await toggleService(id, !active); toast.success('Статус изменён'); };

  // Booking handlers
  const handleBookingStatus = async (id, status) => {
    try { await updateDoc(doc(db, 'bookings', id), { status }); } catch {}
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success(status === 'confirmed' ? 'Бронь подтверждена' : 'Бронь отменена');
  };

  // Settings
  const handleSaveSettings = async () => {
    await updateSettings(settingsForm);
    toast.success('Настройки сохранены');
  };

  // Chessboard data
  const today = new Date();
  const dates = Array.from({ length: DAYS }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i); return d; });
  const formatDate = (d) => d.toISOString().split('T')[0];
  const formatShort = (d) => `${d.getDate()}.${d.getMonth() + 1}`;
  const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;
  const getBookingForRoom = (roomId, dateObj) => {
    const ds = formatDate(dateObj);
    return bookings.find(b => {
      if (b.type !== 'room' || b.roomId !== roomId) return false;
      if (b.status === 'cancelled') return false;
      if (!b.checkIn || !b.checkOut) return false;
      return b.checkIn <= ds && b.checkOut >= ds;
    });
  };

  if (dataLoading) {
    return <div className="flex justify-center py-40"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  const roomBookings = bookings.filter(b => b.type === 'room');
  const todayStr = formatDate(today);

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-gold tracking-[.2em] text-sm font-medium mb-2">УПРАВЛЕНИЕ</p>
        <h1 className="font-serif text-4xl text-charcoal mb-10">Админ-панель</h1>

        <div className="flex flex-wrap gap-2 mb-10">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-3.5 rounded-full text-sm font-medium transition-all ${tab === t ? 'bg-charcoal text-white' : 'bg-white text-slate hover:bg-gray-100 shadow-sm'}`}>{t}</button>
          ))}
        </div>

        {/* ШАХМАТКА */}
        {tab === 'Шахматка' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl text-charcoal">Шахматка</h2>
                <p className="text-slate text-sm mt-1">{roomBookings.length} бронирований · {rooms.length} номеров</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-300" /> Свободно</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-200 border border-amber-400" /> Ожидает</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-300 border border-red-400" /> Занято</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b">
                      <th className="sticky left-0 bg-white z-10 text-left p-3 font-medium text-xs text-slate uppercase w-48">Номер</th>
                      {dates.map((d, i) => (
                        <th key={i} className={`p-2 text-center text-[10px] font-medium ${isWeekend(d) ? 'text-red-400' : 'text-slate'} ${formatDate(d) === todayStr ? 'bg-gold-light' : ''}`}>
                          <div>{formatShort(d)}</div>
                          <div className="opacity-50">{['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d.getDay()]}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(room => (
                      <tr key={room.id} className="border-b hover:bg-gray-50/50">
                        <td className="sticky left-0 bg-white z-10 p-3">
                          <div className="flex items-center gap-3">
                            {room.image?.startsWith('/')
                              ? <img src={room.image} alt="" className="w-8 h-8 rounded object-cover" />
                              : <span className="text-xl">{room.image || '🛏️'}</span>
                            }
                            <div>
                              <p className="font-serif text-sm text-charcoal font-medium leading-tight">{room.name}</p>
                              <p className="text-[10px] text-slate">{room.price.toLocaleString()} ₽</p>
                            </div>
                          </div>
                        </td>
                        {dates.map((d, i) => {
                          const booking = getBookingForRoom(room.id, d);
                          const ds = formatDate(d);
                          const isCheckIn = booking && booking.checkIn === ds;
                          const isCheckOut = booking && booking.checkOut === ds;
                          const isToday = ds === todayStr;
                          let bg = 'bg-emerald-100/40';
                          let title = '';
                          if (booking) {
                            bg = booking.status === 'confirmed' ? 'bg-red-300/60' : 'bg-amber-200';
                            title = `${booking.guest}\n${booking.checkIn} → ${booking.checkOut}`;
                          }
                          return (
                            <td key={i} className={`p-0 relative ${isToday ? 'ring-2 ring-gold ring-inset' : ''}`}>
                              <div className={`h-10 m-0.5 rounded flex items-center justify-center text-[9px] ${bg} ${isCheckIn ? 'border-l-2 border-l-charcoal' : ''} ${isCheckOut ? 'border-r-2 border-r-charcoal' : ''}`} title={title}>
                                {isCheckIn && <span className="text-charcoal font-bold text-[8px]">▶</span>}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* НОМЕРА */}
        {tab === 'Номера' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl">Управление номерами ({rooms.length})</h2>
              <button onClick={() => setEditingRoom(true)} className="bg-gold text-charcoal px-5 py-3.5 rounded-full text-sm font-medium hover:bg-gold-dark transition-all">+ Добавить номер</button>
            </div>

            {editingRoom && (
              <div ref={formRef} className="bg-white rounded-2xl shadow-sm p-6 mb-6 space-y-4 ring-2 ring-gold">
                <h3 className="font-serif text-lg">{editingRoom === true ? 'Новый номер' : 'Редактирование'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Название" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                  <input placeholder="Эмодзи" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} className="bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                  <input type="number" placeholder="Цена" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} className="bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                  <input type="number" placeholder="Вместимость" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: Number(e.target.value) }))} className="bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                  <input type="number" placeholder="Размер (м²)" value={form.size} onChange={e => setForm(p => ({ ...p, size: Number(e.target.value) }))} className="bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                  <input placeholder="Описание" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                  <input placeholder="Удобства (через запятую)" value={form.amenities} onChange={e => setForm(p => ({ ...p, amenities: e.target.value }))} className="col-span-2 bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveRoom} disabled={saving} className="bg-charcoal text-white px-5 py-3.5 rounded-full text-sm font-medium disabled:opacity-50">{saving ? 'Сохранение...' : 'Сохранить'}</button>
                  <button onClick={() => setEditingRoom(null)} className="bg-gray-100 text-slate px-5 py-3.5 rounded-full text-sm font-medium">Отмена</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {rooms.map(room => (
                <div key={room.id} className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    {room.image?.startsWith('/')
                      ? <img src={room.image} alt="" className="w-10 h-10 rounded object-cover" />
                      : <span className="text-3xl">{room.image || '🛏️'}</span>
                    }
                    <div>
                      <p className="font-serif text-lg text-charcoal">{room.name}</p>
                      <p className="text-slate text-sm">{room.price.toLocaleString()} ₽/ночь · 👥 {room.capacity} · 📐 {room.size}м² · {(room.amenities || []).length} удобств</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditRoom(room)} className={`px-3 py-2 rounded-full text-sm font-medium transition ${editingRoom === room.id ? 'bg-gold text-charcoal' : 'bg-gray-100 hover:bg-gray-200'}`}>{editingRoom === room.id ? '✏️ Редактирую...' : '✏️ Изменить'}</button>
                    <button onClick={() => handleDeleteRoom(room.id)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full text-sm font-medium transition">🗑️ Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* БРОНИРОВАНИЯ */}
        {tab === 'Бронирования' && (
          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-6">Управление бронированиями</h2>
            {bookingsLoading ? (
              <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
            ) : bookings.length === 0 ? (
              <p className="text-slate text-center py-10">Пока нет бронирований</p>
            ) : (
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-lg text-charcoal">{b.guest}</h3>
                      <p className="text-slate text-sm">
                        {b.type === 'room' ? `🏨 ${b.name}` : `🎁 ${b.name}`}
                        {b.checkIn && <> · 📅 {b.checkIn} → {b.checkOut} · {b.nights} ночей</>}
                        {b.quantity > 1 && <> · ×{b.quantity}</>}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{(b.total || b.price).toLocaleString()} ₽</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : b.status === 'cancelled' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-700'}`}>
                        {b.status === 'confirmed' ? 'Подтв.' : b.status === 'cancelled' ? 'Отмен.' : 'Ожидает'}
                      </span>
                      {b.status !== 'confirmed' && <button onClick={() => handleBookingStatus(b.id, 'confirmed')} className="bg-emerald-500 text-white px-3 py-2 rounded-xl text-sm hover:bg-emerald-600">✓</button>}
                      {b.status !== 'cancelled' && <button onClick={() => handleBookingStatus(b.id, 'cancelled')} className="bg-red-400 text-white px-3 py-2 rounded-xl text-sm hover:bg-red-500">✕</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* УСЛУГИ */}
        {tab === 'Услуги' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl">Управление услугами ({services.length})</h2>
              <button onClick={() => setEditingService(true)} className="bg-gold text-charcoal px-5 py-3.5 rounded-full text-sm font-medium hover:bg-gold-dark transition-all">+ Добавить услугу</button>
            </div>

            {editingService && (
              <div ref={svcFormRef} className="bg-white rounded-2xl shadow-sm p-6 mb-6 space-y-4 ring-2 ring-gold">
                <h3 className="font-serif text-lg">{editingService === true ? 'Новая услуга' : 'Редактирование'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Название" value={svcForm.name} onChange={e => setSvcForm(p => ({ ...p, name: e.target.value }))} className="bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                  <input placeholder="Эмодзи" value={svcForm.image} onChange={e => setSvcForm(p => ({ ...p, image: e.target.value }))} className="bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                  <input type="number" placeholder="Цена (0 = бесплатно)" value={svcForm.price} onChange={e => setSvcForm(p => ({ ...p, price: Number(e.target.value) }))} className="bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                  <input placeholder="Описание" value={svcForm.description} onChange={e => setSvcForm(p => ({ ...p, description: e.target.value }))} className="bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveService} disabled={svcSaving} className="bg-charcoal text-white px-5 py-3.5 rounded-full text-sm font-medium disabled:opacity-50">{svcSaving ? 'Сохранение...' : 'Сохранить'}</button>
                  <button onClick={() => setEditingService(null)} className="bg-gray-100 text-slate px-5 py-3.5 rounded-full text-sm font-medium">Отмена</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {services.map(s => (
                <div key={s.id} className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    {s.image?.startsWith('/')
                      ? <img src={s.image} alt="" className="w-10 h-10 rounded object-cover" />
                      : <span className="text-3xl">{s.image || '🎁'}</span>
                    }
                    <div>
                      <p className="font-serif text-lg text-charcoal">{s.name}</p>
                      <p className="text-slate text-sm">{s.price > 0 ? `${s.price.toLocaleString()} ₽` : 'Бесплатно'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${s.active ? 'text-emerald-600' : 'text-red-400'}`}>{s.active ? 'Активна' : 'Отключена'}</span>
                    <button onClick={() => handleToggleService(s.id, s.active)} className={`px-3 py-2 rounded-full text-sm font-medium ${s.active ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>{s.active ? 'Откл' : 'Вкл'}</button>
                    <button onClick={() => handleEditService(s)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium">✏️</button>
                    <button onClick={() => handleDeleteService(s.id)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full text-sm font-medium">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* НАСТРОЙКИ */}
        {tab === 'Настройки' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-lg">
            <h2 className="font-serif text-2xl text-charcoal mb-6">Настройки отеля</h2>
            <p className="text-xs text-slate mb-6">Изменения применятся на всём сайте после сохранения</p>
            <div className="space-y-5">
              <div><label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Название отеля</label>
                <input value={settingsForm.hotelName || ''} onChange={e => setSettingsForm(p => ({ ...p, hotelName: e.target.value }))} className="w-full bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" /></div>
              <div><label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Email</label>
                <input value={settingsForm.email || ''} onChange={e => setSettingsForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" /></div>
              <div><label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Телефон</label>
                <input value={settingsForm.phone || ''} onChange={e => setSettingsForm(p => ({ ...p, phone: e.target.value }))} className="w-full bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" /></div>
              <div><label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Адрес</label>
                <input value={settingsForm.address || ''} onChange={e => setSettingsForm(p => ({ ...p, address: e.target.value }))} className="w-full bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div><label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Ресепшн</label>
                  <input value={settingsForm.receptionHours || ''} onChange={e => setSettingsForm(p => ({ ...p, receptionHours: e.target.value }))} className="w-full bg-cream border-0 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" /></div>
                <div><label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Ресторан</label>
                  <input value={settingsForm.restaurantHours || ''} onChange={e => setSettingsForm(p => ({ ...p, restaurantHours: e.target.value }))} className="w-full bg-cream border-0 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" /></div>
                <div><label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Спа</label>
                  <input value={settingsForm.spaHours || ''} onChange={e => setSettingsForm(p => ({ ...p, spaHours: e.target.value }))} className="w-full bg-cream border-0 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" /></div>
              </div>
              <button onClick={handleSaveSettings} className="bg-charcoal text-white px-8 py-4 rounded-full font-medium hover:bg-gold hover:text-charcoal transition-all">Сохранить</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
