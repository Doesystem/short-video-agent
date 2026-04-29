/**
 * Local development runner — simulates a manual trigger from the platform.
 * Usage: npx ts-node src/dev.ts
 *    or: npm run dev:run
 */
import { createMockContext } from "@lifetimesoft/agent-sdk/testing"
import agent from "./index"

async function main() {
    const ctx = createMockContext({
        // simulate env vars (same as agent.json defaults)
        env: {},

        // simulate scheduler type: none (manual trigger)
        config: {
            agent: "short-video-agent",
            version: "0.0.1",
            scheduler: { type: "none" },
        },

        // mock AI — replace with real response for testing
        ai: {
            chat: async (req: {
                messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
                model?: string
                temperature?: number
            }) => {
                console.log("[mock ai] messages:", JSON.stringify(req.messages, null, 2))
                return "mocked AI response"
            },
        },

        // mock logger — prints to console
        log: {
            info:  (...args: unknown[]) => console.log("[info]", ...args),
            error: (...args: unknown[]) => console.error("[error]", ...args),
            debug: (...args: unknown[]) => console.debug("[debug]", ...args),
        },
    })

    console.log("=== Simulating trigger ===")
    try {
        const result = await agent.run(ctx)
        console.log("=== Run completed ===")
        if (result !== undefined) {
            console.log("Output:", JSON.stringify(result, null, 2))
        }
    } catch (err) {
        console.error("=== Run failed ===", err)
        process.exit(1)
    }
}

main()
