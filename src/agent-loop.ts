import type { Context } from "@lifetimesoft/agent-sdk"
import { TOOL_DEFINITIONS, executeTool } from "./tools/registry"
import type { ToolCall, ToolResult } from "./tools/registry"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
    role: "system" | "user" | "assistant"
    content: string
}

interface AgentResponse {
    type: "tool_call" | "final_answer"
    tool_call?: ToolCall
    answer?: string
}

// ─── System Prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
    const toolsJson = JSON.stringify(TOOL_DEFINITIONS, null, 2)

    return `คุณคือครีเอเตอร์วิดีโอสั้นมืออาชีพ
มีหน้าที่สร้างวิดีโอสั้นจากหัวข้อที่ได้รับ วิดีโอนี้จะถูกนำไปโพสบน platform ต่างๆ

## Tools ที่ใช้ได้
${toolsJson}

## วิธีตอบกลับ
ตอบกลับเป็น JSON เท่านั้น รูปแบบใดรูปแบบหนึ่ง:

เรียก tool:
{"type":"tool_call","tool_call":{"tool":"ชื่อ_tool","input":{...}}}

ตอบกลับ user (เมื่อทำเสร็จแล้ว):
{"type":"final_answer","video_id":"...","video_url":"...","caption":"...","hashtags":["..."]}

## Workflow
1. เรียก generate_script
2. เรียก generate_video
3. เรียก generate_caption
4. ส่ง final_answer พร้อม video_id, video_url, caption, hashtags

## Constraints
- วิดีโอต้องไม่เกิน 60 วินาที
- caption ควรเป็นภาษาไทย`
}

// ─── Agent Loop ───────────────────────────────────────────────────────────────

export interface VideoOutput {
    video_id: string
    video_url: string
    caption: string
    hashtags: string[]
}

const MAX_ITERATIONS = 10

export async function runAgentLoop(
    userMessage: string,
    ctx: Context,
): Promise<VideoOutput> {
    const messages: Message[] = [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: userMessage },
    ]

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        ctx.log.info(`[loop] iteration ${i + 1}/${MAX_ITERATIONS}`)

        const raw = await ctx.ai.chat({ messages, temperature: 0.3 })

        let parsed: AgentResponse
        try {
            const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim()
            parsed = JSON.parse(cleaned) as AgentResponse
        } catch {
            ctx.log.error(`[loop] Failed to parse AI response: ${raw}`)
            throw new Error(`[loop] Invalid AI response: ${raw}`)
        }

        // Final answer — return structured video output
        if (parsed.type === "final_answer") {
            ctx.log.info("[loop] AI returned final answer")
            const output = parsed as unknown as VideoOutput & { type: string }
            if (!output.video_id || !output.video_url) {
                throw new Error("[loop] final_answer missing video_id or video_url")
            }
            return {
                video_id: output.video_id,
                video_url: output.video_url,
                caption: output.caption ?? "",
                hashtags: output.hashtags ?? [],
            }
        }

        // Tool call
        if (parsed.type === "tool_call" && parsed.tool_call) {
            const call = parsed.tool_call
            messages.push({ role: "assistant", content: raw })

            const result = await executeTool(call, ctx)

            const resultContent = result.error
                ? `Tool ${call.tool} failed: ${result.error}`
                : `Tool ${call.tool} result: ${JSON.stringify(result.output)}`

            messages.push({ role: "user", content: resultContent })
            continue
        }

        ctx.log.error(`[loop] Unexpected response format: ${raw}`)
        break
    }

    throw new Error(`[loop] Max iterations (${MAX_ITERATIONS}) reached without final answer`)
}
