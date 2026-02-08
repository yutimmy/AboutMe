# 文章維護指南

說明如何在本站新增或刪除文章，適用於四個分類：`ctf`、`zeroday`、`reading`、`class`。

## 新增文章
1. **挑分類**：決定要放到哪個資料夾  
   - CTF 解題：`articles/ctf/`  
   - ZeroDay 漏洞：`articles/zeroday/`  
   - 讀書心得：`articles/reading/`  
   - 上課筆記：`articles/class/`
2. **建立 Markdown**：在對應資料夾新增一個 `.md` 檔，例如 `my-first-ctf.md`。
3. **編輯內容**：用 Markdown 撰寫全文；若有程式碼使用三反引號區塊。
4. **更新設定檔**：開啟 `articles/config.json`，在對應陣列尾端加入一筆物件：
   ```json
   {
     "id": "my-first-ctf",
     "file": "my-first-ctf.md",
     "title": "My First CTF",
     "type": "Web",
     "preview": "這題主要利用 SQLi 取得 flag..."
   }
   ```
   - `id`：唯一識別，建議與檔名一致（不含副檔名）。  
   - `file`：檔名。  
   - `title`：列表顯示的標題。  
   - `type`：分類標籤（例如 Web、Pwn、XSS、Database）。  
   - `preview`：列表摘要。  
   - `reading` 類型可再加 `author`、`readTime` 欄位。
5. **儲存並測試**：重新載入網頁確認列表與彈窗內容正常。

## 刪除文章
1. 在 `articles/config.json` 中移除對應分類裡的那一筆物件。
2. 刪除對應資料夾中的 Markdown 檔案（可留存備份則不刪）。
3. 重新載入網頁，確認列表已不再出現該文章。

> 注意：側邊欄統計數字目前是寫死在 `index.html`，若需同步更新請手動修改。***
