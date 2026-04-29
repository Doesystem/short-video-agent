import type { Context } from "@lifetimesoft/agent-sdk"
import type { Script, Platform } from "./generateScript"

export type VideoStyle = "talking-head" | "b-roll" | "meme"

export interface GenerateVideoInput {
    script: Script
    style: VideoStyle
    platform: Platform
}

export interface VideoResult {
    video_id: string
    video_url: string
    duration: number
}

const MAX_DURATION: Record<Platform, number> = {
    tiktok: 60,
    youtube_shorts: 60,
    facebook_reels: 90,
}

export async function generateVideo(
    input: GenerateVideoInput,
    ctx: Context
): Promise<VideoResult> {
    ctx.log.info(`[generate_video] style: ${input.style}, platform: ${input.platform}`)

    // TODO: integrate with actual video generation API (e.g. Runway, Kling, Pika)
    const maxDuration = MAX_DURATION[input.platform] ?? 60
    const scriptText = `${input.script.hook} ${input.script.body} ${input.script.cta}`
    const estimatedDuration = Math.min(
        Math.ceil(scriptText.length / 10),
        maxDuration
    )

    const videoId = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const result: VideoResult = {
        video_id: videoId,
        video_url: `https://storage.example.com/videos/${videoId}.mp4`,
        duration: estimatedDuration,
    }

    ctx.log.info(`[generate_video] done — id: ${result.video_id}, duration: ${result.duration}s`)
    return result
}
