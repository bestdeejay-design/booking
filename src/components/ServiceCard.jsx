import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

export default function ServiceCard({ service }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      id: service.id, type: 'service', name: service.name,
      price: service.price, image: service.image, description: service.description,
    });
    toast.success(`${service.name} добавлен в корзину`);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
      <div className="h-40 bg-gradient-to-br from-cream to-gold-light flex items-center justify-center text-4xl relative overflow-hidden">
        <span className="group-hover:scale-110 transition-transform duration-500">{service.image || '🎁'}</span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl text-charcoal font-bold">{service.name}</h3>
        <p className="text-slate text-sm mt-2 leading-relaxed">{service.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-serif text-2xl font-bold text-charcoal">
            {service.price > 0 ? `${service.price.toLocaleString()} ₽` : 'Бесплатно'}
          </span>
        </div>
        <button
          onClick={handleAdd}
          className="w-full mt-4 bg-gold text-charcoal py-2.5 rounded-full text-sm font-medium hover:bg-gold-dark transition-all"
        >
          Заказать
        </button>
      </div>
    </div>
  );
}
