# Grand Hotel — Модель данных (Firestore)

## Коллекция `users`
**Путь:** `/users/{uid}` — ID = Firebase Auth UID

| Поле | Тип | Описание | Кто пишет |
|------|-----|----------|-----------|
| `name` | string | Имя пользователя | AuthContext.register(), SetupAdmin |
| `email` | string | Email | AuthContext.register(), SetupAdmin |
| `role` | `'user'` \| `'admin'` | Роль | AuthContext.register() → `'user'`, SetupAdmin → `'admin'` |
| `createdAt` | ISO string | Дата создания | AuthContext.register(), SetupAdmin |

---

## Коллекция `rooms`
**Путь:** `/rooms/{autoId}` — ID = авто-генерируемый Firestore

| Поле | Тип | Пример | Кто пишет |
|------|-----|--------|-----------|
| `name` | string | `"Делюкс"` | DataContext (seed + addRoom + updateRoom) |
| `description` | string | `"Улучшенный номер..."` | DataContext (seed + addRoom + updateRoom) |
| `price` | number | `12000` | DataContext (seed + addRoom + updateRoom) |
| `capacity` | number | `2` | DataContext (seed + addRoom + updateRoom) |
| `size` | number | `35` (м²) | DataContext (seed + addRoom + updateRoom) |
| `image` | string | `"🌅"` (эмодзи) | DataContext (seed + addRoom + updateRoom) |
| `amenities` | string[] | `["Wi-Fi", "ТВ", "Душ"]` | DataContext (только seed) ⚠️ НЕ редактируется в админке |

---

## Коллекция `services`
**Путь:** `/services/{autoId}` — ID = авто-генерируемый Firestore

| Поле | Тип | Пример | Кто пишет |
|------|-----|--------|-----------|
| `name` | string | `"Спа-центр"` | DataContext (только seed) ⚠️ Нет CRUD |
| `description` | string | `"Массаж, сауна..."` | DataContext (только seed) |
| `price` | number | `5000` (0 = бесплатно) | DataContext (только seed) |
| `image` | string | `"💆"` (эмодзи) | DataContext (только seed) |
| `active` | boolean | `true` | DataContext (seed), Admin.toggleService |

---

## Коллекция `bookings`
**Путь:** `/bookings/{autoId}` — ID = авто-генерируемый Firestore

| Поле | Тип | Пример | Кто пишет |
|------|-----|--------|-----------|
| `guest` | string | `"Иван Петров"` | Payment |
| `guestEmail` | string | `"ivan@mail.ru"` | Payment |
| `guestId` | string | Firebase Auth UID | Payment |
| `type` | `'room'` \| `'service'` | `"room"` | Payment |
| `name` | string | `"Делюкс"` | Payment |
| `roomId` | string | Firestore doc ID номера | Payment (⚠️ поле называется `roomId` но содержит ID и для услуг) |
| `price` | number | `12000` | Payment |
| `quantity` | number | `1` | Payment |
| `total` | number | `12000` (price × quantity) | Payment |
| `checkIn` | string \| null | `"2026-06-15"` | Payment (только для `type: 'room'`) |
| `checkOut` | string \| null | `"2026-06-18"` | Payment (только для `type: 'room'`) |
| `nights` | number \| null | `3` | Payment (только для `type: 'room'`) |
| `status` | `'pending'` \| `'confirmed'` \| `'cancelled'` | `"pending"` | Payment → `'pending'`, Admin → меняет |
| `createdAt` | ISO string | `"2026-06-04T15:30:00Z"` | Payment |

---

## Коллекция `settings`
**Путь:** `/settings/hotel` — единственный документ

| Поле | Тип | Пример | Кто пишет |
|------|-----|--------|-----------|
| `hotelName` | string | `"Grand Hotel"` | Admin → Настройки |
| `email` | string | `"info@grandhotel.ru"` | Admin → Настройки |
| `phone` | string | `"+7 (495) 123-45-67"` | Admin → Настройки |
| `address` | string | `"Пречистенская наб., 15"` | Admin → Настройки |
| `receptionHours` | string | `"24/7"` | Admin → Настройки |
| `restaurantHours` | string | `"07:00–23:00"` | Admin → Настройки |
| `spaHours` | string | `"09:00–21:00"` | Admin → Настройки |

**Используется в:** Navbar (hotelName), Footer (все поля), Home (hotelName)

---

## Индексы (потенциально нужны)

| Коллекция | Поля | Для чего |
|-----------|------|----------|
| `bookings` | `guestId` | Запрос броней пользователя (Dashboard) |
| `bookings` | `roomId` + `status` + `checkIn` + `checkOut` | Проверка доступности (Rooms, Шахматка) |

---

## Связи между коллекциями

```
users (Firebase Auth UID)
  │
  ├─► bookings.guestId ────── пользователь создал бронь
  │
  └─► users/{uid}.role ────── определяет доступ к админке

rooms (Firestore autoId)
  │
  └─► bookings.roomId ─────── номер забронирован
        (только для type: 'room')

services (Firestore autoId)
  │
  └─► bookings.roomId ─────── услуга заказана
        (⚠️ хранится в том же поле roomId)

settings/hotel
  │
  └─► Navbar, Footer, Home ──── название, контакты, часы работы
```
