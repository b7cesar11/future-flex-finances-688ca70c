// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      allowedHosts: true,
    },
    resolve: {
      alias: {
        // Força o uso da versão ESM da tslib para evitar erros de destructuring no Vercel SSR
        "tslib": "tslib/tslib.es6.js",
      },
    },
    ssr: {
      noExternal: ["tslib", "@supabase/supabase-js", "@supabase/functions-js", "@supabase/postgrest-js", "@supabase/auth-js", "@supabase/realtime-js", "@supabase/storage-js"],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
});
