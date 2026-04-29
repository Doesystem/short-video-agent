import type { Context } from "@lifetimesoft/agent-sdk"
import type { Script } from "./generateScript"

export type VideoStyle = "talking-head" | "b-roll" | "meme"

export interface GenerateVideoInput {
    script: Script
    style: VideoStyle
}

export interface VideoResult {
    video_id: string
    video_url: string
    duration: number
}

const MAX_DURATION_SECONDS = 60

export async function generateVideo(
    input: GenerateVideoInput,
    ctx: Context
): Promise<VideoResult> {
    ctx.log.info(`[generate_video] style: ${input.style}`)

    // TODO: integrate with actual video generation API (e.g. Runway, Kling, Pika)
    // For now, simulate the result
    const scriptText = `${input.script.hook} ${input.script.body} ${input.script.cta}`
    const estimatedDuration = Math.min(
        Math.ceil(scriptText.length / 10),
        MAX_DURATION_SECONDS
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
