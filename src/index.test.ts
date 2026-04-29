import { describe, it, expect, vi } from "vitest"
import { createMockContext } from "@lifetimesoft/agent-sdk/testing"
import agent from "./index"

describe("short-video-agent", () => {
  it("has __isAgent flag", () => {
    expect(agent.__isAgent).toBe(true)
  })

  it("calls ctx.log.info on run", async () => {
    const mockInfo = vi.fn()

    const ctx = createMockContext({
      log: { info: mockInfo },
    })

    await agent.run(ctx)

    expect(mockInfo).toHaveBeenCalled()
  })

  it("returns undefined (no output)", async () => {
    const ctx = createMockContext()
    const result = await agent.run(ctx)
    expect(result).toBeUndefined()
  })
})
