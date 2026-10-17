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
          <p className="eyebrow">ДОБРО ПОЖАЛОВАТЬ</p>
          <h1 className="display-2 text-charcoal mt-2">Вход</h1>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="user@example.com"
                className="field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">Пароль</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="field"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="btn btn-dark w-full mt-2 py-3.5"
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
