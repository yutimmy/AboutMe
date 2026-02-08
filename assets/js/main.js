// ==========================================
// 膽小狗英雄風格 - 個人網站主程式
// 功能：頁面切換、Markdown 載入、互動邏輯
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
  
  // 初始化導航
  initNavigation();
  
  // 初始化所有分頁內容
  loadWriteups();
  loadZerodays();
  loadReadingNotes();
  loadClassNotes();
  
  // 初始化文章按鈕事件委託
  initArticleButtons();
  
  // 獲取最新的漏洞通報數量
  fetchVulnerabilityCount();
  
  // 預設顯示主頁
  showPage('home');
});

// ==========================================
// 導航功能
// ==========================================

function initNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      showPage(pageId);
      
      // 更新導航選中狀態
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// 頁面切換函數
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo(0, 0);
  }
}

// ==========================================
// Markdown 載入功能 - 安全版本
// ==========================================
// Markdown 載入功能 - 完全安全版本
// ==========================================

// HTML 逃逸函數
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// 完全安全的 Markdown 轉 HTML 函數
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  let html = String(markdown);
  
  // 第一步：保存代碼塊和立即逃逸
  const codeBlocks = [];
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const code = match.replace(/```/g, '').trim();
    codeBlocks.push(escapeHtml(code));
    return `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length - 1}__`;
  });
  
  // 第一點五步：保存表格（在逃逸前）
  const tables = [];
  html = html.replace(/^\|(.+)\n\|[-:|\s]+\n((?:\|.+\n?)*)/gm, (match) => {
    tables.push(match);
    return `__TABLE_PLACEHOLDER_${tables.length - 1}__`;
  });
  
  // 第二步：逃逸所有 HTML 字符（這是關鍵步驟，防止 XSS）
  html = escapeHtml(html);
  
  // 第三步：還原代碼塊
  codeBlocks.forEach((code, index) => {
    html = html.replace(
      `__CODE_BLOCK_PLACEHOLDER_${index}__`,
      `<pre><code>${code}</code></pre>`
    );
  });
  
  // 第三點五步：還原並轉換表格
  tables.forEach((tableStr, index) => {
    const rows = tableStr.split('\n').filter(row => row.trim().startsWith('|'));
    let tableHtml = '<table style="width:100%; border-collapse: collapse;"><tbody>';
    
    rows.forEach((row, rowIndex) => {
      // 跳過分隔符行
      if (row.match(/^\|[-:|\s]+$/)) {
        return;
      }
      
      const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
      const isHeader = rowIndex === 0;
      const tag = isHeader ? 'th' : 'td';
      
      tableHtml += '<tr>';
      cells.forEach(cell => {
        tableHtml += `<${tag} style="border: 1px solid #ddd; padding: 8px;">${escapeHtml(cell)}</${tag}>`;
      });
      tableHtml += '</tr>';
    });
    
    tableHtml += '</tbody></table>';
    html = html.replace(
      `__TABLE_PLACEHOLDER_${index}__`,
      tableHtml
    );
  });
  
  // 第四步：現在安全地處理 Markdown 語法
  
  // 標題
  html = html.replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*?)$/gm, '<h1>$1</h1>');
  
  // 分隔線
  html = html.replace(/^---$/gm, '<hr>');
  
  // 粗體
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // 斜體
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // 行內代碼
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // 連結
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // 有序列表
  html = html.replace(/^\d+\.\s+(.+?)$/gm, '<li>$1</li>');
  
  // 無序列表
  html = html.replace(/^[-*]\s+(.+?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/s, '<ul>$1</ul>');
  
  // 引用塊
  html = html.replace(/^&gt;\s+(.+?)$/gm, '<blockquote>$1</blockquote>');
  
  // 段落 - 最後處理
  const parts = html.split('\n\n');
  html = parts.map(part => {
    part = part.trim();
    if (!part) return '';
    
    // 檢查是否已經是區塊元素
    if (part.match(/^<(h\d|ul|ol|li|pre|code|table|blockquote|hr|div|p)/i)) {
      return part;
    }
    
    return '<p>' + part + '</p>';
  }).join('');
  
  return html;
}

// ==========================================
// 統一卡片渲染函數
// ==========================================

function renderCard(article, type, modalFuncName, buttonText) {
  // 根據 type 生成 CSS class
  const typeClass = article.type 
    ? article.type.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    : 'default';
  
  // 讀書心得特殊處理
  if (type === 'reading') {
    return `
      <div class="article-item ${typeClass}" data-article-id="${article.id}" data-article-type="${type}">
        <span class="article-type">${article.title ? escapeHtml(article.type || '讀書心得') : ''}</span>
        <div class="article-title">${article.title ? escapeHtml(article.title) : ''}</div>
        <div class="article-preview">${article.preview ? escapeHtml(article.preview) : ''}</div>
        <p class="article-meta">
           ${article.author ? escapeHtml(article.author) : ''} •  ${article.readTime ? escapeHtml(article.readTime) : ''}
        </p>
        <button class="btn article-btn" data-title="${article.title ? escapeHtml(article.title) : ''}" data-id="${article.id}">
           閱讀心得
        </button>
      </div>
    `;
  }
  
  // CTF 和 ZeroDay 統一格式
  return `
    <div class="article-item ${typeClass}" data-article-id="${article.id}" data-article-type="${type}">
      <span class="article-type">${article.type ? escapeHtml(article.type) : ''}</span>
      <div class="article-title">${article.title ? escapeHtml(article.title) : ''}</div>
      <div class="article-preview">${article.preview ? escapeHtml(article.preview) : ''}</div>
      <button class="btn article-btn" data-title="${article.title ? escapeHtml(article.title) : ''}" data-id="${article.id}">
        ${buttonText}
      </button>
    </div>
  `;
}

// 動態加載 CTF Writeups
function loadWriteups() {
  const writeupList = document.getElementById('ctf-list');
  if (!writeupList) return;
  
  fetch('../articles/config.json')
    .then(response => response.json())
    .then(config => {
      Promise.all(config.ctf.map(article => 
        fetch(`../articles/ctf/${article.file}`)
          .then(r => r.text())
          .then(content => ({...article, content}))
      ))
      .then(articles => {
        // 存儲文章內容到全局存儲
        articles.forEach(article => {
          articlesStore.ctf[article.id] = article.content;
        });
        writeupList.innerHTML = articles.map(article => 
          renderCard(article, 'ctf', 'showWriteupModal', '📖 閱讀詳細')
        ).join('');
      })
      .catch(err => {
        writeupList.innerHTML = '<p>載入文章中...</p>';
        console.error('載入 CTF 文章失敗:', err);
      });
    })
    .catch(err => {
      writeupList.innerHTML = '<p>尚無 CTF 文章</p>';
      console.error('載入配置失敗:', err);
    });
}

// 動態加載 ZeroDay 漏洞
function loadZerodays() {
  const zerodayList = document.getElementById('zeroday-list');
  if (!zerodayList) return;
  
  fetch('../articles/config.json')
    .then(response => response.json())
    .then(config => {
      Promise.all(config.zeroday.map(article => 
        fetch(`../articles/zeroday/${article.file}`)
          .then(r => r.text())
          .then(content => ({...article, content}))
      ))
      .then(articles => {
        // 存儲文章內容到全局存儲
        articles.forEach(article => {
          articlesStore.zeroday[article.id] = article.content;
        });
        zerodayList.innerHTML = articles.map(article => 
          renderCard(article, 'zeroday', 'showZerodayModal', '🔍 查看詳情')
        ).join('');
      })
      .catch(err => {
        zerodayList.innerHTML = '<p>載入漏洞中...</p>';
        console.error('載入 ZeroDay 文章失敗:', err);
      });
    })
    .catch(err => {
      zerodayList.innerHTML = '<p>尚無 ZeroDay 漏洞</p>';
      console.error('載入配置失敗:', err);
    });
}

// 動態加載課外書讀書心得
function loadReadingNotes() {
  const readingList = document.getElementById('reading-list');
  if (!readingList) return;
  
  fetch('../articles/config.json')
    .then(response => response.json())
    .then(config => {
      Promise.all(config.reading.map(article => 
        fetch(`../articles/reading/${article.file}`)
          .then(r => r.text())
          .then(content => ({...article, content}))
      ))
      .then(articles => {
        // 存儲文章內容到全局存儲
        articles.forEach(article => {
          articlesStore.reading[article.id] = article.content;
        });
        readingList.innerHTML = articles.map(article => 
          renderCard(article, 'reading', 'showReadingModal', '📚 閱讀心得')
        ).join('');
      })
      .catch(err => {
        readingList.innerHTML = '<p>載入讀書心得中...</p>';
        console.error('載入讀書心得失敗:', err);
      });
    })
    .catch(err => {
      readingList.innerHTML = '<p>尚無讀書心得</p>';
      console.error('載入配置失敗:', err);
    });
}

// 動態加載上課筆記
function loadClassNotes() {
  const classList = document.getElementById('class-list');
  if (!classList) return;
  
  fetch('../articles/config.json')
    .then(response => response.json())
    .then(config => {
      if (!config.class) {
        classList.innerHTML = '<p>尚無上課筆記</p>';
        return;
      }
      Promise.all(config.class.map(article => 
        fetch(`../articles/class/${article.file}`)
          .then(r => r.text())
          .then(content => ({...article, content}))
      ))
      .then(articles => {
        articles.forEach(article => {
          articlesStore.class[article.id] = article.content;
        });
        classList.innerHTML = articles.map(article => 
          renderCard(article, 'class', 'showClassModal', '📝 查看筆記')
        ).join('');
      })
      .catch(err => {
        classList.innerHTML = '<p>載入上課筆記中...</p>';
        console.error('載入上課筆記失敗:', err);
      });
    })
    .catch(err => {
      classList.innerHTML = '<p>尚無上課筆記</p>';
      console.error('載入配置失敗:', err);
    });
}

// ==========================================
// 文章按鈕事件委託
// ==========================================

function initArticleButtons() {
  // CTF 文章按鈕
  document.getElementById('ctf-list')?.addEventListener('click', function(e) {
    if (e.target.closest('.article-btn')) {
      const btn = e.target.closest('.article-btn');
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const content = articlesStore.ctf[id] || '';
      showWriteupModal(id, title, content);
    }
  });
  
  // ZeroDay 文章按鈕
  document.getElementById('zeroday-list')?.addEventListener('click', function(e) {
    if (e.target.closest('.article-btn')) {
      const btn = e.target.closest('.article-btn');
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const content = articlesStore.zeroday[id] || '';
      showZerodayModal(id, title, content);
    }
  });
  
  // 讀書心得按鈕
  document.getElementById('reading-list')?.addEventListener('click', function(e) {
    if (e.target.closest('.article-btn')) {
      const btn = e.target.closest('.article-btn');
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const content = articlesStore.reading[id] || '';
      showReadingModal(id, title, content);
    }
  });
  
  // 上課筆記按鈕
  document.getElementById('class-list')?.addEventListener('click', function(e) {
    if (e.target.closest('.article-btn')) {
      const btn = e.target.closest('.article-btn');
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const content = articlesStore.class[id] || '';
      showClassModal(id, title, content);
    }
  });
}

// ==========================================
// 模態框功能
// ==========================================

function showWriteupModal(id, title, content) {
  const modal = document.getElementById('writeup-modal');
  const modalContent = document.getElementById('writeup-modal-content');
  
  if (modal && modalContent) {
    // 清空內容
    modalContent.innerHTML = '';
    
    // 創建關閉按鈕
    const closeBtn = document.createElement('span');
    closeBtn.className = 'modal-close';
    closeBtn.textContent = '✕';
    closeBtn.onclick = closeWriteupModal;
    modalContent.appendChild(closeBtn);
    
    // 創建標題
    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    modalContent.appendChild(titleEl);
    
    // 創建內容容器並安全地設置 HTML
    const bodyEl = document.createElement('div');
    bodyEl.className = 'modal-body';
    bodyEl.innerHTML = markdownToHtml(content);
    modalContent.appendChild(bodyEl);
    
    modal.classList.add('active');
  }
}

function showClassModal(id, title, content) {
  const modal = document.getElementById('class-modal');
  const modalContent = document.getElementById('class-modal-content');
  
  if (modal && modalContent) {
    modalContent.innerHTML = '';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'modal-close';
    closeBtn.textContent = '✕';
    closeBtn.onclick = closeClassModal;
    modalContent.appendChild(closeBtn);
    
    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    modalContent.appendChild(titleEl);
    
    const bodyEl = document.createElement('div');
    bodyEl.className = 'modal-body';
    bodyEl.innerHTML = markdownToHtml(content);
    modalContent.appendChild(bodyEl);
    
    modal.classList.add('active');
  }
}

function closeClassModal() {
  const modal = document.getElementById('class-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function closeWriteupModal() {
  const modal = document.getElementById('writeup-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function showZerodayModal(id, title, content) {
  const modal = document.getElementById('zeroday-modal');
  const modalContent = document.getElementById('zeroday-modal-content');
  
  if (modal && modalContent) {
    // 清空內容
    modalContent.innerHTML = '';
    
    // 創建關閉按鈕
    const closeBtn = document.createElement('span');
    closeBtn.className = 'modal-close';
    closeBtn.textContent = '✕';
    closeBtn.onclick = closeZerodayModal;
    modalContent.appendChild(closeBtn);
    
    // 創建標題
    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    modalContent.appendChild(titleEl);
    
    // 創建內容容器並安全地設置 HTML
    const bodyEl = document.createElement('div');
    bodyEl.className = 'modal-body';
    bodyEl.innerHTML = markdownToHtml(content);
    modalContent.appendChild(bodyEl);
    
    modal.classList.add('active');
  }
}

function closeZerodayModal() {
  const modal = document.getElementById('zeroday-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// 讀書心得模態框功能
function showReadingModal(id, title, content) {
  const modal = document.getElementById('reading-modal');
  const modalContent = document.getElementById('reading-modal-content');
  
  if (modal && modalContent) {
    // 清空內容
    modalContent.innerHTML = '';
    
    // 創建關閉按鈕
    const closeBtn = document.createElement('span');
    closeBtn.className = 'modal-close';
    closeBtn.textContent = '✕';
    closeBtn.onclick = closeReadingModal;
    modalContent.appendChild(closeBtn);
    
    // 創建標題
    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    modalContent.appendChild(titleEl);
    
    // 創建內容容器並安全地設置 HTML
    const bodyEl = document.createElement('div');
    bodyEl.className = 'modal-body';
    bodyEl.innerHTML = markdownToHtml(content);
    modalContent.appendChild(bodyEl);
    
    modal.classList.add('active');
  }
}

function closeReadingModal() {
  const modal = document.getElementById('reading-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// 點擊模態框背景關閉
document.addEventListener('click', function(e) {
  if (e.target.id === 'writeup-modal') {
    closeWriteupModal();
  }
  if (e.target.id === 'zeroday-modal') {
    closeZerodayModal();
  }
  if (e.target.id === 'reading-modal') {
    closeReadingModal();
  }
  if (e.target.id === 'class-modal') {
    closeClassModal();
  }
});

// ==========================================
// 獲取漏洞數量 - 從 config.json 取得並以滾動動畫顯示
// ==========================================

function fetchVulnerabilityCount() {
  const countElement = document.getElementById('vulnerability-count');
  if (!countElement) return;

  // 從 config.json 讀取最新漏洞數量
  fetch('articles/config.json')
    .then(response => response.json())
    .then(config => {
      const target = (config.stats && config.stats.vulnerabilityCount) || 104;
      animateCount(countElement, target);
      console.log(`✅ 漏洞通報數量: ${target}`);
    })
    .catch(error => {
      // 若讀取失敗，使用 HTML 中的預設值並播放動畫
      console.warn('⚠️ 無法讀取 config.json，使用預設值', error);
      const fallback = parseInt(countElement.textContent, 10) || 104;
      animateCount(countElement, fallback);
    });
}

// 數字滾動動畫
function animateCount(element, target) {
  const duration = 1500; // 動畫時長 1.5 秒
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeOutExpo 緩動函數，讓數字快速上升後緩慢到達
    const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(start + (target - start) * easeOut);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

