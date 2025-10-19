# URBAN Beauty - Салон за красота

Кросплатформено мобилно приложение за Android и iOS за управление на резервации и комуникация между салон за маникюр и клиенти.

## 🎨 Визия

- **Дизайн**: Мраморен елегантен стил с преливащи сиви, черни и бели тонове
- **Цветова палитра**: Монохроматична - черно (#1A1A1A), сиво (#6B6B6B), бяло (#FFFFFF)
- **Градиенти**: Мраморни преливания имитиращи естествен мрамор
- **UX**: Мекки сенки, закръглени форми, флуидни анимации и женствено елегантен усет
- **Стил**: Луксозен, минималистичен, софистициран с висококачествен мраморен ефект
- **Усещане**: Premium бутик за красота с монохроматична елегантност
- **Брандинг**: Екран за добре дошли "Добре дошли в салон за красота URBAN"

## 🔐 Роли и достъп

### Администратор
- **Имейл**: gergananoneva@gmail.com
- **Функционалност**:
  - **График**: Преглед на резервации, създаване/редакция, уведомяване за свободни часове
  - **Снимки**: Качване на снимки с описание, автоматично уведомяване на клиенти
  - **Социални мрежи**: Бутони за Facebook, Instagram и TikTok
  - **Ценоразпис**: Управление на услуги, цени и продължителност

### Клиент
- **Функционалност**:
  - **Заяви час**: Избор на свободни часове, текстово съобщение, чат с администратора
  - **Галерия**: Преглед на снимки със свайп (наляво/надясно), лайкове/дизлайкове
  - **Ценоразпис**: Преглед на услуги и цени, бързо заявяване на час

## 🚀 Технологии

- **Framework**: React Native с Expo
- **Routing**: Expo Router (file-based routing)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email/password + Google + Facebook OAuth)
- **UI**: React Native + Linear Gradient
- **Icons**: Lucide React Native
- **Animations**: React Native Animated API

## 📦 Инсталация

1. Клонирайте проекта:
```bash
git clone <repository-url>
cd project
```

2. Инсталирайте dependencies:
```bash
npm install
```

3. Конфигурация на Supabase:
Файлът `.env` вече съдържа необходимите настройки за Supabase:
```
EXPO_PUBLIC_SUPABASE_URL=https://wbkkchcgnehauypaysen.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## 🗄️ База данни

Базата данни вече е създадена и конфигурирана с следните таблици:

- **profiles**: Потребителски профили (admin/client)
- **services**: Услуги, цени и продължителност
- **appointments**: Резервации и заявки
- **gallery_photos**: Снимки от салона
- **photo_reactions**: Лайкове/дизлайкове на снимки
- **chat_messages**: Съобщения между клиенти и администратор
- **notifications**: Push уведомления

### Примерни услуги (вече добавени):
- Маникюр класик - 60 мин - 45 лв
- Гел лак - 90 мин - 65 лв
- Ноктопластика - 120 мин - 120 лв
- Педикюр - 75 мин - 50 лв
- Гел лак педикюр - 105 мин - 70 лв

## 🏃 Стартиране на приложението

### Web платформа (за разработка):
```bash
npm run dev
```

### Build за production:
```bash
npm run build:web
```

### Мобилни платформи:
За тестване на iOS/Android е необходимо:
1. Инсталиране на Expo Go от App Store/Google Play
2. Стартиране на `npm run dev`
3. Сканиране на QR кода с Expo Go

## 👥 Тестови акаунти

### Администратор:
- **Email**: gergananoneva@gmail.com
- **Парола**: (създайте при първо влизане чрез регистрация или OAuth)
- **Забележка**: Ако влезете с този имейл през Google/Facebook OAuth, ще получите администраторски достъп

### Клиент:
- Всеки друг имейл автоматично получава роля "client"
- Може да влезете с имейл/парола или през Google/Facebook

## 🔐 OAuth Authentication

Приложението поддържа три метода за вход:

1. **Имейл и парола** - Традиционна регистрация
2. **Google OAuth** - Вход с Google акаунт
3. **Facebook OAuth** - Вход с Facebook акаунт

### Настройка на OAuth

За да активирате Google и Facebook вход, следвайте инструкциите в [OAUTH_SETUP.md](./OAUTH_SETUP.md)

**Кратки стъпки:**
1. Създайте OAuth приложения в Google Cloud Console и Facebook Developers
2. Конфигурирайте redirect URLs
3. Добавете Client ID и Secret в Supabase Dashboard
4. Готово! OAuth вход ще работи автоматично

## 📱 Структура на приложението

```
app/
├── index.tsx                 # Welcome screen
├── auth/
│   ├── login.tsx            # Вход
│   └── register.tsx         # Регистрация
├── (admin)/                 # Администраторски панел
│   ├── _layout.tsx          # Tab navigation
│   ├── schedule.tsx         # График
│   ├── gallery.tsx          # Управление на снимки
│   ├── social.tsx           # Социални мрежи
│   └── pricing.tsx          # Ценоразпис
└── (client)/                # Клиентски интерфейс
    ├── _layout.tsx          # Tab navigation
    ├── booking.tsx          # Заявка за час
    ├── gallery.tsx          # Галерия със swipe
    └── pricing.tsx          # Преглед на цени
```

## 🎨 Дизайн система

За пълно описание вижте [DESIGN_GUIDE.md](./DESIGN_GUIDE.md)

### Цветове:
- **Primary**: #1A1A1A (дълбоко черно)
- **Secondary**: #6B6B6B (средно сиво)
- **Accent**: #B8B8B8 (светло сиво)
- **Background**: #F5F5F5 (светъл мрамор)
- **Surface**: #FFFFFF (чисто бяло)
- **Marble**: #F8F8F8 (мраморно бяло)

### Градиенти:
- **Marble**: #FFFFFF → #F8F8F8 → #F0F0F0 → #E8E8E8 (бял мрамор)
- **Marble Dark**: #E8E8E8 → #D0D0D0 → #B8B8B8 (тъмен мрамор)
- **Feminine**: #FAFAFA → #F5F5F5 → #EEEEEE → #E8E8E8 (нежни преливания)
- **Pearl**: #FFFFFF → #FCFCFC → #F8F8F8 (перлен блясък)
- **Smoke**: #FAFAFA → #F2F2F2 → #EEEEEE (димчат ефект)
- **Elegant**: #1A1A1A → #2A2A2A → #3A3A3A (черен шифер)

### Типография:
- **Sizes**: 11px - 48px (8 нива)
- **Weights**: Light (300) - Extrabold (800)
- **Letter Spacing**: Tight до Widest
- **Line Height**: 1.5-1.6 за body text

### Spacing:
- **8px Grid System**: 4px - 64px
- **Border Radius**: 8px - 40px + full (по-закръглени за женствен вид)
- **Shadows**: 6 нива (none до xl) + special marble (мекки, дифузирани)

## 🔔 Уведомления

Системата поддържа следните типове уведомления:
- **free_slot**: Свободен час в графика
- **new_photo**: Нова снимка в галерията
- **booking_confirmed**: Потвърдена резервация
- **booking_cancelled**: Отказана резервация
- **new_message**: Нов чат съобщение

## 🛡️ Сигурност

- Row Level Security (RLS) активирана на всички таблици
- Ролева базирана автентикация
- Администраторски достъп само за gergananoneva@gmail.com
- Клиентите виждат само собствените си данни

## 📝 Бележки

- Приложението е оптимизирано за Web платформа
- За production deploy на iOS/Android е необходим Expo Development Build
- Push уведомленията работят на физически устройства (не в simulator/emulator)
- За upload на снимки се използват URL адреси (integration с cloud storage по избор)

## 🤝 Поддръжка

За въпроси относно приложението или техническа поддръжка, моля свържете се с разработчика.

---

**URBAN Beauty** - Вашият дигитален партньор за красота
