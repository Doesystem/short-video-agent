import type { Context } from "@lifetimesoft/agent-sdk"
import { getEnvString } from "@lifetimesoft/agent-sdk"
import type { Platform } from "./generateScript"

export interface PostToPlatformInput {
    video_id: string
    caption: string
    platform: Platform
    is_private?: boolean
}

export interface PostResult {
    url: string
    platform: Platform
    status: "published" | "private"
}

const TOKEN_ENV_KEY: Record<Platform, string> = {
    tiktok: "tiktok_access_token",
    youtube_shorts: "youtube_access_token",
    facebook_reels: "facebook_access_token",
}

export async function postToPlatform(
    input: PostToPlatformInput,
    ctx: Context
): Promise<PostResult> {
    ctx.log.info(`[post_to_platform] platform: ${input.platform}, video_id: ${input.video_id}`)

    const tokenKey = TOKEN_ENV_KEY[input.platform]
    const accessToken = getEnvString(ctx.env, tokenKey)
    if (!accessToken) {
        throw new Error(`[post_to_platform] Missing env: ${tokenKey}`)
    }

    // TODO: integrate with each platform's API
    // TikTok: https://developers.tiktok.com/doc/content-posting-api-get-started
    // YouTube: https://developers.google.com/youtube/v3/docs/videos/insert
    // Facebook: https://developers.facebook.com/docs/video-api/reels-publishing

    const BASE_URLS: Record<Platform, string> = {
        tiktok: "https://www.tiktok.com/@user/video",
        youtube_shorts: "https://www.youtube.com/shorts",
        facebook_reels: "https://www.facebook.com/reel",
    }

    const status = input.is_private ? "private" : "published"
    const result: PostResult = {
        url: `${BASE_URLS[input.platform]}/${input.video_id}`,
        platform: input.platform,
        status,
    }

    ctx.log.info(`[post_to_platform] done — url: ${result.url}, status: ${result.status}`)
    return result
}
