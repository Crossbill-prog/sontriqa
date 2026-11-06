# Sontriqa 1.0.0 — стабильный выпуск / Stable release

## Русский

**Sontriqa 1.0.0** — бесплатная программа для Windows 10/11 x64, позволяющая направлять звук отдельных приложений на несколько устройств вывода одновременно. Маршруты и настройки сохраняются, в том числе после переподключения HDMI; громкость каждого приложения на каждом выходе регулируется отдельно. Темы интерфейса — Carbon Amber и Frost Light. Без подписок, платных функций и ключей активации; поддержка автора добровольная.

**Где скачать:** только официальный GitHub Releases `Crossbill-prog/sontriqa`. Основной установщик: `Sontriqa-Setup-x64.exe`.

**Подлинность и безопасность**
- SHA-256 проверенного установщика: `ebcaa560685f16bc6e12f724e47999ce9cb9989212c7681e4c50d590afeada6b`.
- Обновления защищены цифровой подписью **Tauri Ed25519/minisign**, привязанной к версии `1.0.0`. Файл `latest.json` и `.sig` прилагаются.
- **Windows Authenticode отсутствует намеренно**: сертификат издателя Windows не использован. При запуске возможны предупреждения Microsoft Defender SmartScreen о неизвестном издателе. Не путайте подпись обновлений Tauri с подписью издателя Windows. Проверяйте адрес загрузки и SHA-256, прежде чем решать, доверять ли файлу.
- **Windows 11 Smart App Control** в некоторых конфигурациях может полностью блокировать неподписанное приложение; индивидуального разрешения для него может не быть. Не отключайте защиту системы только ради неподтверждённого файла.
- **Новая подписанная Sontriqa 1.0.0 на исправленном Tauri 2.12.3 уже прошла независимую проверку Ed25519 и SHA-256 и была установлена на Windows:** 5 ноября 2026 года владелец подтвердил «всё работает». Исходная приёмка прежнего EXE с уязвимой Tauri 2.11.1 — историческая и не служит допуском. Отдельное автоматическое обновление RC.18 → 1.0.0 пока не испытано; юридические условия публикации проверяются отдельно.

**Лицензии и исходники**
Основной аудиодвижок AppAudioRouter v2.3.0 — MIT. Полная ведомость сторонних лицензий: `THIRD_PARTY_DEPENDENCIES_GENERATED.txt`.
В Windows-графе присутствуют исходники пяти пакетов MPL-2.0: `cssparser@0.37.0`, `cssparser-macros@0.7.1`, `dtoa-short@0.3.5`, `option-ext@0.2.0`, `selectors@0.38.0`. Все они включены в `SELECTORS_0.38.0_MPL_SOURCE.zip` (историческое имя архива), с текстами MPL и контрольными суммами каждого исходного файла. SHA-256 этого архива: `44a068655cada9bf8746a8a6e853569380c4e4ec2c7b6306e206d1731b83d09b`. Права и порядок получения исходников: `MPL_SOURCE_AVAILABILITY.txt`, [страница исходников](https://github.com/Crossbill-prog/sontriqa/blob/main/site/open-source.html), [Mozilla MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/).

**Обновления:** пользователи RC.18 получат предложение перейти на стабильную 1.0.0 только после отдельного подтверждённого обновления `updates-rc/latest.json`. Старый канал RC не удаляется.

## English

**Sontriqa 1.0.0** is a free Windows 10/11 x64 application for independently routing the audio of each app to multiple output devices. It supports per-app/per-output volume, restores routes after HDMI reconnection, preserves settings, and includes Carbon Amber and Frost Light themes. No subscription, paid tier, license key or functional restriction.

Download only from the official `Crossbill-prog/sontriqa` GitHub Releases page. Installer: `Sontriqa-Setup-x64.exe`.

**Authenticity and security**
- Verified installer SHA-256: `ebcaa560685f16bc6e12f724e47999ce9cb9989212c7681e4c50d590afeada6b`.
- Signed Tauri Ed25519/minisign updates bind the installer to version `1.0.0`; the `latest.json` manifest and `.sig` are provided.
- **No Windows Authenticode publisher signature** by explicit publisher choice. Microsoft Defender SmartScreen may display an unknown-publisher warning. Tauri updater signatures are separate from Windows publisher signatures. Check the download origin and hash before deciding to run the installer.
- On some Windows 11 systems, Smart App Control may block unsigned applications, without a per-app exception. Do not disable system protections solely to run an unverified download.
- **The rebuilt and Tauri Ed25519-signed 1.0.0 installer using patched Tauri 2.12.3 has passed offline signature and SHA-256 verification and was installed on Windows.** The owner confirmed on 5 November 2026 that the program works. The earlier acceptance of the vulnerable 2.11.1-based EXE is historic and not release evidence. Actual RC.18 → 1.0.0 OTA remains untested; legal publication clearance is separate.

**Open-source notices**
The AppAudioRouter v2.3.0 engine is MIT-licensed. See `THIRD_PARTY_DEPENDENCIES_GENERATED.txt` for all dependency licenses. The exact covered source code for `cssparser 0.37.0`, `cssparser-macros 0.7.1`, `dtoa-short 0.3.5`, `option-ext 0.2.0`, and `selectors 0.38.0` is included in `SELECTORS_0.38.0_MPL_SOURCE.zip`, with original file SHA-256 manifests and MPL-2.0 notices. Archive SHA-256: `44a068655cada9bf8746a8a6e853569380c4e4ec2c7b6306e206d1731b83d09b`. See `MPL_SOURCE_AVAILABILITY.txt`, [source availability](https://github.com/Crossbill-prog/sontriqa/blob/main/site/open-source.html) and [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/).

Existing RC.18 installations continue using their RC feed until a separately verified stable-bridge update is published.
