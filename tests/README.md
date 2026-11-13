# Browser verification

The browser check exercises the **real unpacked extension** and `chrome.storage` API in Chromium. It intercepts the DeepSeek document request locally with a fixture, so no account or submitted message is needed. Its result does not prove compatibility with the current live DOM.

1. Install Playwright CLI and a Playwright Chromium browser if they aren't already available.
2. Create a local config file (for example `.playwright/cli.config.json`) with your absolute extension path and Chromium executable path:

```json
{
  "browser": {
    "browserName": "chromium",
    "userDataDir": "/tmp/deepseek-arabic-test-profile",
    "launchOptions": {
      "executablePath": "/absolute/path/to/playwright/chromium/chrome",
      "headless": true,
      "args": [
        "--disable-extensions-except=/absolute/path/to/deepseek-arabic",
        "--load-extension=/absolute/path/to/deepseek-arabic"
      ],
      "ignoreDefaultArgs": ["--disable-extensions"]
    }
  },
  "outputDir": "output/playwright"
}
```

3. From the project root, run:

```bash
mkdir -p output/playwright
playwright-cli -s=deepseek-extension open chrome://extensions --config .playwright/cli.config.json --persistent
playwright-cli -s=deepseek-extension run-code --filename tests/browser-check.js
playwright-cli -s=deepseek-extension close
```

If using the bundled Codex skill, replace `playwright-cli` with its `scripts/playwright_cli.sh` wrapper. Use Chromium for Testing; recent branded Chrome releases restrict sideloading via launch flags. The test profile must be separate from your everyday browser profile.

Screenshots are saved under `output/playwright/`. Core direction tests run independently with `npm test` and require no browser or npm dependencies.

For the independent tutorial example, launch a separate persistent session with the two extension flags pointing to `examples/my-first-extension` instead, then run `run-code --filename tests/tutorial-check.js`. This verifies popup loading, saving mixed-language notes, persistence, clearing, and its storage-only permissions.
