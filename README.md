# maeTtI — сайт студии

Next.js 16 со статическим экспортом (`output: "export"`) и PHP-бот для формы заявки (`public/bot/`).

## Разработка

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
```

## Выкладка на хостинг (Apache + PHP)

1. Создать `public/bot/config.php` по образцу `config.example.php`: токен бота, `admin_chat_id`, секреты, `site_url`. Файл в git не попадает, но уходит в сборку.
2. `npm run build` — готовый сайт появится в `out/`.
3. Залить содержимое `out/` в корень сайта, включая скрытый `.htaccess`. Папка `bot/data/` должна быть доступна PHP на запись.
4. После первой выкладки и после смены `hmac_secret` один раз открыть `https://<домен>/bot/setup.php?secret=<setup_secret>` — это привязывает вебхук бота.
5. Проверить: прямая ссылка `/uslugi` открывается, несуществующий адрес отдаёт страницу 404, заявка с `/contacts` приходит в Telegram.

Адрес в `robots.txt` и `sitemap.xml` — `https://maetti.ru`; другой домен задаётся переменной `SITE_URL` при сборке. Редирект на HTTPS в `public/.htaccess` закомментирован: включите его, если хостинг не делает этого сам.

## GitHub Pages

Каждый пуш в `main` собирает копию сайта на GitHub Pages (путь `/meaTtI`). PHP там нет, поэтому форма заявки открывает Telegram с готовым текстом. Копия закрыта от поисковиков (`noindex`).
