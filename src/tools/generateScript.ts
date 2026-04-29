import type { Context } from "@lifetimesoft/agent-sdk"

export type Tone = "สนุก" | "ให้ความรู้" | "ดราม่า"
export type Platform = "tiktok" | "youtube_shorts" | "facebook_reels"

export interface GenerateScriptInput {
    topic: string
    tone: Tone
    platform: Platform
}

export interface Script {
    hook: string   // ประโยคเปิดดึงดูดความสนใจ
    body: string   // เนื้อหาหลัก
    cta: string    // call-to-action ปิดท้าย (ปรับตาม platform)
}

const CTA_BY_PLATFORM: Record<Platform, string> = {
    tiktok: "กดติดตามและ Duet กับเราได้เลย",
    youtube_shorts: "กด Subscribe และ Like เพื่อไม่พลาดเนื้อหาดีๆ",
    facebook_reels: "กด Follow และ Share ให้เพื่อนด้วยนะ",
}

const SYSTEM_PROMPT = `คุณคือนักเขียนบทพูดวิดีโอสั้นมืออาชีพ
สร้างบทพูดสำหรับวิดีโอสั้น 30-60 วินาที ประกอบด้วย 3 ส่วน:
- hook: ประโยคเปิดที่ดึงดูดความสนใจใน 3 วินาทีแรก
- body: เนื้อหาหลักที่กระชับและน่าสนใจ
- cta: call-to-action ปิดท้าย ปรับให้เหมาะกับ platform ที่ระบุ

ตอบกลับเป็น JSON เท่านั้น ไม่มีข้อความอื่น:
{"hook":"...","body":"...","cta":"..."}`

export async function generateScript(
    input: GenerateScriptInput,
    ctx: Context
): Promise<Script> {
    ctx.log.info(`[generate_script] topic: ${input.topic}, tone: ${input.tone}, platform: ${input.platform}`)

    const ctaHint = CTA_BY_PLATFORM[input.platform] ?? CTA_BY_PLATFORM.tiktok

    const response = await ctx.ai.chat({
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: `หัวข้อ: ${input.topic}\nโทน: ${input.tone}\nPlatform: ${input.platform}\nCTA hint: ${ctaHint}`,
            },
        ],
        temperature: 0.8,
    })

    try {
        const script = JSON.parse(response) as Script
        if (!script.hook || !script.body || !script.cta) {
            throw new Error("Invalid script format")
        }
        ctx.log.info(`[generate_script] done — hook: "${script.hook.slice(0, 40)}..."`)
        return script
    } catch {
        throw new Error(`[generate_script] Failed to parse AI response: ${response}`)
    }
}
