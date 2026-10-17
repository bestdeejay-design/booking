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
        <h2 className="display-2 text-charcoal mb-3">Корзина пуста</h2>
        <p className="text-slate mb-8">Добавьте номера и услуги для бронирования</p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link to="/rooms" className="btn btn-dark px-6 py-4">
            Выбрать номер
          </Link>
          <Link to="/services" className="btn btn-outline px-6 py-4">
            Заказать услуги
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="eyebrow mb-3">БРОНИРОВАНИЕ</p>
        <h1 className="display-2 text-charcoal mb-10">Корзина</h1>

        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={`${item.type}-${item.id}-${i}`} className="card card-hover p-5 md:p-6 flex items-center gap-5 flex-wrap">
              {item.image?.startsWith('/')
                ? <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover border border-line" />
                : <div className="w-16 h-16 rounded-xl bg-cream border border-line flex items-center justify-center text-3xl">{item.image || '📦'}</div>
              }
              <div className="flex-1 min-w-[180px]">
                <h3 className="font-serif text-lg text-charcoal font-bold">{item.name}</h3>
                <p className="text-slate text-sm mt-1">{item.description}</p>
                {item.type === 'room' && item.checkIn && (
                  <p className="text-gold-dark text-sm mt-1">
                    📅 {item.checkIn} → {item.checkOut} · {item.nights} {item.nights === 1 ? 'ночь' : 'ночей'}
                  </p>
                )}
                <p className="price text-lg mt-2">{item.price.toLocaleString()} ₽{item.type === 'room' ? ' / ночь' : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                {item.type === 'service' && (
                  <select
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, item.type, Number(e.target.value))}
                    className="field w-auto py-2.5" aria-label="Количество"
                  >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                )}
                <button onClick={() => handleRemove(item)} aria-label="Удалить из корзины" className="text-gray-400 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition">✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass p-6 md:p-8 mt-8">
          <div className="flex justify-between items-center">
            <span className="font-serif text-xl text-charcoal">Итого</span>
            <span className="price text-3xl">{total.toLocaleString()} ₽</span>
          </div>
          <div className="flex gap-4 mt-8 flex-col sm:flex-row">
            <button
              onClick={clearCart}
              className="btn py-4 border border-line-strong text-slate hover:border-red-300 hover:text-red-500 hover:bg-red-50"
            >
              Очистить
            </button>
            <Link
              to="/payment"
              className="btn btn-dark flex-1 px-6 py-4"
            >
              Перейти к оплате
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
