import type { Context } from "@lifetimesoft/agent-sdk"

export interface GenerateCaptionInput {
    topic: string
    script_hook: string
}

export interface CaptionResult {
    caption: string
    hashtags: string[]
}

const SYSTEM_PROMPT = `คุณคือผู้เชี่ยวชาญด้าน TikTok caption และ hashtag
สร้าง caption และ hashtag สำหรับวิดีโอ TikTok ที่น่าสนใจ
- caption: ข้อความสั้นกระชับ ดึงดูดให้คนดู ไม่เกิน 150 ตัวอักษร
- hashtags: 5-8 hashtag ที่เกี่ยวข้องและ trending

ตอบกลับเป็น JSON เท่านั้น ไม่มีข้อความอื่น:
{"caption":"...","hashtags":["#tag1","#tag2"]}`

export async function generateCaption(
    input: GenerateCaptionInput,
    ctx: Context
): Promise<CaptionResult> {
    ctx.log.info(`[generate_caption] topic: ${input.topic}`)

    const response = await ctx.ai.chat({
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: `หัวข้อ: ${input.topic}\nHook: ${input.script_hook}`,
            },
        ],
        temperature: 0.7,
    })

    try {
        const result = JSON.parse(response) as CaptionResult
        if (!result.caption || !Array.isArray(result.hashtags)) {
            throw new Error("Invalid caption format")
        }
        ctx.log.info(`[generate_caption] done — hashtags: ${result.hashtags.join(" ")}`)
        return result
    } catch {
        throw new Error(`[generate_caption] Failed to parse AI response: ${response}`)
    }
}
