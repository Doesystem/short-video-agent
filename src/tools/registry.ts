import type { Context } from "@lifetimesoft/agent-sdk"
import { generateScript } from "./generateScript"
import { generateVideo } from "./generateVideo"
import { generateCaption } from "./generateCaption"

// ─── Tool Definition ──────────────────────────────────────────────────────────

export interface ToolDefinition {
    name: string
    description: string
    parameters: Record<string, { type: string; description: string; required?: boolean }>
}

export interface ToolCall {
    tool: string
    input: Record<string, unknown>
}

export interface ToolResult {
    tool: string
    output: unknown
    error?: string
}

// ─── Tool Definitions (sent to AI as context) ─────────────────────────────────
// Note: post_to_platform is NOT here — posting is handled outside the agent loop

export const TOOL_DEFINITIONS: ToolDefinition[] = [
    {
        name: "generate_script",
        description: "สร้างบทพูดวิดีโอสั้นจากหัวข้อ ได้ hook, body, cta",
        parameters: {
            topic: { type: "string", description: "หัวข้อวิดีโอ", required: true },
            tone:  { type: "string", description: "โทน: สนุก | ให้ความรู้ | ดราม่า", required: true },
        },
    },
    {
        name: "generate_video",
        description: "สร้างวิดีโอจากบทพูด ได้ video_id, video_url, duration",
        parameters: {
            script: { type: "object", description: "บทพูดจาก generate_script (hook, body, cta)", required: true },
            style:  { type: "string", description: "สไตล์: talking-head | b-roll | meme", required: true },
        },
    },
    {
        name: "generate_caption",
        description: "สร้าง caption และ hashtag สำหรับวิดีโอ (generic ใช้ได้ทุก platform)",
        parameters: {
            topic:       { type: "string", description: "หัวข้อวิดีโอ", required: true },
            script_hook: { type: "string", description: "hook จาก generate_script", required: true },
        },
    },
]

// ─── Tool Executor ────────────────────────────────────────────────────────────

export async function executeTool(call: ToolCall, ctx: Context): Promise<ToolResult> {
    ctx.log.info(`[tool] calling: ${call.tool}`)

    try {
        let output: unknown

        switch (call.tool) {
            case "generate_script":
                output = await generateScript(call.input as any, ctx)
                break
            case "generate_video":
                output = await generateVideo(call.input as any, ctx)
                break
            case "generate_caption":
                output = await generateCaption(call.input as any, ctx)
                break
            default:
                throw new Error(`Unknown tool: ${call.tool}`)
        }

        ctx.log.info(`[tool] ${call.tool} done`)
        return { tool: call.tool, output }
    } catch (e: any) {
        ctx.log.error(`[tool] ${call.tool} failed: ${e.message}`)
        return { tool: call.tool, output: null, error: e.message }
    }
}
