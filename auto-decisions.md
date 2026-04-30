# Short Video Agent — Auto-Decision Matrix

เอกสารนี้เป็น reference สำหรับ agent ใช้ตัดสินใจเมื่อ user ไม่ได้ให้ข้อมูลมา

---

## Decision Flowchart

```
User Input เข้ามา
  │
  ├─ มี topic ไหม?
  │   ├─ มี → ใช้เลย
  │   └─ ไม่มี → มี assets (รูป/วิดีโอ) ไหม?
  │       ├─ มี → วิเคราะห์ assets แล้วคิด topic เอง
  │       └─ ไม่มี → ถาม user 1 คำถาม: "ต้องการวิดีโอเกี่ยวกับอะไร?"
  │
  ├─ มี script ไหม?
  │   ├─ มี → ใช้เลย
  │   └─ ไม่มี → generate_script(topic, style: short_form)
  │
  ├─ มี visual (รูป/วิดีโอ) ไหม?
  │   ├─ มีรูป → generate_video_clip(mode: image_to_video)
  │   ├─ มีวิดีโอ → ใช้เลย (ตัด/ปรับถ้าจำเป็น)
  │   └─ ไม่มี → generate_image → generate_video_clip
  │
  ├─ ต้องการเสียงพากย์ไหม?
  │   ├─ user ให้ voice_text มา → generate_voice
  │   ├─ มี script → generate_voice จาก script text
  │   └─ ไม่มี text เลย → ไม่ใส่เสียงพากย์ ใช้ text overlay + BGM
  │
  ├─ BGM
  │   └─ generate_bgm เสมอ (เลือก mood ตาม style)
  │
  ├─ Subtitle
  │   └─ generate_subtitle เสมอ (ไม่ต้องถาม)
  │
  └─ compose_video → ส่งผลลัพธ์
```

---

## Style Detection

เมื่อ user ไม่ระบุ style ให้วิเคราะห์จาก topic/content:

| Keywords ใน topic | Style ที่เลือก | Tone |
|---|---|---|
| สินค้า, ขาย, ราคา, โปร, sale, product | ad | excited |
| ตลก, ฮา, funny, meme, comedy | funny | casual |
| สอน, tips, วิธี, how to, trick | tips | friendly |
| เรื่องเล่า, story, เล่าให้ฟัง | story | dramatic |
| สวย, aesthetic, วิว, nature, travel | aesthetic | calm |
| แรงบันดาลใจ, motivate, inspire | inspiring | inspiring |
| ข่าว, update, ด่วน, breaking | dramatic | serious |
| อาหาร, ทำกิน, recipe, food | tips | friendly |
| ออกกำลังกาย, fitness, workout | energetic | excited |
| (ไม่ตรงกับอะไรเลย) | short_form | casual |

---

## Duration Calculation

เมื่อ user ไม่ระบุ duration:

| สถานการณ์ | Duration |
|---|---|
| มี script → คำนวณจาก text | ~150 คำ/นาที (TH), ~160 คำ/นาที (EN) |
| มีรูป N รูป | N × 4 วินาที (min 12, max 60) |
| มี voice_text สั้น (<50 คำ) | 15 วินาที |
| มี voice_text ยาว (>50 คำ) | คำนวณจาก text + 3 วินาที buffer |
| ไม่มีอะไรเลย | 20 วินาที |
| user บอก "สั้นๆ" | 10-15 วินาที |
| user บอก "ยาวหน่อย" | 45-60 วินาที |

**กฎเหล็ก: ห้ามเกิน 60 วินาที**

---

## Scene Planning

จำนวน scene ตาม duration:

| Duration | จำนวน Scene | วินาทีต่อ Scene |
|---|---|---|
| 10-15 วินาที | 3-4 | 3-4 |
| 16-30 วินาที | 5-8 | 3-4 |
| 31-45 วินาที | 8-12 | 3-4 |
| 46-60 วินาที | 12-15 | 3-4 |

**กฎ: ทุก scene ต้องไม่เกิน 5 วินาที** (คนเบื่อเร็วใน short form)

Scene แรก (Hook) ควรสั้นที่สุด: 2-3 วินาที

---

## Text Overlay Rules

เมื่อไหร่ใส่ text overlay:

| สถานการณ์ | ใส่ Text Overlay? | Style |
|---|---|---|
| มีเสียงพากย์ | ใส่ subtitle (word_by_word) | bold, bottom |
| ไม่มีเสียงพากย์ | ใส่ text หลักของแต่ละ scene | bold, center, large |
| Hook scene | ใส่เสมอ (ข้อความดึงดูด) | bold, center, xlarge |
| CTA scene | ใส่เสมอ | bold, bottom |
| มีตัวเลข/สถิติ | ใส่ตัวเลขใหญ่ๆ | bold, center, xlarge |

Text overlay style ตาม video style:

| Video Style | Text Style | Color |
|---|---|---|
| funny | bold + shadow | #FFFFFF |
| dramatic | outline | #FFFFFF |
| aesthetic | default (thin) | #FFFFFF หรือ pastel |
| ad/product | bold + neon | brand color หรือ #FFD700 |
| tips | bold | #FFFFFF |
| default | bold | #FFFFFF |

---

## BGM Volume Rules

| สถานการณ์ | BGM Volume |
|---|---|
| มีเสียงพากย์ | 0.2-0.3 |
| ไม่มีเสียงพากย์ มี text overlay | 0.6-0.8 |
| ไม่มีเสียงพากย์ ไม่มี text | 0.8-1.0 |
| Scene ที่มี sound effect | ลด BGM เหลือ 0.1 ชั่วคราว |

---

## Motion Type Rotation

เพื่อไม่ให้วิดีโอน่าเบื่อ สลับ motion_type ทุก scene:

```
Scene 1 (Hook):  dynamic หรือ zoom_in
Scene 2:         pan_left
Scene 3:         zoom_out
Scene 4:         pan_right
Scene 5:         zoom_in
Scene 6:         dynamic
...วนซ้ำ
```

ถ้า video style เป็น aesthetic → ใช้ slow motion ทั้งหมด (static หรือ slow zoom)

---

## Hashtag Generation

เมื่อ user ไม่ให้ hashtags มา ให้ generate เอง:

- 3-5 hashtags ต่อวิดีโอ
- ผสมระหว่าง:
  - 1-2 hashtags เฉพาะ topic (เช่น #รีวิวรองเท้า)
  - 1-2 hashtags กว้าง (เช่น #รีวิว #แนะนำ)
  - 1 hashtag trending/platform (เช่น #fyp #foryou #viral)
- ภาษาตาม content
