'use strict';
// No analytics, cookies, user registration or payment handling. Only checks a
// PUBLIC repository's latest stable Release to avoid publishing dead links.
const repo = window.SONTRIQA_REPOSITORY || '';
const button = document.getElementById('download');
const status = document.getElementById('release-status');
const setStatusMessage = (message) => {
  if (window.SontriqaI18n?.dynamicText) window.SontriqaI18n.dynamicText('release-status', message);
  else status.textContent = message;
};
setStatusMessage('Стабильный установщик пока не опубликован.');
const releases = document.getElementById('releases');
if (/^[\w.-]+\/[\w.-]+$/.test(repo)) {
  releases.hidden = false;
  releases.href = `https://github.com/${repo}/releases`;
  fetch(`https://api.github.com/repos/${repo}/releases/latest`, {headers: {'Accept':'application/vnd.github+json'}, credentials:'omit'})
    .then(response => {if (!response.ok) throw new Error('Not published'); return response.json();})
    .then(release => {
      const asset = window.SontriqaReleaseValidator?.findStableInstaller(release,repo);
      if (!asset) return;
      button.href = asset.browser_download_url;
      button.textContent = window.SontriqaI18n?.language === 'en' ? 'Download Sontriqa' : 'Скачать Sontriqa';
      button.classList.remove('disabled');
      button.removeAttribute('aria-disabled');
      setStatusMessage(`Актуальная стабильная версия: ${release.tag_name} · ${Math.round(asset.size/1024/1024)} МБ`);
    })
    .catch(() => {setStatusMessage('Скачивание готовится или GitHub временно недоступен. Проверьте историю выпусков.');});
}
document.getElementById('copy-email').addEventListener('click', async () => {
  const label = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText('phKlestov@yandex.ru'); label.textContent = 'Скопировано'; }
  catch { label.textContent = 'Скопируйте адрес вручную'; }
});

window.addEventListener('sontriqa:language', () => {
  if (button?.href) button.textContent = window.SontriqaI18n?.language === 'en' ? 'Download Sontriqa' : 'Скачать Sontriqa';
});
