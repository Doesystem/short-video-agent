# Short Video Agent — Tools Definition

Tools ชุดเดียวกับ Video Producer Agent แต่ปรับ default ให้เหมาะกับ short form 9:16
ทุก tool ไม่มี field ไหน required — ถ้าไม่ได้รับค่า ให้ agent ตัดสินใจเอง

---

## Content Generation

### generate_script

```yaml
name: generate_script
description: สร้าง script วิดีโอสั้น เน้น hook แรง เนื้อหากระชับ
input:
  topic: string — หัวข้อ (ถ้าไม่มี ดูจาก context/assets)
  duration: number (default: 20) — ความยาวเป้าหมายเป็นวินาที (10-60)
  style: enum (default: "short_form") — [short_form, review, ad, story, tips, funny, dramatic]
  language: string (default: "th")
  tone: string (default: "casual") — [casual, funny, dramatic, inspiring, professional]
  key_points: string[] — ประเด็นที่ต้องมี (ถ้าไม่มี คิดเอง)
  target_audience: string — กลุ่มเป้าหมาย (ถ้าไม่มี ใช้ general)
output:
  title: string
  total_duration: number
  scenes:
    - scene_number: number
      text: string
      visual_description: string
      duration: number (ไม่เกิน 5 วินาทีต่อ scene)
      notes: string
  suggested_hashtags: string[] — hashtags ที่แนะนำ
  hook_text: string — ข้อความ hook สำหรับ 3 วินาทีแรก
```

### generate_subtitle

```yaml
name: generate_subtitle
description: สร้าง subtitle สำหรับวิดีโอสั้น (ใส่เสมอ ไม่ต้องถาม)
input:
  source_type: enum (default: "text") — [audio_url, text]
  source: string — URL ของ audio หรือ text
  language: string (default: "th")
  style: enum (default: "word_by_word") — [standard, karaoke, word_by_word]
output:
  subtitle_data:
    - start_time: number
      end_time: number
      text: string
  srt_url: string
```

**Note:** Short form ใช้ style: word_by_word เป็น default เพราะดู engaging กว่า

---

## Visual Generation

### generate_image

```yaml
name: generate_image
description: สร้างรูปภาพแนวตั้ง 9:16 สำหรับวิดีโอสั้น
input:
  prompt: string — คำอธิบายรูป (ถ้าไม่มี ใช้ visual_description จาก script)
  style: enum (default: "realistic") — [realistic, anime, cartoon, 3d, cinematic, aesthetic, neon, minimal]
  aspect_ratio: enum (fixed: "9:16") — ล็อคเป็น 9:16 เสมอ
  reference_image_url: string — รูป reference
  negative_prompt: string — สิ่งที่ไม่ต้องการ
output:
  image_url: string
  width: 1080
  height: 1920
  revised_prompt: string
```

### generate_video_clip

```yaml
name: generate_video_clip
description: สร้าง video clip สั้นแนวตั้ง
input:
  mode: enum (default: "text_to_video") — [text_to_video, image_to_video]
  prompt: string — คำอธิบาย motion/action
  image_url: string — ใช้ถ้า mode = image_to_video
  duration: number (default: 4) — ความยาว 3-5 วินาที (ห้ามเกิน 5)
  aspect_ratio: enum (fixed: "9:16")
  motion_type: enum (default: "dynamic") — [zoom_in, zoom_out, pan_left, pan_right, static, dynamic]
output:
  clip_url: string
  duration: number
  thumbnail_url: string
```

**Note:** Short form ใช้ motion_type: dynamic เป็น default เพราะต้องดูมีพลัง

---

## Audio Generation

### generate_voice

```yaml
name: generate_voice
description: สร้างเสียงพากย์สำหรับวิดีโอสั้น
input:
  text: string — ข้อความที่ต้องการพากย์
  voice_id: string (default: auto-select ตาม language + style)
  speed: number (default: 1.15) — ความเร็ว 1.0-1.5 (เร็วกว่าปกติ)
  emotion: enum (default: "excited") — [neutral, happy, sad, excited, serious, friendly]
  language: string (default: "th")
output:
  audio_url: string
  duration: number
  sample_rate: number
```

**Note:** Default speed 1.15 เพราะ short form ต้องเร็วกว่า long form

### generate_bgm

```yaml
name: generate_bgm
description: สร้าง background music สำหรับวิดีโอสั้น
input:
  mood: enum (default: "energetic") — [upbeat, calm, dramatic, funny, inspiring, sad, energetic, chill, dark, epic]
  duration: number — ความยาว (ถ้าไม่ระบุ ใช้ตาม video duration)
  genre: enum (default: "pop") — [pop, lofi, cinematic, electronic, acoustic, trap, edm, ambient]
  tempo: enum (default: "fast") — [slow, medium, fast]
  has_vocal: boolean (default: false)
output:
  audio_url: string
  duration: number
  bpm: number
```

### generate_sound_effect

```yaml
name: generate_sound_effect
description: สร้าง sound effect
input:
  description: string — คำอธิบาย เช่น "whoosh", "ding", "bass drop"
  duration: number (default: 1) — ความยาว 0.5-5 วินาที
output:
  audio_url: string
  duration: number
```

---

## Assembly

### compose_video

```yaml
name: compose_video
description: ประกอบวิดีโอสั้นแนวตั้ง 9:16
input:
  scenes:
    - clip_url: string — URL ของ video clip หรือ image
      audio_url: string — เสียงพากย์ (ถ้ามี)
      subtitle: string — ข้อความ subtitle
      duration: number — ความยาว (ไม่เกิน 5 วินาที)
      transition: enum (default: "cut") — [cut, fade, slide, zoom]
      text_overlay:
        text: string
        position: enum (default: "center") — [top, center, bottom]
        style: enum (default: "bold") — [default, bold, outline, shadow, neon, glitch]
        font_size: enum (default: "large") — [small, medium, large, xlarge]
        color: string (default: "#FFFFFF")
      sound_effect_url: string — sound effect สำหรับ scene นี้
  bgm_url: string — background music
  bgm_volume: number (default: 0.3 ถ้ามี voice, 0.7 ถ้าไม่มี voice)
  aspect_ratio: enum (fixed: "9:16")
  output_quality: enum (default: "1080p") — [720p, 1080p]
  # ไม่มี intro/outro เป็น default
  intro_template_id: string — ใส่เฉพาะเมื่อ user ขอ
  outro_template_id: string — ใส่เฉพาะเมื่อ user ขอ
output:
  video_url: string
  duration: number
  file_size: number
  thumbnail_url: string
```

### apply_template

```yaml
name: apply_template
description: ใช้ template สำเร็จรูปสร้าง clip แนวตั้ง
input:
  template_id: string
  variables: object
  duration: number
output:
  clip_url: string
  duration: number
  thumbnail_url: string
```

---

## Utility

### list_templates

```yaml
name: list_templates
description: ดูรายการ template (filter เฉพาะ 9:16)
input:
  category: enum — [transition, text_overlay, product_showcase, countdown, before_after]
output:
  templates:
    - id: string
      name: string
      category: string
      preview_url: string
      duration: number
      variables_needed: string[]
```

### list_voices

```yaml
name: list_voices
description: ดูรายการ AI voice
input:
  language: string
  gender: enum — [male, female]
output:
  voices:
    - id: string
      name: string
      language: string
      gender: string
      sample_url: string
      description: string
```

### get_usage

```yaml
name: get_usage
description: เช็ค quota
input: none
output:
  plan: string
  credits_used: number
  credits_limit: number
  credits_remaining: number
```

---

## Auto-Select Voice Table

เมื่อ user ไม่ระบุ voice_id ให้เลือกตามนี้:

| Language | Style | Voice ID |
|---|---|---|
| th | casual/default | th-female-01 |
| th | funny/entertainment | th-female-03 |
| th | professional | th-female-02 |
| th | dramatic/cinematic | th-male-02 |
| th | friendly/tips | th-male-01 |
| th | energetic/ad | th-male-03 |
| en | casual/default | en-female-01 |
| en | professional | en-female-02 |
| en | energetic/ad | en-male-01 |
| en | dramatic | en-male-02 |

## Auto-Select BGM Table

เมื่อ user ไม่ระบุ mood/genre:

| Video Style | Mood | Genre | Tempo |
|---|---|---|---|
| funny | upbeat | pop | fast |
| dramatic | dramatic | cinematic | medium |
| aesthetic | chill | lofi | slow |
| product/ad | energetic | electronic | fast |
| tips/educational | calm | ambient | medium |
| inspiring | inspiring | acoustic | medium |
| story | dramatic | cinematic | slow |
| default | energetic | pop | fast |
