

# CTF 新手工具與練習網站總覽

> 目標讀者：完全沒學過的初學者，旨在提供 Web、Crypto、Reverse、Forensic 等領域的入門地圖。

---

## 目錄

1. [Web（網站攻防）](https://www.google.com/search?q=%23web%E7%B6%B2%E7%AB%99%E6%94%BB%E9%98%B2)

2. [Crypto（密碼學 / 編碼）](https://www.google.com/search?q=%23crypto%E5%AF%86%E7%A2%BC%E5%AD%B8--%E7%B7%A8%E7%A2%BC)

3. [Reverse（逆向 / 二進位）](https://www.google.com/search?q=%23reverse%E9%80%86%E5%90%91--%E4%BA%8C%E9%80%B2%E4%BD%8D)

4. [Forensic（數位鑑識 / Stego）](https://www.google.com/search?q=%23forensic%E6%95%B8%E4%BD%8D%E9%91%91%E8%AD%98--stego)

5. [練習網站與靶場推薦](https://www.google.com/search?q=%23%E7%B7%B4%E7%BF%92%E7%B6%B2%E7%AB%99%E8%88%87%E9%9D%B6%E5%A0%B4%E6%8E%A8%E8%96%A6)

6. [入門學習路線 (Roadmap)](https://www.google.com/search?q=%23%E5%85%A5%E9%96%80%E5%AD%B8%E7%BF%92%E8%B7%AF%E7%B7%9A-roadmap)

---

## Web（網站攻防）

Web 類題目主要關注網頁應用程式的漏洞。以下是新手必備的工具清單。

| 工具 / 資源 | 類型 | 簡短說明 | 入門使用方式 | 參考連結 |
| --- | --- | --- | --- | --- |
| **Burp Suite** | Proxy 攔截 | 攔截與修改 HTTP(S) 請求，分析封包必備。 | 安裝後設定瀏覽器 Proxy，透過 Intercept 修改參數。 | [官網](https://www.google.com/search?q=%5Bhttps://portswigger.net/burp/communitydownload%5D(https://portswigger.net/burp/communitydownload)) |
| **OWASP ZAP** | Proxy 掃描 | 開源的 Burp 替代品，整合自動化漏洞掃描功能。 | 使用 Quick Start 進行主動掃描或手動攔截。 | [官網](https://www.zaproxy.org/) |
| **sqlmap** | 自動化 SQLi | 自動識別並利用 SQL 注入漏洞取回資料庫資料。 | `sqlmap -u "URL" --dbs` 跑出資料庫名稱。 | [GitHub](https://www.google.com/search?q=%5Bhttps://github.com/sqlmapproject/sqlmap%5D(https://github.com/sqlmapproject/sqlmap)) |
| **DevTools** | 瀏覽器內建 | 檢查 HTML/JS、Network 與 Cookie。 | 按下 F12 觀察 Network 分頁的 API 請求。 | 內建 |
| **Web Academy** | 教學靶場 | PortSwigger 提供的免費互動式課程。 | 從 SQLi 或 XSS 基礎章節開始閱讀與實作。 | [PortSwigger](https://www.google.com/search?q=%5Bhttps://portswigger.net/web-security%5D(https://portswigger.net/web-security)) |

### Web 學習提示

* **順序建議**：先學會用 DevTools 觀察網頁行為，再學習使用 Burp Suite 修改請求。
* **核心觀念**：理解前端與後端的資料交換流程，以及如何繞過前端驗證。

---

## Crypto（密碼學 / 編碼）

對新手而言，這類題目多涉及編碼轉換與對稱加密。

| 工具 / 資源 | 類型 | 簡短說明 | 參考連結 |
| --- | --- | --- | --- |
| **CyberChef** | 資料轉換 | 強大的編碼/解碼工具（Base64, Hex, XOR, ROT）。 | [CyberChef](https://www.google.com/search?q=%5Bhttps://cyberchef.org/%5D(https://cyberchef.org/)) |
| **Hashcat** | 密碼破解 | 高效率的雜湊（Hash）爆破工具。 | [官網](https://hashcat.net/) |
| **CryptoHack** | 練習平台 | 從現代密碼學基礎開始教起的優質靶場。 | [CryptoHack](https://cryptohack.org/) |
| **dCode** | 線上解密 | 包含許多古典密碼（如凱薩、維吉尼亞）的自動解碼。 | [dCode](https://www.dcode.fr/) |

---

## Reverse（逆向 / 二進位）

逆向工程旨在分析程式的執行邏輯，通常需要理解組合語言。

| 工具 / 資源 | 類型 | 簡短說明 | 參考連結 |
| --- | --- | --- | --- |
| **Ghidra** | 反組譯器 | NSA 開源工具，能將機器碼還原成類 C 語言代碼。 | [GitHub](https://www.google.com/search?q=%5Bhttps://github.com/NationalSecurityAgency/ghidra%5D(https://github.com/NationalSecurityAgency/ghidra)) |
| **x64dbg** | 動態除錯 | Windows 平台下的除錯工具，可單步執行程式。 | [x64dbg](https://www.google.com/search?q=%5Bhttps://x64dbg.com/%5D(https://x64dbg.com/)) |
| **Cutter** | 逆向 GUI | 基於 radare2 的圖形化界面，適合新手上手。 | [GitHub](https://www.google.com/search?q=%5Bhttps://github.com/radareorg/radare2%5D(https://github.com/radareorg/radare2)) |
| **GDB** | Linux 除錯 | Linux 環境下標準的除錯程式。 | [GDB 官網](https://www.sourceware.org/gdb/) |

---

## Forensic（數位鑑識 / Stego）

鑑識題目包含圖片隱寫（Stego）、流量分析與檔案取證。

| 工具 / 資源 | 類型 | 簡短說明 | 常用指令範例 |
| --- | --- | --- | --- |
| **Aperi'Solve** | 線上分析 | 整合各種圖片隱寫分析工具的網頁平台。 | [Aperi'Solve](https://www.google.com/search?q=%5Bhttps://www.aperisolve.com/%5D(https://www.aperisolve.com/)) |
| **Wireshark** | 流量分析 | 分析 .pcap 封包，觀察網路傳輸內容。 | 搜尋 `http` 或 `tcp` 過濾。 |
| **Exiftool** | 中繼資料 | 檢視圖片或文件的 Metadata（如 GPS、作者）。 | `exiftool file.jpg` |
| **Binwalk** | 檔案提取 | 檢測並提取嵌入在檔案內部的隱藏資料。 | `binwalk -e file` |

---

## 練習網站與靶場推薦

依照難易度排列：

1. **picoCTF**：由 CMU 主辦，題型分類明確，最適合完全零基礎的新手。 [連結](https://www.google.com/search?q=%5Bhttps://www.picoctf.org/%5D(https://www.picoctf.org/))
2. **OverTheWire (Bandit)**：透過遊戲學習 Linux 基本指令，這是所有領域的基礎。 [連結](https://www.google.com/search?q=%5Bhttps://overthewire.org/wargames/%5D(https://overthewire.org/wargames/))
3. **TryHackMe**：提供引導式的 Room，會一步步教你如何操作工具。 [連結](https://www.google.com/search?q=%5Bhttps://tryhackme.com/%5D(https://tryhackme.com/))
4. **Hack The Box**：難度較高，適合有一定基礎後進行實戰滲透練習。 [連結](https://www.hackthebox.com/)

---

## 入門學習路線 (Roadmap)

### 第一階段：基礎加固

* 熟悉 Linux 基本指令（ls, cd, cat, grep, find）。
* 練習 OverTheWire 的 Bandit 系列至 Level 20。

### 第二階段：工具與 Web

* 學習使用 CyberChef 轉換編碼。
* 透過 picoCTF 練習 Web 與 General Skills 類別。
* 閱讀 PortSwigger 的 Web Security Academy 教材。

### 第三階段：進階實作

* 開始接觸 Ghidra 進行簡單的 Reverse 題目。
* 學習 Python 腳本編寫，自動化處理重複的 Crypto 或 Web 請求。

---

## 新手黃金法則

1. **不要直接看答案**：嘗試卡關 2 小時後再去看 Writeup（題解），並理解原理。
2. **保持紀錄**：將解題過程寫成筆記，這對學習 Reverse 與 Web 邏輯非常有幫助。
3. **法律邊界**：僅在合法授權的靶場練習，嚴禁攻擊真實未授權網站。

---

