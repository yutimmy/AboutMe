// ==========================================
// Yu's Blog - 個人網站主程式
// 功能：頁面切換、API 整合、Markdown 載入
// ==========================================

const articlesStore = { ctf: {}, zeroday: {}, reading: {}, class: {} };

document.addEventListener('DOMContentLoaded', function () {
  console.log('[Yu Blog] 網站載入中...');

  // marked.js 設定
  if (typeof marked !== 'undefined') {
    marked.use({ breaks: true, gfm: true });
  }

  initNavigation();
  initMobileBottomBar();
  initMobileProfile();
  initBackToTop();
  initSidebarClock();

  loadArticles('ctf',     'ctf-list',     '閱讀詳細');
  loadArticles('zeroday', 'zeroday-list',  '查看詳情');
  loadArticles('reading', 'reading-list',  '閱讀心得');
  loadArticles('class',   'class-list',    '查看筆記');
  initArticleButtons();

  fetchVulnerabilityCount();
  fetchDailyQuote();
  fetchGitHubStats();
  fetchHackerNews();
  fetchAdvice();
  initTypedBio();

  showPage('home');
});

// ==========================================
// 導航功能
// ==========================================

function initNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const hamburgerBtn = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navBrand = document.getElementById('nav-brand');

  hamburgerBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      showPage(page);
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
      syncBottomBar(page);
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('nav')) {
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // 品牌名點擊回主頁
  if (navBrand) {
    navBrand.addEventListener('click', function (e) {
      e.preventDefault();
      showPage('home');
      navLinks.forEach(l => l.classList.remove('active'));
      const homeLink = document.querySelector('nav a[data-page="home"]');
      if (homeLink) homeLink.classList.add('active');
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
      syncBottomBar('home');
    });
  }
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
}

// ==========================================
// 手機版底部工具列
// ==========================================

function initMobileBottomBar() {
  const bar = document.getElementById('mobile-bottom-bar');
  if (!bar) return;

  const items = bar.querySelectorAll('.bottom-bar-item[data-page]');
  items.forEach(item => {
    item.addEventListener('click', function () {
      const page = this.getAttribute('data-page');
      showPage(page);
      syncBottomBar(page);
      syncNavActive(page);
    });
  });

  // 預設 home active
  syncBottomBar('home');
}

function syncBottomBar(pageId) {
  const bar = document.getElementById('mobile-bottom-bar');
  if (!bar) return;
  bar.querySelectorAll('.bottom-bar-item[data-page]').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-page') === pageId);
  });
}

function syncNavActive(pageId) {
  document.querySelectorAll('nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-page') === pageId);
  });
}

// ==========================================
// 手機版個人資訊面板
// ==========================================

function initMobileProfile() {
  const btn = document.getElementById('mobile-profile-btn');
  const panel = document.getElementById('mobile-profile-panel');
  const overlay = document.getElementById('mobile-profile-overlay');
  const closeBtn = document.getElementById('mobile-panel-close');
  if (!btn || !panel || !overlay) return;

  function openPanel() {
    panel.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    panel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    panel.style.transform = '';
  }

  btn.addEventListener('click', openPanel);
  overlay.addEventListener('click', closePanel);
  if (closeBtn) closeBtn.addEventListener('click', closePanel);

  // 手勢下滑關閉面板
  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  panel.addEventListener('touchstart', function (e) {
    // 只在面板頂部才允許下拉關閉
    if (panel.scrollTop <= 0) {
      startY = e.touches[0].clientY;
      isDragging = true;
    }
  }, { passive: true });

  panel.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      panel.style.transform = `translateY(${diff}px)`;
      panel.style.transition = 'none';
    }
  }, { passive: true });

  panel.addEventListener('touchend', function () {
    if (!isDragging) return;
    isDragging = false;
    panel.style.transition = '';
    const diff = currentY - startY;
    if (diff > 80) {
      closePanel();
    } else {
      panel.style.transform = '';
    }
    startY = 0;
    currentY = 0;
  }, { passive: true });
}

// ==========================================
// 回到頂部
// ==========================================

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 300);
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==========================================
// 側邊欄時鐘
// ==========================================

function initSidebarClock() {
  const el = document.getElementById('sidebar-time');
  if (!el) return;

  function update() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('zh-TW', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
  }

  update();
  setInterval(update, 1000);
}

// ==========================================
// Typed.js 打字效果
// ==========================================

function initTypedBio() {
  const el = document.getElementById('typed-bio');
  if (!el || typeof Typed === 'undefined') return;

  new Typed('#typed-bio', {
    strings: [
      '資安愛好者',
      'CTF Player',
      '漏洞獵人',
      'Bug Bounty Hunter',
      'Web Security Researcher'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true,
    showCursor: true
  });
}

// ==========================================
// API: 每日名言 (ZenQuotes)
// ==========================================

const QUOTE_FALLBACKS = [
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { q: "In the middle of every difficulty lies opportunity.", a: "Albert Einstein" },
  { q: "Security is not a product, but a process.", a: "Bruce Schneier" },
  { q: "The best way to predict the future is to create it.", a: "Peter Drucker" },
  { q: "Hackers are breaking the systems for profit. Before, it was about intellectual curiosity and pursuit of knowledge.", a: "Kevin Mitnick" },
  { q: "There are only two types of companies: those that have been hacked, and those that will be.", a: "Robert Mueller" },
  { q: "Privacy is not something that I'm merely entitled to, it's an absolute prerequisite.", a: "Marlon Brando" },
  { q: "The more you sweat in training, the less you bleed in combat.", a: "Richard Marcinko" }
];

function fetchDailyQuote() {
  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  const refreshBtn = document.getElementById('quote-refresh');
  if (!textEl || !authorEl) return;

  function displayQuote(data) {
    textEl.textContent = data.q || data.quote || data.content || '';
    authorEl.textContent = data.a || data.author || '';
    if (authorEl.textContent) {
      authorEl.textContent = '— ' + authorEl.textContent;
    }
  }

  function fetchFromZenQuotes() {
    // ZenQuotes 透過 allorigins proxy 避免 CORS
    return fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'))
      .then(r => r.json())
      .then(data => {
        const parsed = JSON.parse(data.contents);
        if (parsed && parsed[0]) {
          displayQuote(parsed[0]);
          return true;
        }
        return false;
      });
  }

  function showFallback() {
    const random = QUOTE_FALLBACKS[Math.floor(Math.random() * QUOTE_FALLBACKS.length)];
    displayQuote(random);
  }

  function loadQuote() {
    textEl.textContent = '載入中...';
    authorEl.textContent = '';
    fetchFromZenQuotes().catch(() => showFallback());
  }

  loadQuote();
  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadQuote);
  }
}

// ==========================================
// API: GitHub 統計 (GitHub REST API)
// ==========================================

function fetchGitHubStats() {
  const username = 'yutimmy';
  
  fetch(`https://api.github.com/users/${username}`)
    .then(r => r.json())
    .then(data => {
      setTextSafe('gh-repos', data.public_repos);
      setTextSafe('gh-followers', data.followers);
      setTextSafe('gh-following', data.following);
      setTextSafe('github-repos', data.public_repos);
      setTextSafe('mobile-repos', data.public_repos);

      // 加入年份
      if (data.created_at) {
        const year = new Date(data.created_at).getFullYear();
        setTextSafe('gh-joined', year);
      }
    })
    .catch(err => {
      console.warn('GitHub API 載入失敗:', err);
      setTextSafe('gh-repos', '1');
      setTextSafe('gh-followers', '0');
      setTextSafe('gh-following', '0');
      setTextSafe('gh-joined', '2021');
    });
}

function setTextSafe(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ==========================================
// API: Hacker News (Firebase API)
// ==========================================

function fetchHackerNews() {
  const listEl = document.getElementById('hn-news-list');
  if (!listEl) return;

  fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(r => r.json())
    .then(ids => {
      const top6 = ids.slice(0, 6);
      return Promise.all(
        top6.map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        )
      );
    })
    .then(stories => {
      listEl.innerHTML = stories.map((story, i) => {
        const domain = story.url ? new URL(story.url).hostname.replace('www.', '') : 'news.ycombinator.com';
        const timeAgo = getTimeAgo(story.time * 1000);
        const url = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
        
        return `
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="hn-news-item">
            <span class="hn-news-rank">${i + 1}</span>
            <div class="hn-news-body">
              <div class="hn-news-title">${escapeHtml(story.title)}</div>
              <div class="hn-news-meta">
                <span><i class="fa-solid fa-arrow-up"></i> ${story.score || 0}</span>
                <span><i class="fa-regular fa-comment"></i> ${story.descendants || 0}</span>
                <span><i class="fa-solid fa-link"></i> ${domain}</span>
                <span><i class="fa-regular fa-clock"></i> ${timeAgo}</span>
              </div>
            </div>
          </a>
        `;
      }).join('');
    })
    .catch(err => {
      console.warn('Hacker News 載入失敗:', err);
      listEl.innerHTML = '<p style="color:var(--text-light);font-size:0.9rem;">新聞載入失敗，請稍後再試</p>';
    });
}

function getTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return Math.floor(diff / 60000) + ' 分鐘前';
  if (hours < 24) return hours + ' 小時前';
  return Math.floor(hours / 24) + ' 天前';
}

// ==========================================
// API: Random Advice (Advice Slip API)
// ==========================================

function fetchAdvice() {
  const textEl = document.getElementById('advice-text');
  const refreshBtn = document.getElementById('advice-refresh');
  if (!textEl) return;

  function loadAdvice() {
    textEl.textContent = '載入中...';
    // 加 timestamp 防止快取
    fetch('https://api.adviceslip.com/advice?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if (data.slip && data.slip.advice) {
          textEl.textContent = '"' + data.slip.advice + '"';
        }
      })
      .catch(() => {
        textEl.textContent = '"When hugging, hug with both arms and apply reasonable, affectionate pressure."';
      });
  }

  loadAdvice();
  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadAdvice);
  }
}

// ==========================================
// Markdown 轉換
// ==========================================

function renderMarkdown(md) {
  if (!md) return '';
  if (typeof marked !== 'undefined') return marked.parse(md);
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

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ==========================================
// 卡片渲染
// ==========================================

function renderCard(article, type, buttonText) {
  const typeClass = article.type
    ? article.type.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : 'default';

  const metaHtml = (type === 'reading' && (article.author || article.readTime))
    ? `<p class="article-meta">
         ${article.author ? escapeHtml(article.author) : ''} ${article.readTime ? '· ' + escapeHtml(article.readTime) : ''}
       </p>`
    : '';

  return `
    <div class="article-item ${typeClass}" data-article-id="${article.id}" data-article-type="${type}">
      <span class="article-type">${escapeHtml(article.type || '')}</span>
      <div class="article-title">${escapeHtml(article.title || '')}</div>
      <div class="article-preview">${escapeHtml(article.preview || '')}</div>
      ${metaHtml}
      <button class="btn article-btn" data-title="${escapeHtml(article.title || '')}" data-id="${article.id}">
        <i class="fa-solid fa-arrow-right"></i> ${buttonText}
      </button>
    </div>
  `;
}

// ==========================================
// 文章載入
// ==========================================

function loadArticles(type, listElementId, buttonText) {
  const listEl = document.getElementById(listElementId);
  if (!listEl) return;

  fetch('articles/config.json')
    .then(res => res.json())
    .then(config => {
      const articles = config[type];
      if (!articles || articles.length === 0) {
        listEl.innerHTML = '<p>尚無文章</p>';
        return;
      }
      Promise.all(articles.map(article =>
        fetch(`articles/${type}/${article.file}`)
          .then(r => r.text())
          .then(content => ({ ...article, content }))
      ))
      .then(loaded => {
        loaded.forEach(a => { articlesStore[type][a.id] = a.content; });
        listEl.innerHTML = loaded.map(a => renderCard(a, type, buttonText)).join('');
      })
      .catch(err => {
        listEl.innerHTML = '<p>載入文章中...</p>';
        console.warn(`載入 ${type} 文章失敗:`, err);
      });
    })
    .catch(err => {
      listEl.innerHTML = '<p>尚無文章</p>';
      console.warn(`載入 ${type} 配置失敗:`, err);
    });
}

// ==========================================
// 模態框
// ==========================================

function openModal(type, title, content) {
  const modal = document.getElementById(`${type}-modal`);
  const modalContent = document.getElementById(`${type}-modal-content`);
  if (!modal || !modalContent) return;

  modalContent.innerHTML = '';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'modal-close';
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
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
  document.body.style.overflow = 'hidden';
}

function closeModal(type) {
  const modal = document.getElementById(`${type}-modal`);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('click', function (e) {
  ['writeup', 'zeroday', 'reading', 'class'].forEach(type => {
    if (e.target.id === `${type}-modal`) closeModal(type);
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    ['writeup', 'zeroday', 'reading', 'class'].forEach(type => closeModal(type));
    // 也關閉手機面板
    const panel = document.getElementById('mobile-profile-panel');
    const overlay = document.getElementById('mobile-profile-overlay');
    if (panel) panel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
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
    document.getElementById(listId)?.addEventListener('click', function (e) {
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
  const mobileCountEl = document.getElementById('mobile-vuln-count');
  if (!countElement) return;

  fetch('articles/config.json')
    .then(res => res.json())
    .then(config => {
      const target = (config.stats && config.stats.vulnerabilityCount) || 104;
      animateCount(countElement, target);
      if (mobileCountEl) mobileCountEl.textContent = target;
    })
    .catch(() => {
      const fallback = parseInt(countElement.textContent, 10) || 104;
      animateCount(countElement, fallback);
      if (mobileCountEl) mobileCountEl.textContent = fallback;
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
