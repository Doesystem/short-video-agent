import type { Context } from "@lifetimesoft/agent-sdk"
import type { Tone } from "./generateScript"
import type { VideoStyle } from "./generateVideo"

export interface GenerateTopicInput {
    tone: Tone
    style: VideoStyle
    category?: string  // optional hint เช่น "การเงิน", "สุขภาพ", "เทคโนโลยี"
}

export interface TopicResult {
    topic: string
    reason: string  // เหตุผลที่ AI เลือกหัวข้อนี้
}

const SYSTEM_PROMPT = `คุณคือผู้เชี่ยวชาญด้านคอนเทนต์วิดีโอสั้นที่ viral บน TikTok, YouTube Shorts และ Facebook Reels
มีหน้าที่คิดหัวข้อวิดีโอสั้นที่น่าสนใจ มีโอกาส viral สูง เหมาะกับโทนและสไตล์ที่กำหนด

เกณฑ์หัวข้อที่ดี:
- ตอบโจทย์ความอยากรู้ หรือแก้ปัญหาที่คนส่วนใหญ่เจอ
- กระชับ เข้าใจง่ายใน 1-2 ประโยค
- มีตัวเลขหรือ list ถ้าเหมาะสม เช่น "5 วิธี..." หรือ "ทำไมคนส่วนใหญ่..."
- เหมาะกับวิดีโอสั้น 30-60 วินาที

ตอบกลับเป็น JSON เท่านั้น ไม่มีข้อความอื่น:
{"topic":"...","reason":"..."}`

export async function generateTopic(
    input: GenerateTopicInput,
    ctx: Context
): Promise<TopicResult> {
    ctx.log.info(`[generate_topic] tone: ${input.tone}, style: ${input.style}, category: ${input.category ?? "ทั่วไป"}`)

    const categoryHint = input.category
        ? `หมวดหมู่ที่ต้องการ: ${input.category}`
        : "หมวดหมู่: เลือกได้อิสระ เน้นที่ viral และเป็นประโยชน์"

    const response = await ctx.ai.chat({
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: `โทน: ${input.tone}\nสไตล์วิดีโอ: ${input.style}\n${categoryHint}\n\nคิดหัวข้อวิดีโอสั้นที่น่าสนใจและมีโอกาส viral สูง`,
            },
        ],
        temperature: 0.9,  // สูงขึ้นเพื่อความหลากหลายของหัวข้อ
    })

    try {
        const result = JSON.parse(response) as TopicResult
        if (!result.topic) {
            throw new Error("Invalid topic format")
        }
        ctx.log.info(`[generate_topic] done — topic: "${result.topic}"`)
        return result
    } catch {
        throw new Error(`[generate_topic] Failed to parse AI response: ${response}`)
    }
}
