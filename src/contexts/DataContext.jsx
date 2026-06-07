import { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const DataContext = createContext(null);

const SEED_ROOMS = [
  { name: 'Стандарт одноместный', description: 'Уютный номер с одной кроватью, вид на город', price: 5000, capacity: 1, size: 20, image: '/booking/images/rooms/standard1.jpeg', amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар', 'Душ'] },
  { name: 'Стандарт двухместный', description: 'Просторный номер с двумя кроватями', price: 7000, capacity: 2, size: 25, image: '/booking/images/rooms/standard2.jpg', amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар', 'Ванна'] },
  { name: 'Делюкс', description: 'Улучшенный номер с панорамным видом и балконом', price: 12000, capacity: 2, size: 35, image: '/booking/images/rooms/delux.jpeg', amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар', 'Джакузи', 'Балкон', 'Халаты'] },
  { name: 'Люкс', description: 'Просторный номер с гостиной зоной и джакузи', price: 18000, capacity: 3, size: 50, image: '/booking/images/rooms/lux-jacousi.jpg', amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар', 'Джакузи', 'Гостиная', 'Халаты', 'Кофемашина'] },
  { name: 'Семейный', description: 'Две спальни для комфортного отдыха всей семьёй', price: 15000, capacity: 4, size: 60, image: '/booking/images/rooms/femaly-room4.jpg', amenities: ['Wi-Fi', 'Кондиционер', 'ТВ', 'Мини-бар', 'Ванна', 'Детская кроватка'] },
  { name: 'Президентский люкс', description: 'Максимальный комфорт: две спальни, кабинет, терраса', price: 50000, capacity: 4, size: 120, image: '/booking/images/rooms/pr-lux.jpg', amenities: ['Wi-Fi', 'ТВ', 'Мини-бар', 'Джакузи', 'Сауна', 'Терраса', 'Кабинет'] },
  { name: 'Пентхаус', description: 'Целый этаж с панорамным видом и личным бассейном', price: 80000, capacity: 6, size: 200, image: '/booking/images/rooms/penthause.jpg', amenities: ['Wi-Fi', 'ТВ', 'Бассейн', 'Джакузи', 'Сауна', 'Терраса', 'Лифт'] },
  { name: 'Стандарт мини', description: 'Бюджетный вариант с минимальным набором удобств', price: 3000, capacity: 2, size: 15, image: '/booking/images/rooms/standart-mini.jpg', amenities: ['Wi-Fi', 'ТВ', 'Душ'] },
];

const SEED_SERVICES = [
  { name: 'Спа-центр', description: 'Массаж, сауна, хаммам, косметология', price: 5000, image: '/booking/images/services/spa-hamam_.jpg', active: true },
  { name: 'Ресторан', description: 'Авторская кухня от шеф-повара', price: 3000, image: '/booking/images/services/restoran.jpg', active: true },
  { name: 'Трансфер', description: 'Встреча в аэропорту, аренда авто с водителем', price: 2500, image: '/booking/images/services/transfer.webp', active: true },
  { name: 'Прачечная', description: 'Стирка, глажка и химчистка', price: 1500, image: '/booking/images/services/washing.jpg', active: true },
  { name: 'Фитнес-зал', description: 'Современные тренажёры, групповые занятия', price: 0, image: '/booking/images/services/fitness.jpeg', active: true },
  { name: 'Бассейн', description: 'Открытый и крытый бассейны с подогревом', price: 0, image: '/booking/images/services/bass302.jpeg', active: true },
  { name: 'Конференц-зал', description: 'Зал на 100 человек с проектором', price: 10000, image: '/booking/images/services/conferens.jpg', active: true },
  { name: 'Парковка', description: 'Охраняемая подземная парковка', price: 500, image: '/booking/images/services/parking.jpg', active: true },
  { name: 'Детская комната', description: 'Игровая зона с аниматором', price: 0, image: '/booking/images/services/child-room.jpg', active: true },
];

const DEFAULT_SETTINGS = {
  hotelName: 'Grand Hotel',
  email: 'info@grandhotel.ru',
  phone: '+7 (495) 123-45-67',
  address: 'Пречистенская наб., 15',
  restaurantHours: '07:00–23:00',
  spaHours: '09:00–21:00',
  receptionHours: '24/7',
};

export function DataProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [roomsSnap, servicesSnap, settingsSnap] = await Promise.all([
        getDocs(collection(db, 'rooms')),
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'settings')),
      ]);
      const r = roomsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const s = servicesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const st = settingsSnap.docs[0]?.data() || DEFAULT_SETTINGS;

      if (r.length === 0) {
        await Promise.all(SEED_ROOMS.map(room => addDoc(collection(db, 'rooms'), room)));
        const rs = await getDocs(collection(db, 'rooms'));
        setRooms(rs.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        const oldNames = { 'Эконом': 'Стандарт мини' };
        const updated = [];
        for (const room of r) {
          const seed = SEED_ROOMS.find(s => s.name === room.name);
          const needsRename = oldNames[room.name];
          const seedByName = needsRename ? SEED_ROOMS.find(s => s.name === needsRename) : null;
          const src = needsRename ? seedByName : seed;
          if (src && src.image.startsWith('/') && (!room.image?.startsWith('/') || needsRename)) {
            updated.push({ ...room, image: src.image, name: needsRename || room.name });
            try { await updateDoc(doc(db, 'rooms', room.id), { image: src.image, name: needsRename || room.name }); } catch {}
          } else {
            updated.push(room);
          }
        }
        setRooms(updated);
      }

      if (s.length === 0) {
        await Promise.all(SEED_SERVICES.map(svc => addDoc(collection(db, 'services'), svc)));
        const ss = await getDocs(collection(db, 'services'));
        setServices(ss.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        const updated = [];
        for (const svc of s) {
          const seed = SEED_SERVICES.find(se => se.name === svc.name);
          if (seed && seed.image.startsWith('/') && !svc.image?.startsWith('/')) {
            updated.push({ ...svc, image: seed.image });
            try { await updateDoc(doc(db, 'services', svc.id), { image: seed.image }); } catch {}
          } else {
            updated.push(svc);
          }
        }
        setServices(updated);
      }

      if (settingsSnap.empty) {
        await setDoc(doc(db, 'settings', 'hotel'), DEFAULT_SETTINGS);
      }
      setSettings(st);
    } catch (e) {
      console.error('Firestore load error:', e);
      setRooms(SEED_ROOMS.map((r, i) => ({ ...r, id: String(i + 1) })));
      setServices(SEED_SERVICES.map((s, i) => ({ ...s, id: String(i + 1) })));
      setSettings(DEFAULT_SETTINGS);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const addRoom = async (data) => {
    try {
      const ref = await addDoc(collection(db, 'rooms'), data);
      setRooms(prev => [...prev, { id: ref.id, ...data }]);
    } catch {
      const id = String(Date.now());
      setRooms(prev => [...prev, { id, ...data }]);
    }
  };

  const updateRoom = async (id, data) => {
    try {
      await updateDoc(doc(db, 'rooms', id), data);
      setRooms(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    } catch {
      setRooms(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    }
  };

  const deleteRoom = async (id) => {
    try { await deleteDoc(doc(db, 'rooms', id)); } catch {}
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const addService = async (data) => {
    try {
      const ref = await addDoc(collection(db, 'services'), data);
      setServices(prev => [...prev, { id: ref.id, ...data }]);
    } catch {
      const id = String(Date.now());
      setServices(prev => [...prev, { id, ...data }]);
    }
  };

  const deleteService = async (id) => {
    try { await deleteDoc(doc(db, 'services', id)); } catch {}
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const toggleService = async (id, active) => {
    try { await updateDoc(doc(db, 'services', id), { active }); } catch {}
    setServices(prev => prev.map(s => s.id === id ? { ...s, active } : s));
  };

  const updateSettings = async (data) => {
    try {
      await setDoc(doc(db, 'settings', 'hotel'), data, { merge: true });
      setSettings(prev => ({ ...prev, ...data }));
    } catch {
      setSettings(prev => ({ ...prev, ...data }));
    }
  };

  return (
    <DataContext.Provider value={{
      rooms, services, settings, loading,
      addRoom, updateRoom, deleteRoom,
      addService, deleteService, toggleService,
      updateSettings,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
