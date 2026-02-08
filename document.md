# 個人網站專案說明文件（document.md）

> 本文件定位為「快速上手手冊 + 專案索引」。請在維護網站或新增內容時，先讀「如何使用本文件」小節再操作。

## 如何使用與維護本文件

* **讀這份文件時要找什麼？**
  * 想了解網站目的與結構 → 看「專案簡介」「網站整體結構圖」。
  * 想新增/修改內容 → 依分頁閱讀「主頁」「CTF Writeup」「HITCON ZeroDay」段落。
  * 想部署 → 直接跳到「部署方式」。
* **新增內容時必做**
  1. 在相對應的資料夾新增 Markdown（`writeups/` 或 `zeroday/`），檔名用小寫、連字號。
  2. 確認 `assets/js/main.js` 的載入邏輯可抓到新檔案（若有清單需更新）。
  3. 本文件同步補上新檔案名稱與重點摘要，方便日後檢索。
* **修改樣式 / 腳本**
  * 先確認影響的分頁：共用樣式在 `assets/css/style.css`，共用邏輯在 `assets/js/main.js`。
  * 大改版前建議在本文件補一行「更新重點」方便回溯。
* **版本與日期習慣**
  * 建議每次較大變更在文件開頭加入「上次更新：YYYY-MM-DD」；目前可直接改動本段落。

## 一、專案簡介

本專案為一個 **使用 GitHub Pages（github.io） 部署的個人介紹網站**，用於展示：

* 個人背景與技能（主頁）
* CTF 解題紀錄（CTF Writeup 分頁）
* HITCON ZeroDay 漏洞通報紀錄（HITCON ZeroDay 分頁）

整體定位為 **資安 / CTF / 研究導向的個人作品集網站（Portfolio）**，可提供給：

* 教授
* 面試官
* 資安社群
* 對我研究內容有興趣的讀者

---

## 二、網站整體結構圖

```text
Personal-Github-Page/
├─ index.html              # 主頁（自我介紹）
├─ ctf.html                # CTF Writeup 分頁
├─ zeroday.html            # HITCON ZeroDay 分頁
├─ assets/
│  ├─ css/
│  │  └─ style.css         # 全站樣式
│  ├─ js/
│  │  └─ main.js           # 前端互動邏輯（主程式）
│  └─ images/              # 圖片、截圖
├─ writeups/
│  └─ *.md                 # 各題 CTF Writeup（Markdown）
├─ zeroday/
│  └─ *.md                 # 各漏洞說明文件（Markdown）
├─ .env.example            # 環境變數範例（不含敏感資料）
├─ .gitignore
└─ document.md             # 本說明文件
```

---

## 三、主頁（index.html）內容說明

### 1️⃣ 自我介紹（About Me）

主頁聚焦於 **個人能力與實績摘要**，內容包含：

* **英文能力**

  * TOEIC：555 分

* **資安能力與經驗**

  * 通報 **HITCON ZeroDay 100+ 漏洞**
  * 類型包含：

    * XSS（跨站腳本）
    * SQL Injection
    * `.git` 資訊洩漏

* **專案經驗**

  * 已完成 **3 個獨立專案**（含設計、實作、測試）

* **證照與學習歷程**

  * 已取得：

    * Microsoft **AI-900**
    * **ITS Python**
  * 目前準備中：

    * **CEH**
    * **Network+**

> 主頁以「快速理解我是誰、我會什麼」為設計目標

---

## 四、CTF Writeup 分頁（ctf.html）

### 功能定位

此分頁用於展示 **我撰寫的 CTF 解題紀錄（Writeup）**，強調：

* 解題思路
* 技術分析能力
* 工具使用能力

### 建議結構

* 題目名稱
* 題目類型（Web / Pwn / Crypto / Forensics…）
* 解題流程
* Payload / Exploit 說明
* 成果截圖

### 檔案管理方式

```text
writeups/
├─ picoctf-web-001.md
├─ hitcon-ctf-xss.md
└─ custom-challenge.md
```

前端（`main.js`）可動態載入 Markdown 內容並顯示於頁面中。

---

## 五、HITCON ZeroDay 分頁（zeroday.html）

### 功能定位

本分頁專門整理 **已公開的 ZeroDay 漏洞紀錄**，展示我在實戰中的：

* 漏洞發現能力
* 測試方法論
* 思考邏輯

### 每篇漏洞內容建議包含

* 漏洞類型（XSS / SQLi / Info Leak…）
* 影響範圍
* 發現過程
* 測試 Payload
* 為何會存在該漏洞
* 防禦與修補建議

### 檔案管理方式

```text
zeroday/
├─ company-a-xss.md
├─ gov-site-git-leak.md
└─ sql-injection-case.md
```

---

## 六、環境變數與敏感資料管理（.env）

### 為什麼需要 .env

專案中若有以下內容 **一律不可寫死於程式碼中**：

* API Key
* Token
* 私有連結
* 管理用設定

### 作法說明

* 使用 `.env` 儲存實際敏感資料
* 使用 `.env.example` 提供欄位範例
* `.env` 加入 `.gitignore`

```env
# .env.example
API_BASE_URL=
ADMIN_TOKEN=
```

> 實際 `.env` 不上傳至 GitHub

---

## 七、主程式說明（main.js）

### 主程式位置

```text
assets/js/main.js
```

### 功能職責

* 控制頁面切換
* 載入 Writeup / ZeroDay Markdown 檔案
* 處理前端互動（按鈕、列表、展開內容）

主程式為整個網站的 **核心邏輯入口點**。

---

## 八、部署方式（GitHub Pages）

### 部署流程

1. 專案推送至 GitHub Repository
2. Repository 命名為：

   ```text
   <username>.github.io
   ```
3. 至 GitHub → Settings → Pages
4. 選擇 Branch（main）與 root
5. 即可透過以下網址存取：

```text
https://<username>.github.io
```

---

## 九、設計參考

本專案風格與結構可參考以下網站：

* [https://naup.mygo.tw/about/](https://naup.mygo.tw/about/)
* [https://4ur0n.github.io/](https://4ur0n.github.io/)
* [https://flydragonw.github.io/](https://flydragonw.github.io/)

---

## 十、總結

此專案是一個 **以資安實績為核心的個人展示網站**，重點不在華麗視覺，而在：

* 可驗證的技術能力
* 清楚的思考邏輯
* 長期可累積的研究紀錄

適合持續擴充、長期經營，作為個人專業品牌的一部分。


 cd "/Users/timmylin/Desktop/自我介紹網頁" && python3 -m http.server 8080
