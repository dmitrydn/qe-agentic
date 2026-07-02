/**
 * Full AppAdapter for the Cypress RealWorld App (the one live RUNTIME
 * TARGET in this sandbox). Implements all six AppAdapter members against the
 * containerized runtime built in docker/.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";
import { extractCypressRwaRequirements } from "./extract-requirements.js";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const SANDBOX_ROOT = join(__dirname, "../../..");

const config = JSON.parse(readFileSync(join(__dirname, "config.json"), "utf8"));
const RUN_SH = join(__dirname, "../../docker/run.sh");

async function waitForReady(baseUrls, timeoutMs = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const [web, api] = await Promise.all([
        fetch(baseUrls.web),
        fetch(`${baseUrls.api}/testData/users`),
      ]);
      if (web.ok && api.ok) return true;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`cypress-rwa did not become ready within ${timeoutMs}ms`);
}

export const cypressRwaAdapter = {
  id: config.id,

  async run() {
    await execFileAsync(RUN_SH, ["start"], { cwd: SANDBOX_ROOT });
    const baseUrls = config.baseUrls;
    return { baseUrls, ready: () => waitForReady(baseUrls) };
  },

  async seed() {
    const res = await fetch(`${config.baseUrls.api}${config.seed.endpoint}`, { method: "POST" });
    if (!res.ok) throw new Error(`seed() failed: HTTP ${res.status}`);
  },

  async reset() {
    return this.seed();
  },

  async auth(credentials = {}) {
    let username = credentials.username;
    if (!username) {
      const usersRes = await fetch(`${config.baseUrls.api}/testData/users`);
      if (!usersRes.ok) throw new Error(`auth() could not look up a seeded user: HTTP ${usersRes.status}`);
      const { results } = await usersRes.json();
      username = results?.[0]?.username;
      if (!username) throw new Error("auth() found no seeded users to log in as");
    }
    const password = credentials.password ?? config.seed.defaultPassword;
    const res = await fetch(`${config.baseUrls.api}${config.auth.loginEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(`auth() failed: HTTP ${res.status}`);
    const setCookie = res.headers.get("set-cookie");
    if (!setCookie) throw new Error("auth() succeeded but no session cookie was returned");
    const cookie = setCookie.split(";")[0];
    return { type: "cookie", headers: { Cookie: cookie } };
  },

  requirementsSource() {
    return {
      format: config.requirements.format,
      rootDir: join(SANDBOX_ROOT, config.appRoot),
      extract: () =>
        extractCypressRwaRequirements({
          appRoot: join(SANDBOX_ROOT, config.appRoot),
          appName: config.id,
        }),
    };
  },

  async teardown() {
    await execFileAsync(RUN_SH, ["stop"], { cwd: SANDBOX_ROOT });
  },
};
