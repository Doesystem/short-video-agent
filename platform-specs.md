# Short Video Agent — Platform Specifications (9:16 Only)

เฉพาะ platform ที่รองรับวิดีโอแนวตั้ง 9:16

---

## Platform Requirements

### TikTok
- **Aspect Ratio:** 9:16
- **Resolution:** 1080x1920
- **Max Duration:** 10 นาที (แนะนำ 15-60 วินาที)
- **Max File Size:** 287.6 MB (mobile), 500 MB (web)
- **Format:** MP4
- **Caption Max Length:** 2200 characters
- **Hashtags:** แนะนำ 3-5 hashtags
- **หมายเหตุ:**
  - Hook ใน 1-2 วินาทีแรก สำคัญที่สุด
  - เสียงสำคัญมาก (BGM + voice)
  - Text overlay ช่วยเพิ่ม watch time
  - วิดีโอ 15-30 วินาทีมี engagement สูงสุด

### YouTube Shorts
- **Aspect Ratio:** 9:16
- **Resolution:** 1080x1920
- **Max Duration:** 60 วินาที
- **Format:** MP4 (H.264)
- **Title Max Length:** 100 characters
- **หมายเหตุ:**
  - ไม่ต้อง intro/outro
  - Hook ใน 3 วินาทีแรก
  - Title สำคัญสำหรับ SEO
  - ใส่ #Shorts ใน title หรือ description

### Instagram Reels
- **Aspect Ratio:** 9:16
- **Resolution:** 1080x1920
- **Max Duration:** 90 วินาที
- **Max File Size:** 4 GB
- **Format:** MP4 (H.264)
- **Caption Max Length:** 2200 characters
- **Hashtags:** แนะนำ 5-10 hashtags
- **หมายเหตุ:**
  - Visual quality สำคัญมาก (Instagram เน้น aesthetic)
  - Trending audio ช่วย reach
  - Cover image สำคัญ (จะแสดงใน profile grid)

### Facebook Reels
- **Aspect Ratio:** 9:16
- **Resolution:** 1080x1920
- **Max Duration:** 90 วินาที
- **Format:** MP4
- **หมายเหตุ:**
  - คล้าย Instagram Reels
  - คนดูแบบ mute เยอะ ต้องใส่ subtitle
  - กลุ่มเป้าหมายอายุมากกว่า TikTok

---

## Platform Comparison

| | TikTok | YouTube Shorts | Instagram Reels | Facebook Reels |
|---|---|---|---|---|
| Max Duration | 10 นาที | 60 วินาที | 90 วินาที | 90 วินาที |
| Sweet Spot | 15-30 วินาที | 15-45 วินาที | 15-60 วินาที | 15-60 วินาที |
| Hook Time | 1-2 วินาที | 3 วินาที | 2-3 วินาที | 2-3 วินาที |
| Subtitle | แนะนำอย่างยิ่ง | แนะนำ | แนะนำ | จำเป็น |
| Hashtags | 3-5 | ใส่ #Shorts | 5-10 | 3-5 |
| Audio | สำคัญมาก | สำคัญ | สำคัญมาก | ปานกลาง |
| Visual Quality | ปานกลาง | ปานกลาง | สูง | ปานกลาง |

---

## Cross-Platform Tips

### วิดีโอเดียวลงได้ทุก platform ถ้า:
- Aspect ratio: 9:16
- Duration: ไม่เกิน 60 วินาที (limit ของ YouTube Shorts)
- มี subtitle
- ไม่มี watermark ของ platform อื่น (TikTok watermark ลง IG จะถูกลด reach)

### ปรับเล็กน้อยตาม platform:
| สิ่งที่ปรับ | TikTok | YouTube Shorts | Instagram Reels |
|---|---|---|---|
| Caption/Title | ใส่ hashtags ใน caption | ใส่ #Shorts ใน title | ใส่ hashtags ใน caption |
| CTA | "Follow for more" | "Subscribe" | "Follow + Save" |
| Hashtag style | #fyp #foryou | #Shorts | #reels #explore |

---

## Safe Zone

พื้นที่ปลอดภัยที่ text/content สำคัญไม่ถูก UI ของ platform บัง:

```
┌──────────────────┐
│   ⚠️ Username     │ ← ด้านบน: หลีกเลี่ยง text ตรงนี้
│   area            │
│                   │
│                   │
│  ✅ SAFE ZONE     │ ← กลางจอ: ปลอดภัยที่สุด
│  สำหรับ text      │
│  สำคัญ            │
│                   │
│                   │
│   ⚠️ Like/Comment │ ← ด้านขวาล่าง: มีปุ่ม like/comment/share
│   buttons         │
│   ⚠️ Caption area │ ← ด้านล่าง: มี caption/description
└──────────────────┘
```

**กฎ:**
- Text overlay สำคัญ → วางกลางจอ (position: center)
- Subtitle → วางด้านล่างแต่ไม่ต่ำเกินไป (เว้นจาก bottom ~15%)
- ห้ามวาง text สำคัญที่มุมขวาล่าง (ถูกปุ่ม like/share บัง)
- ห้ามวาง text สำคัญที่ด้านล่างสุด (ถูก caption บัง)
