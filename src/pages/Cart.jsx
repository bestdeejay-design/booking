import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();

  const handleRemove = (item) => {
    removeFromCart(item.id, item.type);
    toast.success('Удалено из корзины');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="font-serif text-3xl text-charcoal mb-3">Корзина пуста</h2>
        <p className="text-slate mb-8">Добавьте номера и услуги для бронирования</p>
        <div className="flex gap-4">
          <Link to="/rooms" className="bg-charcoal text-white px-6 py-3 rounded-full font-medium hover:bg-gold hover:text-charcoal transition-all">
            Выбрать номер
          </Link>
          <Link to="/services" className="border-2 border-charcoal text-charcoal px-6 py-3 rounded-full font-medium hover:bg-charcoal hover:text-white transition-all">
            Заказать услуги
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-gold tracking-[.2em] text-sm mb-3 font-medium">БРОНИРОВАНИЕ</p>
        <h1 className="font-serif text-4xl text-charcoal mb-10">Корзина</h1>

        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={`${item.type}-${item.id}-${i}`} className="bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm">
              <div className="text-4xl">{item.image || '📦'}</div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-charcoal font-bold">{item.name}</h3>
                <p className="text-slate text-sm mt-1">{item.description}</p>
                {item.type === 'room' && item.checkIn && (
                  <p className="text-gold text-sm mt-1">
                    📅 {item.checkIn} → {item.checkOut} · {item.nights} {item.nights === 1 ? 'ночь' : 'ночей'}
                  </p>
                )}
                <p className="font-bold text-charcoal mt-2">{item.price.toLocaleString()} ₽{item.type === 'room' ? ' / ночь' : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                {item.type === 'service' && (
                  <select
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, item.type, Number(e.target.value))}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gold"
                  >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                )}
                <button onClick={() => handleRemove(item)} className="text-gray-400 hover:text-red-500 text-xl transition">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 mt-8">
          <div className="flex justify-between items-center">
            <span className="font-serif text-xl text-charcoal">Итого</span>
            <span className="font-serif text-3xl font-bold text-charcoal">{total.toLocaleString()} ₽</span>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={clearCart}
              className="border-2 border-gray-300 text-slate px-6 py-3 rounded-full font-medium hover:border-red-400 hover:text-red-500 transition-all"
            >
              Очистить
            </button>
            <Link
              to="/payment"
              className="flex-1 bg-charcoal text-white px-6 py-3 rounded-full font-medium text-center hover:bg-gold hover:text-charcoal transition-all"
            >
              Перейти к оплате
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
