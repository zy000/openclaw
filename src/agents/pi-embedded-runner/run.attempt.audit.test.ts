import fs from "node:fs/promises";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { auditModelContext } from "./run/attempt.js";

// since auditModelContext is unexported currently, we need to export it from the
// file.  but it is already declared above the runEmbeddedAttempt export so we
// can import it directly.  if build complains we can adjust.

describe("auditModelContext helper", () => {
  const fakePath = "/tmp/test-audit.log";

  beforeEach(() => {
    vi.stubEnv("OPENCLAW_MODEL_AUDIT_LOG", fakePath);
    vi.spyOn(fs, "appendFile").mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("writes a JSON line containing provided data", async () => {
    const runId = "run-123";
    const provider = "openai";
    const model = "gpt-4";
    const context = { messages: ["hello"] };

    await auditModelContext(runId, provider, model, context);

    expect(fs.appendFile).toHaveBeenCalledWith(
      fakePath,
      expect.stringContaining(`"runId":"${runId}"`),
    );
    expect(fs.appendFile).toHaveBeenCalledWith(
      fakePath,
      expect.stringContaining(`"provider":"${provider}"`),
    );
    expect(fs.appendFile).toHaveBeenCalledWith(
      fakePath,
      expect.stringContaining(`"model":"${model}"`),
    );
    expect(fs.appendFile).toHaveBeenCalledWith(
      fakePath,
      expect.stringContaining(`"context":`),
    );
  });
});
