import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('booking_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('booking_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id && i.type === item.type);
      if (exists) {
        return prev.map(i => i.id === item.id && i.type === item.type
          ? { ...i, quantity: i.quantity + 1 }
          : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id, type) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.type === type)));
  };

  const updateQuantity = (id, type, qty) => {
    if (qty <= 0) {
      removeFromCart(id, type);
      return;
    }
    setItems(prev => prev.map(i => i.id === id && i.type === type
      ? { ...i, quantity: qty }
      : i
    ));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
