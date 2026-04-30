# Short Video Agent — Error Handling

## หลักการ

Short Video Agent ต้อง **ไม่หยุดทำงาน** ถ้าเป็นไปได้ ให้ใช้ fallback แล้วทำต่อ
แจ้ง user สั้นๆ ว่าปรับอะไร ไม่ต้องอธิบายยาว

---

## Fallback Chain

เมื่อ tool ล้มเหลว ให้ลองตามลำดับ:

### generate_script ล้มเหลว
```
1. ลอง generate ใหม่ด้วย prompt ที่สั้นลง
2. ถ้ายังไม่ได้ → สร้าง script ง่ายๆ เอง:
   - Scene 1: Hook (text overlay ของ topic)
   - Scene 2-3: Visual + text overlay
   - Scene 4: CTA
3. ทำต่อด้วย script ง่ายๆ นี้
```

### generate_image ล้มเหลว
```
1. ปรับ prompt ให้สั้น/เรียบง่ายขึ้น
2. เปลี่ยน style (เช่น realistic → flat_design)
3. ถ้ายังไม่ได้ → ใช้ solid color background + text overlay แทน
4. ทำต่อ
```

### generate_video_clip ล้มเหลว
```
1. ถ้า image_to_video ไม่ได้ → ใช้รูป static + motion ใน compose_video
2. ถ้า text_to_video ไม่ได้ → generate_image ก่อน แล้วใช้ image_to_video
3. ถ้าทั้งสองไม่ได้ → ใช้ template แทน
4. ทำต่อ
```

### generate_voice ล้มเหลว
```
1. ลอง voice_id อื่น
2. ลอง speed ปกติ (1.0)
3. ถ้ายังไม่ได้ → ข้ามเสียงพากย์ ใช้ text overlay + BGM ดังขึ้น
4. ทำต่อ
```

### generate_bgm ล้มเหลว
```
1. ลอง mood/genre อื่น
2. ถ้ายังไม่ได้ → ประกอบวิดีโอโดยไม่มี BGM
3. แจ้ง user: "ไม่สามารถสร้าง BGM ได้ วิดีโอจะมีแค่เสียงพากย์"
```

### compose_video ล้มเหลว
```
1. ลด output_quality เป็น 720p
2. ลดจำนวน scenes (ตัด scene ที่ไม่สำคัญออก)
3. ถ้ายังไม่ได้ → แจ้ง user พร้อมบอกว่าทำถึงขั้นตอนไหนแล้ว
```

---

## Quota Errors

```
Credits หมด:
→ แจ้ง: "Credits หมดแล้ว เหลือ 0/X ครั้ง จะ reset [date]"
→ ไม่ต้องเสนอทางเลือก แค่แจ้ง

Rate Limit:
→ รอ retry-after แล้วลองใหม่อัตโนมัติ
→ ไม่ต้องแจ้ง user ถ้า retry สำเร็จ
```

---

## Quality Recovery

```
User บอก "ไม่ชอบ" / "ปรับหน่อย":
→ ถาม 1 คำถาม: "ต้องการปรับอะไร?"
→ Regenerate เฉพาะส่วนที่ต้องแก้
→ ไม่ทำใหม่ทั้งหมด

User บอก "ทำใหม่":
→ ทำใหม่ทั้งหมดด้วย parameter ต่างจากเดิม
→ เปลี่ยน style/voice/bgm ให้ต่างจากรอบแรก
```
