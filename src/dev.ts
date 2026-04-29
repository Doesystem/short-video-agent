/**
 * Local development runner — simulates a manual trigger from the platform.
 * Usage: npm run dev:run
 */
import type { Context } from "@lifetimesoft/agent-sdk"
import agent from "./index"

// ─── Mock AI that simulates tool-calling loop ─────────────────────────────────

let callCount = 0

function createDevContext(env: Record<string, unknown>): Context {
    return {
        input: null,
        config: {
            agent: "short-video-agent",
            version: "0.0.1",
            scheduler: { type: "none" },
        },
        env,
        ai: {
            chat: async (req) => {
                callCount++
                const lastUserMsg = [...req.messages].reverse().find(m => m.role === "user")?.content ?? ""
                console.log(`[mock ai] call #${callCount}`)

                // Iteration 1 — AI decides to call generate_script
                if (callCount === 1) {
                    return JSON.stringify({
                        type: "tool_call",
                        tool_call: {
                            tool: "generate_script",
                            input: { topic: env.topic, tone: env.tone ?? "ให้ความรู้" },
                        },
                    })
                }

                // Iteration 2 — AI got script result, calls generate_video
                if (callCount === 2 && lastUserMsg.includes("generate_script result")) {
                    const scriptResult = JSON.parse(
                        lastUserMsg.replace("Tool generate_script result: ", "")
                    )
                    return JSON.stringify({
                        type: "tool_call",
                        tool_call: {
                            tool: "generate_video",
                            input: { script: scriptResult, style: env.video_style ?? "talking-head" },
                        },
                    })
                }

                // Iteration 3 — AI got video result, calls generate_caption
                if (callCount === 3 && lastUserMsg.includes("generate_video result")) {
                    return JSON.stringify({
                        type: "tool_call",
                        tool_call: {
                            tool: "generate_caption",
                            input: {
                                topic: env.topic,
                                script_hook: "คุณรู้ไหมว่าคนส่วนใหญ่ทำผิดพลาดเรื่องนี้?",
                            },
                        },
                    })
                }

                // Iteration 4 — AI got caption, returns final answer with structured output
                if (callCount === 4 && lastUserMsg.includes("generate_caption result")) {
                    return JSON.stringify({
                        type: "final_answer",
                        video_id: "vid_mock_123456",
                        video_url: "https://storage.example.com/videos/vid_mock_123456.mp4",
                        caption: "เคล็ดลับที่คุณต้องรู้!",
                        hashtags: ["#เคล็ดลับ", "#ความรู้", "#viral"],
                    })
                }

                // Fallback
                return JSON.stringify({
                    type: "final_answer",
                    answer: "เสร็จสิ้น",
                })
            },
        },
        storage: {
            get: async () => null,
            set: async () => {},
            delete: async () => {},
        },
        queue: { push: async () => {} },
        log: {
            info:  (...args: unknown[]) => console.log("[info]", ...args),
            error: (...args: unknown[]) => console.error("[error]", ...args),
            debug: (...args: unknown[]) => console.debug("[debug]", ...args),
        },
        meta: {
            run_id: `dev-run-${Date.now()}`,
            timestamp: Date.now(),
        },
    }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
    callCount = 0
    const ctx = createDevContext({
        topic: "5 เคล็ดลับประหยัดเงินสำหรับคนเงินเดือนน้อย",
        tone: "ให้ความรู้",
        video_style: "talking-head",
        platforms: "tiktok,youtube_shorts,facebook_reels",  // ← โพสทุก platform
        auto_post: false,
    })

    console.log("=== Simulating trigger ===")
    try {
        await agent.run(ctx)
        console.log("=== Run completed ===")
    } catch (err) {
        console.error("=== Run failed ===", err)
        process.exit(1)
    }
}

main()
