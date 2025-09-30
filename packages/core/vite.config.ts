import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { name } from "./package.json";

const externalPackages = ["csstype"];

export default defineConfig({
  resolve: {
    dedupe: externalPackages,
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name,
    },
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      external: externalPackages,
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          dir: "dist",
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          dir: "dist",
        },
      ],
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "./dist",
    }),
  ],
});
