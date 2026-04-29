import type { Context } from "@lifetimesoft/agent-sdk"
import { getEnvString } from "@lifetimesoft/agent-sdk"

export interface PostToTiktokInput {
    video_id: string
    caption: string
    is_private?: boolean
}

export interface PostResult {
    tiktok_url: string
    status: "published" | "private"
}

export async function postToTiktok(
    input: PostToTiktokInput,
    ctx: Context
): Promise<PostResult> {
    ctx.log.info(`[post_to_tiktok] video_id: ${input.video_id}, is_private: ${input.is_private ?? false}`)

    const accessToken = getEnvString(ctx.env, "tiktok_access_token")
    if (!accessToken) {
        throw new Error("[post_to_tiktok] Missing env: tiktok_access_token")
    }

    // TODO: integrate with TikTok Content Posting API
    // https://developers.tiktok.com/doc/content-posting-api-get-started
    // const res = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    //     method: "POST",
    //     headers: {
    //         "Authorization": `Bearer ${accessToken}`,
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         post_info: {
    //             title: input.caption,
    //             privacy_level: input.is_private ? "SELF_ONLY" : "PUBLIC_TO_EVERYONE",
    //         },
    //         source_info: {
    //             source: "FILE_UPLOAD",
    //             video_size: 0,
    //             chunk_size: 0,
    //             total_chunk_count: 1,
    //         },
    //     }),
    // })

    // Simulated result
    const status = input.is_private ? "private" : "published"
    const result: PostResult = {
        tiktok_url: `https://www.tiktok.com/@user/video/${input.video_id}`,
        status,
    }

    ctx.log.info(`[post_to_tiktok] done — url: ${result.tiktok_url}, status: ${result.status}`)
    return result
}
