import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

export default function Payment() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({ cardNumber: '1234 5678 9012 3456', cardName: 'IVAN PETROV', expiry: '12/28', cvc: '123' });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Войдите в аккаунт для оплаты'); navigate('/login'); return; }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));

    try {
      const bookings = items.map(item => ({
        guest: user.displayName || user.email,
        guestEmail: user.email,
        guestId: user.uid,
        type: item.type,
        name: item.name,
        roomId: item.id,
        price: item.price,
        quantity: item.quantity || 1,
        total: item.price * (item.quantity || 1),
        checkIn: item.checkIn || null,
        checkOut: item.checkOut || null,
        nights: item.nights || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }));

      await Promise.all(bookings.map(b => addDoc(collection(db, 'bookings'), b)));
    } catch (e) {
      console.error('Booking save error:', e);
    }

    clearCart();
    toast.success('Оплата прошла успешно! Бронирование подтверждено.');
    navigate('/dashboard');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="text-7xl mb-6">💳</div>
        <h2 className="font-serif text-3xl text-charcoal">Нечего оплачивать</h2>
        <p className="text-slate mt-2">Добавьте номера или услуги в корзину</p>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-gold tracking-[.2em] text-sm font-medium mb-2">ЗАВЕРШЕНИЕ</p>
        <h1 className="font-serif text-4xl text-charcoal mb-12">Оплата</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="font-serif text-xl text-charcoal mb-6">Ваш заказ</h2>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate">{item.name}{item.quantity > 1 && ` ×${item.quantity}`}</span>
                  <span className="font-medium">{(item.price * (item.quantity || 1)).toLocaleString()} ₽</span>
                </div>
              ))}
              <hr className="border-gray-100" />
              <div className="flex justify-between text-lg pt-2">
                <span className="font-serif text-charcoal">Итого</span>
                <span className="font-serif font-bold text-charcoal text-2xl">{total.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm p-8 space-y-5">
            <h2 className="font-serif text-xl text-charcoal mb-4">Данные карты</h2>

            <div>
              <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Номер карты</label>
              <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange}
                placeholder="1234 5678 9012 3456" maxLength={19} required
                className="w-full bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Имя держателя</label>
              <input type="text" name="cardName" value={form.cardName} onChange={handleChange}
                placeholder="IVAN PETROV" required
                className="w-full bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Срок</label>
                <input type="text" name="expiry" value={form.expiry} onChange={handleChange}
                  placeholder="MM/YY" maxLength={5} required
                  className="w-full bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">CVC</label>
                <input type="text" name="cvc" value={form.cvc} onChange={handleChange}
                  placeholder="123" maxLength={4} required
                  className="w-full bg-cream border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold" />
              </div>
            </div>

            <button type="submit" disabled={processing}
              className="w-full bg-charcoal text-white py-4 rounded-full font-medium hover:bg-gold hover:text-charcoal transition-all disabled:opacity-50 mt-2">
              {processing ? 'Обработка...' : `Оплатить ${total.toLocaleString()} ₽`}
            </button>

            <p className="text-xs text-slate/50 text-center mt-3">
              🔒 Демо-режим — средства не списываются
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
