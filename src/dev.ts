/**
 * Local development runner — simulates a manual trigger from the platform.
 * Usage: npm run dev:run
 */
import type { Context } from "@lifetimesoft/agent-sdk"
import agent from "./index"

// ─── Mock AI that simulates tool-calling loop ─────────────────────────────────

let callCount = 0

// Mock สำหรับ generateTopic (เรียกตรงๆ ไม่ผ่าน agent loop)
const MOCK_GENERATED_TOPIC = "5 นิสัยคนรวยที่คนจนไม่เคยทำ"

function createDevContext(env: Record<string, unknown>): Context {
    // ถ้าไม่มี topic ใน env — mock จะตอบ generateTopic ก่อน
    const resolvedTopic = (env.topic as string | undefined) ?? MOCK_GENERATED_TOPIC

    // แยก counter สำหรับ agent loop (ไม่นับ generateTopic call)
    let loopCallCount = 0

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
                const systemMsg = req.messages.find(m => m.role === "system")?.content ?? ""
                console.log(`[mock ai] call #${callCount}`)

                // ── generateTopic call ────────────────────────────────────────────
                if (systemMsg.includes("คิดหัวข้อวิดีโอสั้น")) {
                    return JSON.stringify({
                        topic: MOCK_GENERATED_TOPIC,
                        reason: "หัวข้อนี้ตรงกับความสนใจของคนทั่วไปและมีโอกาส viral สูง",
                    })
                }

                // ── generateScript call (system prompt มี "นักเขียนบทพูด") ────────
                if (systemMsg.includes("นักเขียนบทพูด")) {
                    return JSON.stringify({
                        hook: "คุณรู้ไหมว่าคนส่วนใหญ่ทำผิดพลาดเรื่องนี้?",
                        body: "เนื้อหาหลักที่น่าสนใจและกระชับ ให้ข้อมูลที่เป็นประโยชน์",
                        cta: "กดติดตามและ Duet กับเราได้เลย",
                    })
                }

                // ── generateCaption call (system prompt มี "caption") ─────────────
                if (systemMsg.includes("social media caption")) {
                    return JSON.stringify({
                        caption: "เคล็ดลับที่คุณต้องรู้! อย่าพลาด 🔥",
                        hashtags: ["#เคล็ดลับ", "#ความรู้", "#viral"],
                    })
                }

                // ── agent loop calls (system prompt มี "ครีเอเตอร์วิดีโอสั้น") ───
                loopCallCount++
                console.log(`[mock ai] loop iteration #${loopCallCount}`)

                // Iteration 1 — generate_script
                if (loopCallCount === 1) {
                    return JSON.stringify({
                        type: "tool_call",
                        tool_call: {
                            tool: "generate_script",
                            input: {
                                topic: resolvedTopic,
                                tone: env.tone ?? "ให้ความรู้",
                                platform: "tiktok",
                            },
                        },
                    })
                }

                // Iteration 2 — generate_video (script tool succeeded)
                if (loopCallCount === 2) {
                    const match = lastUserMsg.match(/Tool generate_script result: (.+)$/)
                    const scriptResult = match ? JSON.parse(match[1]) : {
                        hook: "hook mock",
                        body: "body mock",
                        cta: "cta mock",
                    }
                    return JSON.stringify({
                        type: "tool_call",
                        tool_call: {
                            tool: "generate_video",
                            input: {
                                script: scriptResult,
                                style: env.video_style ?? "talking-head",
                                platform: "tiktok",
                            },
                        },
                    })
                }

                // Iteration 3 — generate_caption
                if (loopCallCount === 3) {
                    return JSON.stringify({
                        type: "tool_call",
                        tool_call: {
                            tool: "generate_caption",
                            input: {
                                topic: resolvedTopic,
                                script_hook: "คุณรู้ไหมว่าคนส่วนใหญ่ทำผิดพลาดเรื่องนี้?",
                                platform: "tiktok",
                            },
                        },
                    })
                }

                // Iteration 4 — final answer
                if (loopCallCount === 4) {
                    return JSON.stringify({
                        type: "final_answer",
                        video_id: "vid_mock_123456",
                        video_url: "https://storage.example.com/videos/vid_mock_123456.mp4",
                        caption: "เคล็ดลับที่คุณต้องรู้!",
                        hashtags: ["#เคล็ดลับ", "#ความรู้", "#viral"],
                    })
                }

                // Fallback
                return JSON.stringify({ type: "final_answer", answer: "เสร็จสิ้น" })
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
    // ── Test case 1: มี topic ──────────────────────────────────────────────────
    console.log("\n=== Test case 1: มี topic ===")
    callCount = 0
    const ctx1 = createDevContext({
        topic: "5 เคล็ดลับประหยัดเงินสำหรับคนเงินเดือนน้อย",
        tone: "ให้ความรู้",
        video_style: "talking-head",
        platforms: "tiktok,youtube_shorts,facebook_reels",
        auto_post: false,
    })
    try {
        await agent.run(ctx1)
        console.log("=== Test case 1 completed ===")
    } catch (err) {
        console.error("=== Test case 1 failed ===", err)
    }

    // ── Test case 2: ไม่มี topic — AI คิดให้ ─────────────────────────────────
    console.log("\n=== Test case 2: ไม่มี topic (AI คิดหัวข้อให้) ===")
    callCount = 0
    const ctx2 = createDevContext({
        // ไม่มี topic
        tone: "สนุก",
        video_style: "meme",
        category: "การเงิน",  // optional hint
        platforms: "tiktok",
        auto_post: false,
    })
    try {
        await agent.run(ctx2)
        console.log("=== Test case 2 completed ===")
    } catch (err) {
        console.error("=== Test case 2 failed ===", err)
        process.exit(1)
    }
}

main()
