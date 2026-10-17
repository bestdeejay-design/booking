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
    <div className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative overflow-hidden bg-gradient-to-br from-cream to-gold-light" style={{ aspectRatio: '4 / 3' }}>
        {service.image?.startsWith('/')
          ? <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <span className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">{service.image || '🎁'}</span>
        }
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl text-charcoal font-bold">{service.name}</h3>
        <p className="text-slate text-sm mt-2 leading-relaxed line-clamp-2">{service.description}</p>
        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="price text-2xl">
            {service.price > 0 ? `${service.price.toLocaleString()} ₽` : 'Бесплатно'}
          </span>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-primary w-full mt-4"
        >
          Заказать
        </button>
      </div>
    </div>
  );
}
