# Grand Hotel — Карта связей

## Поток данных (React Context)

```
                     ┌──────────────────────┐
                     │      Firebase        │
                     │  Auth ──── Firestore │
                     └──┬───────┬──────┬────┘
                        │       │      │
        ┌───────────────┘       │      └───────────────┐
        ▼                       ▼                      ▼
  ┌─────────────┐     ┌──────────────┐     ┌────────────────┐
  │ AuthContext │     │  DataContext │     │  Direct reads  │
  │             │     │              │     │  (Rooms,       │
  │ user        │     │ rooms[]      │     │   Dashboard,   │
  │ isAdmin     │     │ services[]   │     │   Admin,       │
  │ loading     │     │ loading      │     │   SetupAdmin)  │
  │ register()  │     │ addRoom()    │     │                │
  │ login()     │     │ updateRoom() │     │ getDocs()      │
  │ logout()    │     │ deleteRoom() │     │ addDoc()       │
  └──────┬──────┘     │ toggleSvc()  │     │ updateDoc()    │
         │            └──────┬───────┘     │ deleteDoc()    │
         │                   │             └───────┬────────┘
         │    ┌──────────────┘                     │
         │    │                                    │
         ▼    ▼                                    ▼
  ┌─────────────────────────────────────────────────────┐
  │                   Components                       │
  │  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
  │  │  Navbar  │  │RoomCard  │  │ ServiceCard   │    │
  │  │useAuth() │  │useCart() │  │ useCart()     │    │
  │  │useCart() │  │          │  │               │    │
  │  └──────────┘  └──────────┘  └───────────────┘    │
  │                                                     │
  │  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
  │  │  Login   │  │ Register │  │ ProtectedRoute│    │
  │  │useAuth() │  │useAuth() │  │ useAuth()     │    │
  │  └──────────┘  └──────────┘  └───────────────┘    │
  └─────────────────────────────────────────────────────┘

  ┌──────────────┐
  │  CartContext │──── localStorage ('booking_cart')
  │  items[]     │
  │  addToCart() │
  │  remove...() │
  │  total       │
  └──────────────┘
```

## Карта страниц и зависимостей

```
Страницы               Контексты          Firestore          Компоненты
─────────────────────────────────────────────────────────────────────────
Home.jsx               (нет)              (нет)             Layout
  │                                                          ├─ Navbar
  ├─ Статичные данные                                       └─ Footer
  └─ Ссылки на /rooms, /services

Rooms.jsx              useData()          bookings (read)   Layout
  │                    useState (local)   rooms (read)       └─ RoomCard × N
  ├─ Дата-пикеры                                             (available, checkIn, checkOut)
  ├─ Фильтры
  └─ Проверка доступности

RoomDetail.jsx         useData()          rooms (read)      Layout
                       useCart()                             └─ Дата-пикеры
                       useParams()

Services.jsx           useData()          services (read)   Layout
                                                             └─ ServiceCard × N

Cart.jsx               useCart()          (нет)             Layout

Payment.jsx            useCart()          bookings (write)  Layout
                       useAuth()           → addDoc

Dashboard.jsx          useAuth()          bookings (read)   Layout
                                          (query by guestId)

Login.jsx              useAuth()          auth (signIn)     Layout

Register.jsx           useAuth()          auth (createUser) Layout
                                          users (write)

Admin.jsx              useData()          rooms (CRUD)      Layout
                       useState (local)   services (update)   └─ 5 вкладок:
                                          bookings (read,      ├─ Шахматка
                                          update status)       ├─ Номера (CRUD)
                                                               ├─ Бронирования
                                                               ├─ Услуги (toggle)
                                                               └─ Настройки (❌ broken)

SetupAdmin.jsx         useAuth()          users/{uid}
                                          (merge role=admin)
```

## Маршруты и защита

```
/                    → Home              (публичный)
/rooms               → Rooms             (публичный)
/rooms/:id           → RoomDetail        (публичный)
/services            → Services          (публичный)
/login               → Login             (публичный)
/register            → Register          (публичный)
/cart                → Cart              (публичный)
/payment             → Payment           → ProtectedRoute
/dashboard           → Dashboard         → ProtectedRoute
/admin               → Admin             → AdminRoute (требуется админ)
/setup-admin         → SetupAdmin        → ProtectedRoute
```

## Граф данных (Data lineage)

```
Seed (DataContext)
  │
  ├──► Firestore: rooms      →  useData()  ──►  Rooms.jsx, RoomDetail.jsx, Admin.jsx
  └──► Firestore: services   →  useData()  ──►  Services.jsx, Admin.jsx

Register / SetupAdmin
  │
  └──► Firestore: users      →  AuthContext  ──►  Navbar, ProtectedRoute, AdminRoute

Payment
  │
  └──► Firestore: bookings   →  Dashboard, Admin, Rooms (проверка доступности)
```

## Компоненты без использования

| Компонент | Причина |
|-----------|---------|
| `BookingForm.jsx` | Нигде не импортирован. Альтернатива — форма в `RoomDetail.jsx` |
| `Loading.jsx` | Нигде не импортирован. Используются инлайн-спиннеры |
