# Lyaguh Template

Шаблон моих проектов для быстрого создания

Установленные библиотеки :
- React + TS
- MantineUI
- ReactRouter
- TablerIcons (Первая загрузка может быть долгим из-за этой библиотеки, если вы сталкиваетесь с проблемой производительности можете попробовать заменить ее на похожие, по типу ReactIcons)

Создана архитектура FSD, настроен роутинг

Архитектура:
```text
Lyaguh Template/
├── public	Изображения и стороннние иконки
│   ├── icons 
│   ├── img
│
├── src
│   ├── app	Входная точка приложения и общие настройки
│   │   ├── providers	Глобальные стили и роуты
│   │   │   ├── index.css
│   │   │   └── Router.tsx
│   │   ├── App.tsx
│   │   ├── helpers.js
│   │   ├── main.tsx
│   │   ├── theme.ts
│   │   └── vite-env.d.ts
│   │
│   ├── entities	Бизнес сущности(интерфейсы, хранилища, хуки)
│   │
│   ├── pages	Страницы веб-приложения
│   │   ├── About
│   │   ├── Errors
│   │   └── Main
│   │
│   ├── layouts	Макеты
│   │   └── MainLayout
│   │
│   ├── features	Пользовательские фичи
│   ├── shared	Переиспользуемые UI компоненты
│   └── widgets	Переиспользуемые UI блоки
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── README.md
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── yarn.lock```

Как я использую FSD:
/app - Корневые файлы (app, main...)
/entities - Бизнес сущности (интерфейсы, хранилища, хуки, типы...)
/layouts - Макеты приложения (Main, Register...)
/pages - Страницы в которых используются фичи
/features - Фичи которыми полльзуется пользователь (Оставление лайка, регистрация и.тд)
/shared - Переиспользуемые UI компоненты (Кнопки, инпуты...)
/widgets - Переиспользуемые UI блоки (Header, Navbar...)

Каждый слой делится на слайсы, они в свою очередь на сегменты.