/**
 * Local development runner — simulates a manual trigger from the platform.
 * Usage: npm run dev:run
 */
import type { Context } from "@lifetimesoft/agent-sdk"
import agent from "./index"

// ─── Inline mock context (no /testing sub-path needed) ────────────────────────

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
                console.log("[mock ai] model:", req.model ?? "default")
                const systemPrompt = req.messages.find(m => m.role === "system")?.content ?? ""

                // generateScript — system prompt mentions hook/body/cta
                if (systemPrompt.includes("hook")) {
                    return JSON.stringify({
                        hook: "คุณรู้ไหมว่าคนส่วนใหญ่ทำผิดพลาดเรื่องนี้?",
                        body: "วันนี้เราจะมาเรียนรู้เคล็ดลับที่จะเปลี่ยนชีวิตคุณ",
                        cta: "กดติดตามเพื่อไม่พลาดเนื้อหาดีๆ",
                    })
                }

                // generateCaption — system prompt mentions caption/hashtag
                if (systemPrompt.includes("caption") || systemPrompt.includes("hashtag")) {
                    return JSON.stringify({
                        caption: "เคล็ดลับที่คุณต้องรู้! 🔥",
                        hashtags: ["#TikTok", "#เคล็ดลับ", "#ความรู้", "#viral", "#fyp"],
                    })
                }

                return "mock AI response"
            },
        },
        storage: {
            get: async () => null,
            set: async () => {},
            delete: async () => {},
        },
        queue: {
            push: async () => {},
        },
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
    const ctx = createDevContext({
        topic: "5 เคล็ดลับประหยัดเงินสำหรับคนเงินเดือนน้อย",
        tone: "ให้ความรู้",
        video_style: "talking-head",
        auto_post: false,
        // tiktok_access_token: "your-token-here",
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
