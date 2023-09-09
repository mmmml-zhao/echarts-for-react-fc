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
      fileName: (format) => `echarts-for-react-hook.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "echarts"],
      output: {
        globals: {
          react: "react",
          echarts: "echarts",
          "react-dom": "react-dom",
        },
      },
      plugins: [
        typescript({
          target: "ES2022", // 这里指定编译到的版本，
          rootDir: resolvePath("src/"),
          declaration: true,
          declarationDir: resolvePath("dist"),
          exclude: resolvePath("node_modules/**"),
          allowSyntheticDefaultImports: true,
        }),
      ],
    },
  },
});
