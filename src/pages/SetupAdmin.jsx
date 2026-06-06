import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function SetupAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    (async () => {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || user.email,
        email: user.email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      }, { merge: true });
      setDone(true);
    })();
  }, [user, navigate]);

  const handleReLogin = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-cream">
      <div className="text-center">
        {done ? (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="font-serif text-3xl text-charcoal mb-2">Вы стали администратором</h1>
            <p className="text-slate mb-6">Войдите заново для применения прав</p>
            <button
              onClick={handleReLogin}
              className="bg-charcoal text-white px-6 py-3 rounded-full font-medium hover:bg-gold hover:text-charcoal transition-all"
            >
              Выйти и войти заново
            </button>
          </>
        ) : (
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        )}
      </div>
    </div>
  );
}
