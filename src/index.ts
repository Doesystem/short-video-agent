import { defineAgent, getEnvString, getEnvBoolean } from "@lifetimesoft/agent-sdk"
import { runAgentLoop } from "./agent-loop"
import { generateCaption } from "./tools/generateCaption"
import { postToPlatform } from "./tools/postToPlatform"
import type { Platform } from "./tools/generateScript"

const ALL_PLATFORMS: Platform[] = ["tiktok", "youtube_shorts", "facebook_reels"]

export default defineAgent({
    async run(ctx) {
        ctx.log.info("Short Video Agent starting...")

        const topic = getEnvString(ctx.env, "topic")
        if (!topic) {
            ctx.log.error("Missing env: topic")
            throw new Error("Missing required env: topic")
        }

        const tone = getEnvString(ctx.env, "tone") ?? "ให้ความรู้"
        const style = getEnvString(ctx.env, "video_style") ?? "talking-head"
        const autoPost = getEnvBoolean(ctx.env, "auto_post", false)

        // Parse target platforms from env — comma-separated, e.g. "tiktok,youtube_shorts"
        const platformsRaw = getEnvString(ctx.env, "platforms") ?? "tiktok"
        const platforms = platformsRaw
            .split(",")
            .map(p => p.trim() as Platform)
            .filter(p => ALL_PLATFORMS.includes(p))

        if (platforms.length === 0) {
            throw new Error(`Invalid platforms: "${platformsRaw}". Valid: ${ALL_PLATFORMS.join(", ")}`)
        }

        ctx.log.info(`topic: ${topic}, tone: ${tone}, style: ${style}`)
        ctx.log.info(`platforms: ${platforms.join(", ")}, auto_post: ${autoPost}`)

        // ── Step 1: AI loop — generate script + video (platform-agnostic) ──────
        ctx.log.info("Step 1: Generating video...")
        const video = await runAgentLoop(
            `สร้างวิดีโอสั้นจากหัวข้อ: "${topic}"\nโทน: ${tone}\nสไตล์วิดีโอ: ${style}`,
            ctx
        )
        ctx.log.info(`Video ready — id: ${video.video_id}, url: ${video.video_url}`)

        // ── Step 2: Generate caption per platform + post ──────────────────────
        const results: { platform: Platform; url?: string; error?: string }[] = []

        for (const platform of platforms) {
            ctx.log.info(`Step 2 [${platform}]: Generating caption...`)

            let captionText: string
            let hashtagText: string

            try {
                const caption = await generateCaption({
                    topic,
                    script_hook: video.caption,  // use base caption as hook hint
                    platform,
                }, ctx)
                captionText = caption.caption
                hashtagText = caption.hashtags.join(" ")
            } catch (e: any) {
                ctx.log.error(`[${platform}] Caption failed: ${e.message}`)
                results.push({ platform, error: `caption failed: ${e.message}` })
                continue
            }

            if (!autoPost) {
                ctx.log.info(`[${platform}] auto_post=false — skipping post`)
                ctx.log.info(`[${platform}] Caption: ${captionText}`)
                ctx.log.info(`[${platform}] Hashtags: ${hashtagText}`)
                results.push({ platform })
                continue
            }

            ctx.log.info(`Step 2 [${platform}]: Posting...`)
            try {
                const post = await postToPlatform({
                    video_id: video.video_id,
                    caption: `${captionText}\n\n${hashtagText}`,
                    platform,
                    is_private: false,
                }, ctx)
                ctx.log.info(`[${platform}] Posted! URL: ${post.url}`)
                results.push({ platform, url: post.url })
            } catch (e: any) {
                ctx.log.error(`[${platform}] Post failed: ${e.message}`)
                results.push({ platform, error: `post failed: ${e.message}` })
            }
        }

        // ── Summary ───────────────────────────────────────────────────────────
        ctx.log.info("=== Summary ===")
        ctx.log.info(`Video: ${video.video_url}`)
        for (const r of results) {
            if (r.error) {
                ctx.log.error(`[${r.platform}] ❌ ${r.error}`)
            } else if (r.url) {
                ctx.log.info(`[${r.platform}] ✅ ${r.url}`)
            } else {
                ctx.log.info(`[${r.platform}] ✅ ready (not posted)`)
            }
        }

        ctx.log.info("Short Video Agent completed.")
    },
})
