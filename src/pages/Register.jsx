import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      toast.success('Регистрация успешна!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Ошибка регистрации');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-cream">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-gold tracking-[.2em] text-sm font-medium">ПРИСОЕДИНЯЙТЕСЬ</p>
          <h1 className="font-serif text-4xl text-charcoal mt-2">Регистрация</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Имя</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} required
                placeholder="Иван Петров"
                className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-charcoal focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="user@example.com"
                className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-charcoal focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Пароль</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Минимум 6 символов"
                className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-charcoal focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-charcoal text-white py-3.5 rounded-full font-medium hover:bg-gold hover:text-charcoal transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate text-sm">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-gold hover:text-gold-dark font-medium">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
