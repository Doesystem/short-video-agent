import { defineAgent } from "@lifetimesoft/agent-sdk"

export default defineAgent({
    async run(ctx) {
        ctx.log.info("Short Video Agent starting...")
    },
})
