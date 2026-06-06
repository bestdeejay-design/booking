import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('С возвращением!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Ошибка входа');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-cream">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-gold tracking-[.2em] text-sm font-medium">ДОБРО ПОЖАЛОВАТЬ</p>
          <h1 className="font-serif text-4xl text-charcoal mt-2">Вход</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="••••••••"
                className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-charcoal focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-charcoal text-white py-3.5 rounded-full font-medium hover:bg-gold hover:text-charcoal transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate text-sm">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-gold hover:text-gold-dark font-medium">Регистрация</Link>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-slate text-center">
            <p className="font-medium text-charcoal mb-1">Демо-доступ:</p>
            <p>user@demo.com / admin@demo.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
