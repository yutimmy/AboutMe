// ==========================================
// 膽小狗英雄風格 - 個人網站主程式
// 功能：頁面切換、Markdown 載入（marked.js）、互動邏輯
// ==========================================

// 全局文章存儲
const articlesStore = {
  ctf: {},
  zeroday: {},
  reading: {},
  class: {}
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('🐶 膽小狗個人網站載入中...');

  // 設定 marked.js（安全模式）
  if (typeof marked !== 'undefined') {
    marked.use({
      breaks: true,
      gfm: true
    });
  }

  initNavigation();
  loadArticles('ctf',     'ctf-list',     '📖 閱讀詳細');
  loadArticles('zeroday', 'zeroday-list',  '🔍 查看詳情');
  loadArticles('reading', 'reading-list',  '📚 閱讀心得');
  loadArticles('class',   'class-list',    '📝 查看筆記');
  initArticleButtons();
  fetchVulnerabilityCount();
  showPage('home');
});

// ==========================================
// 導航功能
// ==========================================

function initNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const hamburgerBtn = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');

  // 漢堡菜單開關
  hamburgerBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // 導航連結點擊
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showPage(this.getAttribute('data-page'));
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      // 關閉漢堡菜單
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // 點擊外部關閉
  document.addEventListener('click', function(e) {
    if (!e.target.closest('nav')) {
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// 頁面切換
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
}

// ==========================================
// Markdown 轉換 (使用 marked.js CDN)
// ==========================================

function renderMarkdown(md) {
  if (!md) return '';
  if (typeof marked !== 'undefined') {
    return marked.parse(md);
  }
  // fallback：基本轉換
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

// ==========================================
// HTML 逃逸（用於卡片渲染，非 Markdown）
// ==========================================

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ==========================================
// 統一卡片渲染
// ==========================================

function renderCard(article, type, buttonText) {
  const typeClass = article.type
    ? article.type.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : 'default';

  const metaHtml = (type === 'reading' && (article.author || article.readTime))
    ? `<p class="article-meta">
         ${article.author ? escapeHtml(article.author) : ''} • ${article.readTime ? escapeHtml(article.readTime) : ''}
       </p>`
    : '';

  return `
    <div class="article-item ${typeClass}" data-article-id="${article.id}" data-article-type="${type}">
      <span class="article-type">${escapeHtml(article.type || '')}</span>
      <div class="article-title">${escapeHtml(article.title || '')}</div>
      <div class="article-preview">${escapeHtml(article.preview || '')}</div>
      ${metaHtml}
      <button class="btn article-btn" data-title="${escapeHtml(article.title || '')}" data-id="${article.id}">
        ${buttonText}
      </button>
    </div>
  `;
}

// ==========================================
// 統一文章載入（取代四個重複函數）
// ==========================================

function loadArticles(type, listElementId, buttonText) {
  const listEl = document.getElementById(listElementId);
  if (!listEl) return;

  fetch('../articles/config.json')
    .then(res => res.json())
    .then(config => {
      const articles = config[type];
      if (!articles || articles.length === 0) {
        listEl.innerHTML = '<p>尚無文章</p>';
        return;
      }
      Promise.all(articles.map(article =>
        fetch(`../articles/${type}/${article.file}`)
          .then(r => r.text())
          .then(content => ({ ...article, content }))
      ))
      .then(loaded => {
        loaded.forEach(a => { articlesStore[type][a.id] = a.content; });
        listEl.innerHTML = loaded.map(a => renderCard(a, type, buttonText)).join('');
      })
      .catch(err => {
        listEl.innerHTML = '<p>載入文章中...</p>';
        console.error(`載入 ${type} 文章失敗:`, err);
      });
    })
    .catch(err => {
      listEl.innerHTML = '<p>尚無文章</p>';
      console.error(`載入 ${type} 配置失敗:`, err);
    });
}

// ==========================================
// 統一模態框（取代四組重複的 show/close 函數）
// ==========================================

function openModal(type, title, content) {
  const modal = document.getElementById(`${type}-modal`);
  const modalContent = document.getElementById(`${type}-modal-content`);
  if (!modal || !modalContent) return;

  modalContent.innerHTML = '';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'modal-close';
  closeBtn.textContent = '✕';
  closeBtn.onclick = () => closeModal(type);
  modalContent.appendChild(closeBtn);

  const titleEl = document.createElement('h2');
  titleEl.textContent = title;
  modalContent.appendChild(titleEl);

  const bodyEl = document.createElement('div');
  bodyEl.className = 'modal-body';
  bodyEl.innerHTML = renderMarkdown(content);
  modalContent.appendChild(bodyEl);

  modal.classList.add('active');
}

function closeModal(type) {
  const modal = document.getElementById(`${type}-modal`);
  if (modal) modal.classList.remove('active');
}

// 點擊模態框背景關閉
document.addEventListener('click', function(e) {
  ['writeup', 'zeroday', 'reading', 'class'].forEach(type => {
    if (e.target.id === `${type}-modal`) closeModal(type);
  });
});

// ESC 鍵關閉模態框
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    ['writeup', 'zeroday', 'reading', 'class'].forEach(type => closeModal(type));
  }
});

// ==========================================
// 文章按鈕事件委託
// ==========================================

function initArticleButtons() {
  const typeMap = {
    'ctf-list':     { store: 'ctf',     modal: 'writeup' },
    'zeroday-list': { store: 'zeroday', modal: 'zeroday' },
    'reading-list': { store: 'reading', modal: 'reading' },
    'class-list':   { store: 'class',   modal: 'class' }
  };

  Object.entries(typeMap).forEach(([listId, { store, modal }]) => {
    document.getElementById(listId)?.addEventListener('click', function(e) {
      const btn = e.target.closest('.article-btn');
      if (!btn) return;
      openModal(modal, btn.dataset.title, articlesStore[store][btn.dataset.id] || '');
    });
  });
}

// ==========================================
// 漏洞數量動畫
// ==========================================

function fetchVulnerabilityCount() {
  const countElement = document.getElementById('vulnerability-count');
  if (!countElement) return;

  fetch('articles/config.json')
    .then(res => res.json())
    .then(config => {
      const target = (config.stats && config.stats.vulnerabilityCount) || 104;
      animateCount(countElement, target);
    })
    .catch(() => {
      const fallback = parseInt(countElement.textContent, 10) || 104;
      animateCount(countElement, fallback);
    });
}

function animateCount(element, target) {
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    element.textContent = Math.floor(target * easeOut);
    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = target;
  }

  requestAnimationFrame(update);
}
