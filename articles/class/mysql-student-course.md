# MySQL 入門：學生選課系統實作筆記

這份筆記會帶你從零開始，建立一個可以處理「學生、課程、選課關係」的資料庫。

## 0. 開始之前：進到你的資料庫

在下任何指令前，你要先告訴電腦你要在哪個資料庫工作。

```sql
-- 如果還沒建立資料庫，先執行這一行：
CREATE DATABASE demo;

-- 指定使用這個資料庫：
USE demo;

```

## 1. 建立表格（定義遊戲規則）

我們要建三張表。想像這是在設計 Excel 的分頁，但我們多加了一些「規則」來防止出錯。

### A. 學生表 (`students`)

```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY, -- 自動幫學生編號，不可重複
  name VARCHAR(50) NOT NULL,        -- 名字，一定要填
  age INT                           -- 年齡
);

```

### B. 課程表 (`courses`)

```sql
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY, -- 課程編號
  name VARCHAR(50) NOT NULL,         -- 課名
  capacity INT NOT NULL              -- 人數上限（這很重要）
);

```

### C. 選課紀錄表 (`enrollments`)

這張表最特別，它不存學生的名字，只存「學生編號」跟「課程編號」。

```sql
CREATE TABLE enrollments (
  student_id INT NOT NULL,
  course_id  INT NOT NULL,
  PRIMARY KEY (student_id, course_id), -- 這行保證同一個人不能重複選同一門課兩次
  -- 以下這兩行是「保險」，確保學生編號和課程編號真的存在於上面兩張表
  CONSTRAINT fk_enroll_student FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_enroll_course  FOREIGN KEY (course_id)  REFERENCES courses(id)
);

```

---

## 2. 放入初始資料

表建好了，我們要塞入一些練習用的內容。

```sql
-- 新增兩位學生
INSERT INTO students (name, age) VALUES ('tim', 18), ('hus', 17);

-- 新增兩門課（微積分收 11 人，統計學收 13 人）
INSERT INTO courses (name, capacity) VALUES ('Calculus', 11), ('Statistics', 13);

-- 開始選課
-- 讓 tim (id 1) 選兩門課；hus (id 2) 只選統計學
INSERT INTO enrollments (student_id, course_id) VALUES (1, 1), (1, 2), (2, 2);

```

---

## 3. 怎麼查資料？（常見查詢）

資料塞進去後，最難的就是怎麼把它們「串起來」看。

### 查詢誰選了什麼課

因為資料分散在三張表，所以我們要用 `JOIN` 把他們連起來。

```sql
SELECT s.name AS 學生姓名, c.name AS 選修科目
FROM enrollments e
JOIN students s ON e.student_id = s.id
JOIN courses  c ON e.course_id  = c.id;

```

### 查詢課程還剩多少名額

這對選課系統最重要。我們用總名額減掉目前已選人數。

```sql
SELECT c.name AS 課程, 
       c.capacity AS 總人數,
       COUNT(e.student_id) AS 已選人數,
       (c.capacity - COUNT(e.student_id)) AS 剩餘名額
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id;

```

**小知識：** 這裡用 `LEFT JOIN` 是為了讓「沒人選的課」也會出現在清單上，而不是直接消失。

---

## 4. 維護與重來（刪除資料）

如果你想清空資料重練，要注意順序。

**關鍵：要先刪「關聯表」，再刪「主表」。**
因為 `enrollments` 參考了學生和課程，如果你先把學生刪了，`enrollments` 裡的紀錄就會找不到人，電腦會報錯。

```sql
-- 1. 先清空選課紀錄
TRUNCATE TABLE enrollments;
-- 2. 再清空課程和學生
TRUNCATE TABLE courses;
TRUNCATE TABLE students;

```

---

## 5. 給新手的檢查小清單

如果你不確定現在情況，可以用這些指令：

* `SHOW TABLES;` ：看一下現在有幾張表。
* `DESCRIBE students;` ：看一下學生表的欄位長什麼樣子。
* `SELECT * FROM students;` ：直接把學生表的內容全列出來看。

### 給 Mac 使用者的貼心提醒

如果你是用 Homebrew 安裝的，想確認 MySQL 有沒有在跑，請在終端機輸入：
`brew services list | grep mysql`

---
