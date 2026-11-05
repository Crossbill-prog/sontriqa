# Sontriqa — размещение сайта на Cloudflare Pages

**Состояние 6 ноября 2026:** владелец подключил Cloudflare Pages к публичному `Crossbill-prog/sontriqa` через GitHub и предоставил скриншот **успешного первого развёртывания**. Cloudflare указал новый адрес: **https://sontriqa.pages.dev**. Проверка фактического HTML-содержимого на новом URL в этом сеансе пока не удалась; приёмка страницы в браузере — отдельный пункт. Прежняя GitHub Pages-публикация не удалена.

## Одноразовое подключение владельцем

1. Открыть [Cloudflare Dashboard — Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) и войти в Cloudflare (если аккаунта нет — зарегистрировать бесплатный). Для бесплатного статического сайта платный тариф не требуется.
2. Нажать **Create application / Create** → вкладка **Pages** → **Import an existing Git repository** / **Connect to Git**. Важно: выбрать именно **Pages с Git-интеграцией**, а не Direct Upload и не Workers.
3. Если Cloudflare запросит доступ к GitHub, выбрать аккаунт **Crossbill-prog** и предоставить приложению Cloudflare Pages доступ **только к репозиторию `sontriqa`** (а не ко всем репозиториям и особенно не к `sontriqa-private`). При необходимости на стороне GitHub выбрать **Only select repositories** → `Crossbill-prog/sontriqa`.
4. Настройки проекта:
   - **Project name:** `sontriqa` (если свободно; иначе любое короткое имя — Cloudflare сам покажет фактический адрес `*.pages.dev`).
   - **Framework preset:** `None` / `No framework`.
   - **Production branch:** `main`.
   - **Root directory / Build system root:** корень репозитория (оставить пустым).
   - **Build command:** `node scripts/build-cloudflare-pages.mjs`.
   - **Build output directory:** `site` (без начального слэша).
   - **Environment variable:** `NODE_VERSION=22` (необязательно, но для повторяемости желательно).
   - **Секреты и API-ключи:** не нужны, ничего не добавлять.
5. Нажать **Save and Deploy / Deploy site**. Дождаться **Success**, открыть выданный Cloudflare URL, проверить главную, переключение RU/EN, Privacy и MPL Source.
6. **Проверить, что стабильную Sontriqa 1.0.0 скачать нельзя.** Сообщение о закрытом выпуске должно отображаться; старую RC.18 не предлагать как стабильную.
7. Прислать адрес `*.pages.dev` или скриншот статуса **Success**. После этого можно документально подтвердить новый публичный адрес.

## Что уже подготовлено в GitHub

- `scripts/build-cloudflare-pages.mjs` генерирует `site/config.js`, запускает все три теста сайта и проверяет, что `releaseHold=true` и нет секретов в папке публикации.
- `02 — Validate official Sontriqa site (no deployment)` выполняет **точно такую же** команду в GitHub Actions, не используя Cloudflare токены.
- `03 — Deploy official download page (GitHub Pages)` сохранён для ручного использования **без автоматического запуска при push**. Это устраняет повторные попытки зависшего развёртывания и не удаляет ранее опубликованный сайт GitHub.
- Новый сайт не меняет GitHub Releases: установщики остаются в `Crossbill-prog/sontriqa/releases`, а обновления старых клиентов читают `updates-rc`.
- Все 11 хешей проверенного релиза фиксированы в `site/release-validator.js`, но **юридический блок выпуска остаётся включённым**.
- В настройках Cloudflare можно настроить custom domain позднее. Перенос домена не нужен для первой проверки.

## Если Cloudflare выдал ошибку

- **Repository not found**: проверьте права приложения Cloudflare Pages на выбранный публичный репозиторий и правильность `Crossbill-prog/sontriqa`.
- **Build failed**: откройте Workers & Pages → Sontriqa → Deployments → View details → Build log. Тесты запускаются без npm install, нужен только Node.js 22.
- **404 / missing index**: Output directory должна быть `site`, а не `/` и не `public`.
- **Download недоступен**: это намеренно. `releaseHold=true` блокирует стабильный релиз до отдельного юридического допуска.
- **GitHub Pages продолжает показывать старое содержимое**: это другой, исторический адрес. Главным станет адрес `*.pages.dev` после его фактической проверки.

**Ограничение:** сам факт размещения сайта на Cloudflare не является юридическим разрешением на публичную раздачу стабильного EXE. Проверка 152-ФЗ, MPL и товарного знака Sontriqa сохраняется отдельной.
