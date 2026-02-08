# CTF 新手工具與練習網站總覽

> **目標讀者** | 完全沒學過的初學者，旨在提供 Web、Crypto、Reverse、Forensic 等領域的入門地圖。

---

## 目錄

1. Web（網站攻防）
2. Crypto（密碼學 / 編碼）
3. Reverse（逆向 / 二進位）
4. Forensic（數位鑑識 / Stego）
5. 練習網站與靶場推薦
6. 入門學習路線

---

## Web（網站攻防）

Web 類題目主要關注網頁應用程式的漏洞。以下是新手必備的工具清單。

### 核心工具

| 工具 | 類型 | 簡短說明 | 入門方式 |
|------|------|--------|--------|
| Burp Suite | Proxy 攔截 | 攔截與修改 HTTP(S) 請求，分析封包必備。 | 安裝後設定瀏覽器 Proxy，透過 Intercept 修改參數。 |
| OWASP ZAP | Proxy 掃描 | 開源的 Burp 替代品，整合自動化漏洞掃描功能。 | 使用 Quick Start 進行主動掃描或手動攔截。 |
| sqlmap | 自動化 SQLi | 自動識別並利用 SQL 注入漏洞取回資料庫資料。 | `sqlmap -u "URL" --dbs` 跑出資料庫名稱 |
| DevTools | 瀏覽器內建 | 檢查 HTML/JS、Network 與 Cookie。 | 按下 F12 觀察 Network 分頁的 API 請求 |
| PortSwigger Academy | 教學靶場 | 免費互動式課程，從基礎到進階。 | 從 SQLi 或 XSS 基礎章節開始 |

### Web 學習提示

- 先學會用 DevTools 觀察網頁行為，再學習使用 Burp Suite 修改請求
- 理解前端與後端的資料交換流程，以及如何繞過前端驗證

---

## Crypto（密碼學 / 編碼）

對新手而言，這類題目多涉及編碼轉換與對稱加密。

| 工具 / 資源 | 類型 | 簡短說明 |
|-----------|------|--------|
| CyberChef | 資料轉換 | 強大的編碼/解碼工具（Base64, Hex, XOR, ROT13）|
| Hashcat | 密碼破解 | 高效率的雜湊（Hash）爆破工具 |
| CryptoHack | 練習平台 | 從現代密碼學基礎開始教起的優質靶場 |
| dCode | 線上解密 | 古典密碼（凱薩、維吉尼亞）的自動解碼工具 |

---

## Reverse（逆向 / 二進位）

逆向工程旨在分析程式的執行邏輯，通常需要理解組合語言。

| 工具 | 類型 | 簡短說明 |
|------|------|--------|
| Ghidra | 反組譯器 | NSA 開源工具，能將機器碼還原成類 C 語言代碼 |
| x64dbg | 動態除錯 | Windows 平台下的除錯工具，可單步執行程式 |
| Cutter | 逆向 GUI | 基於 radare2 的圖形化界面，適合新手上手 |
| GDB | Linux 除錯 | Linux 環境下標準的除錯程式 |

---

## Forensic（數位鑑識 / Stego）

鑑識題目包含圖片隱寫（Stego）、流量分析與檔案取證。

| 工具 | 類型 | 簡短說明 | 常用指令 |
|------|------|--------|--------|
| Aperi'Solve | 線上分析 | 整合各種圖片隱寫分析工具的網頁平台 | 直接上傳圖片 |
| Wireshark | 流量分析 | 分析 .pcap 封包，觀察網路傳輸內容 | 搜尋 `http` 或 `tcp` 過濾 |
| Exiftool | 中繼資料 | 檢視圖片或文件的 Metadata（GPS、作者等） | `exiftool file.jpg` |
| Binwalk | 檔案提取 | 檢測並提取嵌入在檔案內部的隱藏資料 | `binwalk -e file` |

---

## 練習網站與靶場推薦

### 初級 - 完全新手

**picoCTF**
- CMU 主辦，題型分類明確
- 最適合零基礎新手入門
- 有完整的新手教學

### 初級 - 基礎建構

**OverTheWire (Bandit)**
- 透過遊戲學習 Linux 基本指令
- 所有 CTF 領域的基礎
- 完全免費，無需註冊

### 中級 - 引導學習

**TryHackMe**
- 提供引導式的 Room
- 一步步教你如何操作工具
- 題目難度漸進式增加

### 高級 - 實戰練習

**Hack The Box**
- 難度較高，適合有一定基礎
- 進行實戰滲透練習
- 模擬真實企業環境

---

## 入門學習路線 (Roadmap)

### 第一階段：基礎加固（第 1-2 週）

- 熟悉 Linux 基本指令（ls, cd, cat, grep, find）
- 練習 OverTheWire 的 Bandit 系列至 Level 20
- 完成後能獨立進行檔案操作和文本處理

### 第二階段：工具與 Web（第 3-6 週）

- 學習使用 CyberChef 轉換編碼
- 透過 picoCTF 練習 Web 與 General Skills 類別
- 閱讀 PortSwigger 的 Web Security Academy 教材
- 建立 Burp Suite 基本操作技能

### 第三階段：進階實作（第 7-12 週）

- 開始接觸 Ghidra 進行簡單的 Reverse 題目
- 學習 Python 腳本編寫，自動化處理重複的 Crypto 或 Web 請求
- 參與 TryHackMe 的中等難度挑戰

---

## 新手黃金法則

### 1. 不要直接看答案

嘗試卡關 2 小時後再去看 Writeup（題解），並理解原理。這樣才能真正內化知識。

### 2. 保持紀錄

將解題過程寫成筆記，這對學習 Reverse 與 Web 邏輯非常有幫助。定期複習筆記能加深記憶。

### 3. 法律邊界

僅在合法授權的靶場練習，嚴禁攻擊真實未授權網站。違反法律會導致嚴重後果。

### 4. 保持耐心

安全領域需要時間累積知識，不要急於求成。每一個小進步都是重要的。

---

## 推薦學習順序圖

```
基礎指令 → Web 漏洞 → Crypto 編碼 → Forensic 分析 → Reverse 逆向
  Bandit    picoCTF    CyberChef    Wireshark      Ghidra
   (1-2w)    (3-6w)      (3-6w)      (7-12w)      (7-12w)
```

---

## 常見卡點解決方案

### 題目完全看不懂怎麼辦？

1. 重新閱讀題目敘述，找出關鍵字
2. 在網路上搜尋相關技術文章
3. 檢查該靶場的官方 Hint 或 Writeup
4. 加入 CTF 社群討論（不要直接抄答案）

### 工具安裝失敗怎麼辦？

1. 確認系統環境（Windows/Mac/Linux）
2. 檢查是否有依賴包未安裝
3. 查看官方 GitHub 的 Issue 或 FAQ
4. 嘗試使用 Docker 容器化版本

### 學習進度卡住怎麼辦？

1. 不要勉強，先放下休息一下
2. 換一個不同類別的題目嘗試
3. 回顧前面章節，確保基礎扎實
4. 找一位同學或師傅一起討論

---