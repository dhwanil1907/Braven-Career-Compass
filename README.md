# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Wayfinder chat (Perplexity)

The Wayfinder tab (`/assistant`) calls `/api/chat`, a server function (`api/chat.ts`) that forwards questions to
Perplexity's Sonar API (live web search built in) together with matching listings from our catalog. The key never
reaches the browser.

Set these as environment variables (never commit them):

| Name | Required | Notes |
| --- | --- | --- |
| `PERPLEXITY_API_KEY` | yes | Key from perplexity.ai/settings/api. Without it the chat shows "not set up yet". |
| `PERPLEXITY_MODEL` | no | Defaults to `sonar`; `sonar-pro` is more accurate but slower. |

- **Local:** put them in `.env` (gitignored) and run `npm run dev`; the dev server serves `/api/chat`.
- **Vercel:** Project Settings, Environment Variables, then redeploy.
- Questions are limited to 800 characters and 20 per 10 minutes per visitor. A student's major,
  interests, year and goal are sent with each question; nothing else about them is.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
