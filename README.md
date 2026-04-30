# Short Video Agent

AI Agent เฉพาะทางสำหรับสร้างวิดีโอสั้นแนวตั้ง 9:16 (TikTok / Instagram Reels / YouTube Shorts)

## Overview

Short Video Agent ออกแบบมาให้ใช้งานง่ายที่สุด user ให้ input น้อยแค่ไหนก็ได้ agent จะคิดส่วนที่เหลือเองทั้งหมด ไม่ถามเยอะ ลงมือทำเลย

## Features

- **Zero-config** — ไม่มี input ไหน required ให้มาแค่ topic ก็ทำได้
- **Auto-decision** — ไม่มี script? เขียนเอง ไม่มีรูป? generate เอง ไม่ระบุเสียง? เลือกเอง
- **9:16 only** — ล็อค aspect ratio แนวตั้ง ไม่ต้องคิดเรื่อง format
- **Max 60 วินาที** — ทุกอย่างกระชับ เร็ว ดึงดูด
- **Subtitle เสมอ** — ใส่ให้อัตโนมัติ เพราะคนดูแบบ mute
- **Cross-platform** — วิดีโอเดียวลงได้ทั้ง TikTok, Reels, Shorts

## File Structure

```
short-video-agent-docs/
├── README.md               ← ไฟล์นี้
├── skill.md                ← สรุป capabilities สำหรับ LLM orchestrator
├── system-prompt.md        ← System prompt (role, behavior, auto-decision rules)
├── tools.md                ← Tool definitions ปรับ default สำหรับ short form
├── auto-decisions.md       ← Decision matrix เมื่อ user ไม่ให้ข้อมูล
├── templates.md            ← Template เฉพาะ 9:16
├── voices.md               ← Voice catalog ปรับ guide สำหรับ short form
├── platform-specs.md       ← Spec เฉพาะ platform 9:16 + safe zone
└── error-handling.md       ← Fallback strategy ไม่หยุดทำงาน
```

## How It Works

```
User: "ทำวิดีโอเรื่องแมว"
          │
          ▼
  ┌─ Agent คิดเอง ──────────────┐
  │ topic: แมว                   │
  │ style: cute/funny (auto)     │
  │ duration: 20s (auto)         │
  │ voice: th-female-03 (auto)   │
  │ bgm: upbeat/fast (auto)     │
  │ subtitle: yes (always)       │
  └──────────┬───────────────────┘
             │
  ┌──────────┼──────────────┐
  ▼          ▼              ▼
script → images/clips → voice + bgm
  │          │              │
  └──────────┼──────────────┘
             ▼
      compose_video (9:16)
             │
             ▼
    วิดีโอสำเร็จรูป 🎬
```

## Input Examples

agent รับ input อะไรก็ได้ ไม่มี required:

| User ให้มา | Agent ทำ |
|---|---|
| แค่ topic | คิดทุกอย่างเอง แล้วทำเลย |
| รูป 3 รูป | วิเคราะห์รูป → คิด topic/script → ทำเลย |
| script สำเร็จ | ใช้ script นั้น → generate visual + audio → ทำเลย |
| แค่ style ("aesthetic") | ถามแค่ topic 1 คำถาม แล้วทำเลย |
| ครบทุกอย่าง | ใช้ตามที่ให้มา ไม่ต้องคิดเอง |

## Usage

### สำหรับ AI Agent Runtime

1. โหลด `system-prompt.md` + `tools.md` + `auto-decisions.md` ทุกครั้ง
2. โหลด `voices.md`, `templates.md`, `platform-specs.md` เมื่อจำเป็น
3. โหลด `error-handling.md` แนบตลอดหรือเมื่อเกิด error

### Token Budget

| ไฟล์ | โหลดเมื่อ | ขนาดโดยประมาณ |
|---|---|---|
| system-prompt.md | ทุกครั้ง | ~1000 tokens |
| tools.md | ทุกครั้ง | ~1200 tokens |
| auto-decisions.md | ทุกครั้ง | ~800 tokens |
| templates.md | เมื่อต้องเลือก template | ~600 tokens |
| voices.md | เมื่อต้องเลือกเสียง | ~400 tokens |
| platform-specs.md | เมื่อระบุ platform | ~500 tokens |
| error-handling.md | เมื่อเกิด error | ~400 tokens |

**Core (โหลดทุกครั้ง): ~3000 tokens** — เล็กพอที่จะส่งทั้งหมดได้

## Differences from Video Producer Agent

| | Video Producer Agent | Short Video Agent |
|---|---|---|
| ถาม user | ถามให้ชัดก่อนทำ | ไม่ถาม ทำเลย |
| Aspect ratio | เลือกได้ | 9:16 เท่านั้น |
| Duration | ไม่จำกัด (สูงสุด 10 นาที) | สูงสุด 60 วินาที |
| Intro/Outro | ใส่ได้ | ไม่ใส่ (ยกเว้น user ขอ) |
| Required fields | มี required | ไม่มี required เลย |
| Recipes | โหลดตาม context | ไม่ต้อง มี auto-decisions แทน |
| Subtitle | ถาม user | ใส่เสมอ |
| Transition | เลือกได้ | cut เป็น default |

## Related

- [Video Producer Agent](../video-agent-docs/) — agent ตัวเต็มสำหรับวิดีโอทุกประเภท
