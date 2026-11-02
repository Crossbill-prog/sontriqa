'use strict';
// No analytics, cookies, user registration or payment handling. Only checks a
// PUBLIC repository's latest stable Release to avoid publishing dead links.
const repo = window.SONTRIQA_REPOSITORY || '';
const button = document.getElementById('download');
const status = document.getElementById('release-status');
const releases = document.getElementById('releases');
if (/^[\w.-]+\/[\w.-]+$/.test(repo)) {
  releases.hidden = false;
  releases.href = `https://github.com/${repo}/releases`;
  fetch(`https://api.github.com/repos/${repo}/releases/latest`, {headers: {'Accept':'application/vnd.github+json'}, credentials:'omit'})
    .then(response => {if (!response.ok) throw new Error('Not published'); return response.json();})
    .then(release => {
      if (release.draft || release.prerelease || !/^v?\d+\.\d+\.\d+$/.test(release.tag_name)) return;
      const asset = release.assets?.find(file => file.name === 'Sontriqa-Setup-x64.exe' && file.state === 'uploaded' && file.size > 750_000 && /^https:\/\/github\.com\//.test(file.browser_download_url));
      if (!asset || !release.assets?.some(file => file.name === 'SHA256SUMS.txt') || !release.assets?.some(file => file.name === 'latest.json') || !release.assets?.some(file => file.name === 'Sontriqa-Setup-x64.exe.sig')) return;
      button.href = asset.browser_download_url;
      button.textContent = 'Скачать Sontriqa';
      button.classList.remove('disabled');
      button.removeAttribute('aria-disabled');
      status.textContent = `Актуальная стабильная версия: ${release.tag_name} · ${Math.round(asset.size/1024/1024)} МБ`;
    })
    .catch(() => {status.textContent='Скачивание готовится или GitHub временно недоступен. Проверьте историю выпусков.';});
}
document.getElementById('copy-email').addEventListener('click', async () => {
  const label = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText('phKlestov@yandex.ru'); label.textContent = 'Скопировано'; }
  catch { label.textContent = 'Скопируйте адрес вручную'; }
});
