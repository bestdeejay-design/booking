import { useData } from '../contexts/DataContext';
import ServiceCard from '../components/ServiceCard';

export default function Services() {
  const { services, loading } = useData();

  if (loading) {
    return <div className="flex justify-center py-40"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  const active = services.filter(s => s.active !== false);

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-gold tracking-[.2em] text-sm mb-3 font-medium">УСЛУГИ</p>
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Услуги отеля</h1>
        <p className="text-slate mb-12 max-w-2xl leading-relaxed">
          Мы предлагаем широкий спектр услуг, чтобы сделать ваше пребывание максимально комфортным.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}
