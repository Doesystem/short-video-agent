import { defineAgent, getEnvString, getEnvBoolean } from "@lifetimesoft/agent-sdk"
import type { Tone } from "./tools/generateScript"
import type { VideoStyle } from "./tools/generateVideo"
import { generateScript } from "./tools/generateScript"
import { generateVideo } from "./tools/generateVideo"
import { generateCaption } from "./tools/generateCaption"
import { postToTiktok } from "./tools/postToTiktok"

export default defineAgent({
    async run(ctx) {
        ctx.log.info("Short Video Agent starting...")

        const topic = getEnvString(ctx.env, "topic")
        if (!topic) {
            ctx.log.error("Missing env: topic")
            throw new Error("Missing required env: topic")
        }

        const tone = (getEnvString(ctx.env, "tone") ?? "ให้ความรู้") as Tone
        const style = (getEnvString(ctx.env, "video_style") ?? "talking-head") as VideoStyle
        const autoPost = getEnvBoolean(ctx.env, "auto_post", false)

        ctx.log.info(`topic: ${topic}, tone: ${tone}, style: ${style}, auto_post: ${autoPost}`)

        // Step 1: Generate script
        ctx.log.info("Step 1/3: Generating script...")
        const script = await generateScript({ topic, tone }, ctx)
        ctx.log.info(`Script ready — hook: "${script.hook}"`)

        // Step 2: Generate video
        ctx.log.info("Step 2/3: Generating video...")
        const video = await generateVideo({ script, style }, ctx)
        ctx.log.info(`Video ready — url: ${video.video_url} (${video.duration}s)`)

        // Step 3: Generate caption
        ctx.log.info("Step 3/3: Generating caption...")
        const caption = await generateCaption({ topic, script_hook: script.hook }, ctx)
        ctx.log.info(`Caption ready — ${caption.hashtags.join(" ")}`)

        // Summary
        ctx.log.info("=== Result ===")
        ctx.log.info(`Hook: ${script.hook}`)
        ctx.log.info(`Body: ${script.body}`)
        ctx.log.info(`CTA: ${script.cta}`)
        ctx.log.info(`Video: ${video.video_url}`)
        ctx.log.info(`Caption: ${caption.caption}`)
        ctx.log.info(`Hashtags: ${caption.hashtags.join(" ")}`)

        // Step 4: Post to TikTok (only if auto_post = true)
        if (autoPost) {
            ctx.log.info("Step 4: Posting to TikTok...")
            const post = await postToTiktok({
                video_id: video.video_id,
                caption: `${caption.caption}\n\n${caption.hashtags.join(" ")}`,
                is_private: false,
            }, ctx)
            ctx.log.info(`Posted! URL: ${post.tiktok_url}`)
        } else {
            ctx.log.info("auto_post=false — skipping post. Set auto_post=true to publish.")
        }

        ctx.log.info("Short Video Agent completed.")
    },
})
