# План реализации — Статус: ✅ ЗАВЕРШЁН

> Дата: 04.06.2026 | Выполнено: 9/9 задач + 2 улучшения

## 1. Настройки отеля — сохранение и применение ✅

- `DataContext.jsx`: `settings` состояние, `updateSettings()`, сид `settings/hotel`
- `Admin.jsx`: контролируемые поля (value + onChange), кнопка «Сохранить» → Firestore
- `Footer.jsx`: читает адрес, телефон, email, часы работы из `settings`
- `Home.jsx`: хиро-заголовок из `settings.hotelName` (два цвета)
- `Navbar.jsx`: логотип из `settings.hotelName` (два цвета)

## 2. Редактирование amenities номеров ✅

- Поле «Удобства (через запятую)» в форме номера
- При сохранении: split → trim → filter
- При редактировании: join(', ')

## 3. CRUD для услуг ✅

- `DataContext.jsx`: `addService()`, `deleteService()`
- `Admin.jsx`: форма добавления/редактирования услуги, кнопки ✏️ 🗑️

## 4. Проверка доступности на RoomDetail ✅

- Загрузка бронирований при изменении дат
- Бейдж «Свободен/Занят»
- Кнопка блокируется при занятости

## 5. Синхронизация цен на главной ✅

- `Home.jsx`: `useData().rooms` вместо хардкода
- Цены всегда актуальны из Firestore

## 6. Мобильное меню — React-state ✅

- `useState(menuOpen)` вместо `classList.toggle('hidden')`
- Закрывается при клике на ссылку

## 7. Футер — `<Link>` ✅

- Все `<a href>` заменены на `<Link to>`

## 8. Удаление BookingForm.jsx ✅

- Файл удалён

## 9. Loading в роутах ✅

- `ProtectedRoute.jsx` → `<Loading />`
- `AdminRoute.jsx` → `<Loading />`

---

## Дополнительные улучшения (сверх плана)

| # | Что сделано |
|---|------------|
| 10 | Двухцветное название отеля (первое слово золотое, остальное белое) — Navbar, Home, Footer |
| 11 | Даты по умолчанию: заезд = сегодня, выезд = завтра — Rooms, RoomDetail |
| 12 | Тестовые данные карты предзаполнены в форме оплаты |

---

## Актуальное дерево файлов

```
src/
├── config/firebase.js          — Firebase инициализация
├── contexts/
│   ├── AuthContext.jsx          — Аутентификация (users r/w)
│   ├── CartContext.jsx          — Корзина (localStorage)
│   └── DataContext.jsx          — Данные (rooms, services, settings CRUD)
├── components/
│   ├── Layout.jsx               — Обёртка Navbar + Outlet + Footer
│   ├── Navbar.jsx               — Навигация (settings.hotelName, React-state меню)
│   ├── Footer.jsx               — Футер (settings, Link)
│   ├── ProtectedRoute.jsx       — Защита авторизации (+ Loading)
│   ├── AdminRoute.jsx           — Защита админа (+ Loading)
│   ├── Loading.jsx              — Спиннер
│   ├── RoomCard.jsx             — Карточка номера (доступность, даты)
│   └── ServiceCard.jsx          — Карточка услуги
└── pages/
    ├── Home.jsx                 — Главная (rooms из БД, settings.hotelName)
    ├── Rooms.jsx                — Список номеров (даты, фильтры, доступность)
    ├── RoomDetail.jsx           — Детали номера (доступность, amenities)
    ├── Services.jsx             — Услуги
    ├── Login.jsx                — Вход
    ├── Register.jsx             — Регистрация
    ├── Dashboard.jsx            — Личный кабинет (брони из Firestore)
    ├── Cart.jsx                 — Корзина
    ├── Payment.jsx              — Оплата (сохраняет в bookings)
    ├── Admin.jsx                — Админ (5 вкладок: шахматка, номера, брони, услуги, настройки)
    └── SetupAdmin.jsx           — Выдача прав админа
```

## Firestore коллекции (актуально)

| Коллекция | Назначение | CRUD |
|-----------|-----------|------|
| `users/{uid}` | Пользователи (роль) | R (AuthContext), W (Register, SetupAdmin) |
| `rooms/{id}` | Номера (8 seed) | R (DataContext, сайт), W (Admin CRUD) |
| `services/{id}` | Услуги (9 seed) | R (DataContext, сайт), W (Admin CRUD) |
| `bookings/{id}` | Бронирования | R (Dashboard, Admin, Rooms), W (Payment, Admin статус) |
| `settings/hotel` | Настройки отеля | R (все компоненты), W (Admin → Настройки) |
