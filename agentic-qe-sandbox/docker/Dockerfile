# Cypress RealWorld App (RUNTIME TARGET) — containerized so the recurring
# install/setup cost (Node pin, Electron download, seed wiring) becomes a
# one-time cost baked into the image instead of a per-developer ritual.
#
# Gotchas baked in here (do not rediscover them):
#  - Node pinned to 22.x (app engines: "^22.0.0 || ^24.0.0"; newer Node crashes
#    via buffer-equal-constant-time/SlowBuffer).
#  - Yarn Classic via corepack, matching package.json's "packageManager" pin.
#  - .yarnrc already in the repo sets `ignore-engines true`, but the top-level
#    --ignore-engines flag does NOT propagate to nested postinstall scripts,
#    so we also pass --ignore-engines explicitly on the yarn install itself.
#  - PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true at install time (puppeteer is a
#    transitive dep; its Chromium download is flaky/incompatible here).
#  - Cypress's own Electron binary download IS required (that's the actual
#    test runner) — only puppeteer's Chromium is skipped.
#  - ELECTRON_RUN_AS_NODE must be unset before invoking Cypress (handled in
#    entrypoint.sh, since it's an environment hazard at run time, not build time).

FROM node:22-bookworm-slim

# Cypress's documented Linux system dependencies (Debian/Ubuntu) for running
# its bundled Electron browser headlessly.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb \
    fonts-liberation \
    dbus \
    procps \
    curl \
    ca-certificates \
    wget \
    git \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    CI=1

WORKDIR /app

# package.json's postinstall runs "husky install", which requires a .git
# directory to attach hooks to. The build context deliberately excludes .git
# (see .dockerignore), so a throwaway repo is initialized to satisfy it.
RUN git init -q

# Activate the exact Yarn Classic version pinned by the app's package.json
# packageManager field via corepack (ships with Node 22).
COPY sandbox-eval/cypress-realworld-app/package.json ./package.json
RUN corepack enable && corepack prepare "$(node -p "require('./package.json').packageManager")" --activate

# Install dependencies first (better layer caching): copy only the files
# yarn install needs before copying the rest of the source tree.
COPY sandbox-eval/cypress-realworld-app/yarn.lock ./yarn.lock
COPY sandbox-eval/cypress-realworld-app/.yarnrc ./.yarnrc
COPY sandbox-eval/cypress-realworld-app/patches ./patches
RUN yarn install --frozen-lockfile --ignore-engines

# Now bring in the rest of the application source.
COPY sandbox-eval/cypress-realworld-app/ ./

# Re-run install in case any patch/postinstall step needs the full tree
# (patch-package + husky run as postinstall); --ignore-engines again because
# it does not propagate from the first install into this rerun.
RUN yarn install --frozen-lockfile --ignore-engines

COPY agentic-qe-sandbox/docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000 3001

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD []
