import type { Context } from "@lifetimesoft/agent-sdk"
import type { Platform } from "./generateScript"

export interface GenerateCaptionInput {
    topic: string
    script_hook: string
    platform: Platform
}

export interface CaptionResult {
    caption: string
    hashtags: string[]
}

const HASHTAG_COUNT: Record<Platform, string> = {
    tiktok: "3-5 hashtag",
    youtube_shorts: "3-5 hashtag",
    facebook_reels: "5-10 hashtag",
}

const SYSTEM_PROMPT = `คุณคือผู้เชี่ยวชาญด้าน social media caption และ hashtag
สร้าง caption และ hashtag สำหรับวิดีโอสั้นที่น่าสนใจ ปรับให้เหมาะกับ platform ที่ระบุ
- caption: ข้อความสั้นกระชับ ดึงดูดให้คนดู ไม่เกิน 150 ตัวอักษร
- hashtags: จำนวนตาม platform ที่ระบุ เลือก hashtag ที่เกี่ยวข้องและ trending

ตอบกลับเป็น JSON เท่านั้น ไม่มีข้อความอื่น:
{"caption":"...","hashtags":["#tag1","#tag2"]}`

export async function generateCaption(
    input: GenerateCaptionInput,
    ctx: Context
): Promise<CaptionResult> {
    ctx.log.info(`[generate_caption] topic: ${input.topic}, platform: ${input.platform}`)

    const hashtagHint = HASHTAG_COUNT[input.platform] ?? HASHTAG_COUNT.tiktok

    const response = await ctx.ai.chat({
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: `หัวข้อ: ${input.topic}\nHook: ${input.script_hook}\nPlatform: ${input.platform}\nจำนวน hashtag: ${hashtagHint}`,
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
