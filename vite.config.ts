import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";
import { resolve } from "path";

const resolvePath = (str: string) => resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolvePath("src/index.ts"),
      name: "echarts-for-react-hook",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "echarts", "lodash"],
      output: {
        globals: {
          echarts: "echarts",
          lodash: "lodash",
          react: "react",
          "react-dom": "react-dom",
        },
      },
      plugins: [
        typescript({
          target: "ES2022", // 这里指定编译到的版本，
          rootDir: resolvePath("src"),
          declaration: true,
          declarationDir: resolvePath("lib"),
          exclude: resolvePath("node_modules/**"),
        }),
      ],
    },
    outDir: "lib", // 打包后存放的目录文件
    sourcemap: true,
  },
});
