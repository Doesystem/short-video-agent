# Short Video Agent — Templates (9:16 Only)

เฉพาะ template ที่รองรับ 9:16 สำหรับ short form video

---

## Text & Hook Templates

### hook_question
- **ID:** `hook_question`
- **Duration:** 3 วินาที
- **Variables:**
  - `question` (string) — คำถาม hook เช่น "รู้ไหมว่า...?"
  - `color_primary` (string, optional)
- **Description:** แสดงคำถามตัวใหญ่กลางจอ พร้อม bounce animation ดึงดูดความสนใจ

### hook_statement
- **ID:** `hook_statement`
- **Duration:** 3 วินาที
- **Variables:**
  - `statement` (string) — ข้อความ hook เช่น "3 สิ่งที่คุณต้องรู้"
  - `emoji` (string, optional) — emoji ประกอบ
- **Description:** ข้อความ bold กลางจอ พร้อม shake animation

### text_reveal
- **ID:** `text_reveal`
- **Duration:** 4 วินาที
- **Variables:**
  - `text` (string) — ข้อความที่จะเฉลย
  - `label` (string, optional) — label เล็กๆ ด้านบน เช่น "คำตอบคือ..."
- **Description:** ข้อความค่อยๆ ปรากฏ (reveal animation)

### countdown_list
- **ID:** `countdown_list`
- **Duration:** 4 วินาที
- **Variables:**
  - `number` (string) — เลข countdown เช่น "3", "2", "1"
  - `text` (string) — ข้อความประกอบ
  - `image_url` (string, optional) — รูปประกอบ
- **Description:** แสดงเลข countdown ใหญ่ๆ + ข้อความ เหมาะกับ "Top 3...", "5 เหตุผล..."

---

## Product Templates

### product_showcase_vertical
- **ID:** `product_showcase_vertical`
- **Duration:** 5 วินาที
- **Variables:**
  - `image_url` (string) — รูปสินค้า
  - `product_name` (string)
  - `price` (string, optional)
  - `badge` (string, optional) — "NEW", "SALE", "HOT"
  - `color_primary` (string, optional)
- **Description:** โชว์สินค้าแนวตั้ง รูปใหญ่ + ข้อมูลด้านล่าง

### price_reveal
- **ID:** `price_reveal`
- **Duration:** 4 วินาที
- **Variables:**
  - `original_price` (string)
  - `sale_price` (string)
  - `discount` (string) — เช่น "-50%"
- **Description:** แสดงราคาเดิมขีดฆ่า แล้วเฉลยราคาใหม่ พร้อม confetti effect

### before_after_vertical
- **ID:** `before_after_vertical`
- **Duration:** 5 วินาที
- **Variables:**
  - `before_image_url` (string)
  - `after_image_url` (string)
  - `before_label` (string, optional, default: "Before")
  - `after_label` (string, optional, default: "After")
- **Description:** Before/After แนวตั้ง slide reveal จากบนลงล่าง

---

## CTA Templates

### cta_follow
- **ID:** `cta_follow`
- **Duration:** 3 วินาที
- **Variables:**
  - `username` (string) — @username
  - `cta_text` (string, optional, default: "Follow for more")
- **Description:** CTA ให้ follow พร้อม animation ชี้ไปที่ปุ่ม follow

### cta_link
- **ID:** `cta_link`
- **Duration:** 3 วินาที
- **Variables:**
  - `cta_text` (string) — เช่น "กดลิงก์ด้านล่าง"
  - `arrow_direction` (string, optional, default: "down")
- **Description:** CTA ชี้ไปที่ bio link พร้อม arrow animation

### cta_comment
- **ID:** `cta_comment`
- **Duration:** 3 วินาที
- **Variables:**
  - `question` (string) — คำถามให้ comment เช่น "คุณชอบอันไหน?"
- **Description:** CTA ให้ comment พร้อม comment icon animation

---

## Transition Templates

### swipe_transition
- **ID:** `swipe_transition`
- **Duration:** 0.5 วินาที
- **Variables:** none
- **Description:** Swipe transition แนวตั้ง เหมือนเลื่อน TikTok

### glitch_transition
- **ID:** `glitch_transition`
- **Duration:** 0.3 วินาที
- **Variables:** none
- **Description:** Glitch effect transition

### zoom_transition
- **ID:** `zoom_transition`
- **Duration:** 0.5 วินาที
- **Variables:** none
- **Description:** Zoom in เร็วๆ แล้วตัดไป scene ถัดไป

---

## Template Selection Guide

| ประเภทวิดีโอ | Hook | Content | CTA |
|---|---|---|---|
| Product review | hook_question | product_showcase_vertical | cta_link |
| Tips/How-to | hook_statement | countdown_list | cta_follow |
| Before/After | hook_question | before_after_vertical | cta_comment |
| Sale/Promo | hook_statement | price_reveal | cta_link |
| Story/Narrative | hook_statement | (ใช้ generated clips) | cta_follow |
| Funny/Entertainment | hook_question | (ใช้ generated clips) | cta_comment |
