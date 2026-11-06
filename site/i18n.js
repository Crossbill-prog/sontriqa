'use strict';
// Sontriqa website localization. Russian is the default regardless of OS or browser.
// Only user-facing text is translated; links, prices, legal notices and releases
// are not altered. Preference survives navigation between website pages.
(() => {
  const KEY = 'sontriqa:language:v1';
  const en = {
    'Sontriqa — звук каждому устройству': 'Sontriqa — your audio, your way',
    'Возможности': 'Features',
    'Как работает': 'How it works',
    'Автор': 'Developer',
    'Исходники MPL-2.0': 'MPL-2.0 source code',
    'Вернуться на главную': 'Back to home',
    'Бесплатная программа для Windows': 'Free app for Windows',
    'Твой звук —': 'Your sound —',
    'твои правила': 'your rules',
    'Игра — на саундбар и телевизор одновременно, браузер — в наушники. Выбирай устройства и регулируй громкость каждого выхода отдельно.': 'Play game audio through your soundbar and TV at the same time, and send browser audio to your headphones. Choose your devices and set the volume for each output independently.',
    'Проверяем выпуск': 'Release in testing',
    'Все версии': 'All releases',
    'Стабильный установщик пока не опубликован.': 'The stable installer has not been released yet.',
    'Подробнее': 'Advisory details',
    'Скачивание готовится или GitHub временно недоступен. Проверьте историю выпусков.': 'The download is being prepared or GitHub is temporarily unavailable. Check the release history.',
    'Windows 10/11 · 64-bit · один установщик EXE · без регистрации': 'Windows 10/11 · 64-bit · one EXE installer · no sign-up',
    'МАРШРУТИЗАЦИЯ': 'AUDIO ROUTING',
    'Куда отправлять звук?': 'Where should the audio go?',
    'Источник': 'Source',
    'Саундбар': 'Soundbar',
    'ТВ': 'TV',
    'Наушники': 'Headphones',
    'Игра': 'Game',
    'Плеер': 'Music player',
    'Браузер': 'Browser',
    'Иллюстрация принципа работы · маршруты сохраняются автоматически': 'Illustrative example · routes are saved automatically',
    'Ничего лишнего — только управление звуком': 'Just the audio controls you need',
    'Несколько выходов': 'Multiple outputs',
    'Отправляйте один аудиопоток сразу на несколько подключённых устройств.': 'Send audio from one app to multiple connected devices at once.',
    'Отдельная громкость': 'Independent volume',
    'Настраивайте громкость для каждой пары «приложение — устройство».': 'Set the volume for every app-to-device route independently.',
    'Восстановление': 'Automatic recovery',
    'Выбранные маршруты сохраняются; после возвращения HDMI программа пытается восстановить звук.': 'Saved routes are restored when an HDMI device is reconnected.',
    'Запусти, отметь, слушай': 'Launch, select, listen',
    'Установи': 'Install',
    'Скачай готовый EXE и пройди обычную установку Windows.': 'Download the EXE and follow the standard Windows installer.',
    'Выбери': 'Choose',
    'Поставь галочки у приложений и нужных выходов.': 'Select the devices you want each app to use.',
    'Настрой': 'Adjust',
    'Выставь громкость, а Sontriqa запомнит выбранные маршруты.': 'Adjust the levels; Sontriqa remembers your routes.',
    'Бесплатно — без условий': 'Free, no strings attached',
    'Sontriqa не продаёт лицензии, не требует подписку или активацию. Если программа полезна, можно добровольно поддержать её автора. Перевод не влияет на доступ к функциям.': 'Sontriqa has no paid licenses, subscriptions or activation keys. If you find it useful, you can support its developer with an optional donation. Donations never unlock extra features.',
    'Сделать добровольный перевод': 'Support the developer',
    'Связь с автором': 'Contact the developer',
    'Идеи, предложения и сообщения об ошибках:': 'Ideas, feedback and bug reports:',
    '© Sontriqa · Бесплатное программное обеспечение': '© Sontriqa · Free software',
    'Конфиденциальность': 'Privacy',
    'Лицензия исходного движка (MIT)': 'Audio engine license (MIT)',
    'Конфиденциальность — Sontriqa': 'Privacy — Sontriqa',
    'Sontriqa — бесплатная Windows-программа. В ней нет обязательной регистрации или серверного аккаунта. Настройки маршрутов и громкости сохраняются локально на компьютере пользователя; автоматически автору они не передаются.': 'Sontriqa is a free Windows app. It does not require registration or a server account. Your audio routes and volume settings are stored locally on your computer and are not automatically sent to the developer.',
    'На странице скачивания не установлены собственные аналитические счётчики и cookies. Для сохранения выбора языка сайт использует локальное хранилище браузера (localStorage). Эта настройка не предназначена для рекламы или отслеживания пользователей. Основной сайт размещён на Cloudflare Pages по адресу https://sontriqa.pages.dev; прежняя страница остаётся на GitHub Pages. Соответствующий хостинг-провайдер может получать технические данные запросов, включая IP-адрес, согласно своим условиям. Проверка наличия стабильной версии обращается к публичному GitHub API. Страница добровольного перевода открывается отдельно на стороне Т-Банка и обрабатывается по правилам банка.': 'The download website does not use its own analytics or cookies. It saves your language preference in your browser’s local storage (localStorage), which is not intended for advertising or user tracking. The main website is hosted on Cloudflare Pages at https://sontriqa.pages.dev, while the previous page remains on GitHub Pages. The hosting provider may process technical request data, including IP addresses, under its own policies. The site checks the public GitHub API for a stable release. Optional donations open a separate T-Bank page and are processed under the bank’s policies.',
    "При запуске подписанной Sontriqa программа проверяет наличие обновлений через GitHub, если с предыдущей успешной проверки прошло примерно 24 часа, а также по нажатию кнопки «Обновления». GitHub может получить технические данные запроса, включая IP-адрес. Локально сохранённые маршруты звука, громкость и журнал ошибок не отправляются в запросе проверки. Скачивание и установка обновления требуют отдельного подтверждения пользователя.": "In signed Sontriqa builds, the app checks GitHub for updates at startup when approximately 24 hours have passed since the last successful check, or when you click Updates. GitHub may receive technical request data, including your IP address. Saved audio routes, volume preferences and diagnostic logs are not included in update checks. Downloading and installing an update requires your explicit confirmation.",
    'Связь с автором:': 'Developer contact:',
    '. При добровольном отправлении письма адрес отправителя и текст сообщения попадают в почтовый сервис, чтобы автор мог прочитать обращение и ответить. Не отправляйте пароли, данные платёжных карт и другие лишние сведения. Для вопроса об удалении переписки напишите на тот же адрес.': '. If you choose to send an email, your address and message are processed by email providers so the developer can read and reply. Do not send passwords, payment-card details or unnecessary personal information. To request deletion of correspondence, email the same address.',
    'Это описание относится к странице загрузки и приложению Sontriqa, не заменяет условия сторонних сервисов и не обещает отсутствия технических логов у хостинг-провайдера.': 'This notice applies to the Sontriqa download website and app. It does not replace third-party terms or guarantee that the hosting provider collects no technical logs.',
    'Вернуться на главную': 'Back to home',
    'Язык интерфейса': 'Website language',
    'Sontriqa, главная': 'Sontriqa, home',
    'Основная навигация': 'Main navigation',
    'Пример таблицы Sontriqa: разные приложения и выбранные аудиовыходы': 'Example Sontriqa routing table with apps and output devices',
    'Скопировать адрес электронной почты': 'Copy email address',
    'Копировать адрес': 'Copy address',
    'Sontriqa — бесплатная программа для Windows: направляйте звук каждого приложения на колонки, телевизор и наушники с независимой громкостью.': 'Sontriqa is a free Windows app for routing each app to speakers, a TV and headphones with independent volume control.',
    'Скопировано': 'Copied',
    'Скопируйте адрес вручную': 'Please copy the address manually'
  };
  const getSaved = () => {
    try { return localStorage.getItem(KEY) === 'en' ? 'en' : 'ru'; }
    catch { return 'ru'; }
  };
  let lang = getSaved();
  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  const dynamic = new Map();
  const translate = (ru) => {
    if (lang !== 'en') return ru;
    const known = en[ru];
    if (known) return known;
    const stable = /^Актуальная стабильная версия: (.+) · (\d+) МБ$/.exec(ru);
    if (stable) return `Latest stable release: ${stable[1]} · ${stable[2]} MB`;
    return ru;
  };
  function refresh() {
    document.documentElement.lang = lang;
    document.querySelectorAll('.site-lang button[data-lang]').forEach(button => {
      const selected = button.dataset.lang === lang;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script, style, .site-lang, [data-i18n-dynamic]')) continue;
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const original = originalText.get(node);
      const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(original);
      if (match) node.nodeValue = match[1] + translate(match[2]) + match[3];
    }
    document.querySelectorAll('[aria-label], [title], [placeholder], [alt], meta[content]').forEach(el => {
      if (!originalAttrs.has(el)) {
        const original = {};
        for (const attr of ['aria-label', 'title', 'placeholder', 'alt', 'content']) {
          if (el.hasAttribute(attr)) original[attr] = el.getAttribute(attr);
        }
        originalAttrs.set(el, original);
      }
      for (const [attr, value] of Object.entries(originalAttrs.get(el))) {
        el.setAttribute(attr, translate(value));
      }
    });
    for (const [element, original] of dynamic) {
      if (element.isConnected) element.textContent = translate(original);
      else dynamic.delete(element);
    }
  }
  function setLanguage(value) {
    if (value !== 'en' && value !== 'ru') return;
    lang = value;
    try { localStorage.setItem(KEY, value); } catch { /* private browser mode */ }
    refresh();
    window.dispatchEvent(new CustomEvent('sontriqa:language', { detail: { language: value } }));
  }
  function dynamicText(id, russian) {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('data-i18n-dynamic', '');
    dynamic.set(el, russian);
    el.textContent = translate(russian);
  }
  window.SontriqaI18n = { get language() { return lang; }, setLanguage, translate, dynamicText };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true });
  else refresh();
  document.addEventListener('click', event => {
    const button = event.target.closest('.site-lang button[data-lang]');
    if (button) setLanguage(button.dataset.lang);
  });
})();
