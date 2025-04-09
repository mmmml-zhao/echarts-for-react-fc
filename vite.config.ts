import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts'

import { resolve } from 'path';

const resolvePath = (str: string) => resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolvePath('src/index.ts'),
      name: 'echarts-for-react-fc',
      formats: ['es'],
      fileName(_format, entryName) {
        return `${entryName}.js`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'echarts', 'lodash-es', 'react/jsx-runtime'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        globals: {
          echarts: 'echarts',
          react: 'react',
          'react-dom': 'react-dom',
        },
      },
      plugins: [
        dts({
          tsconfigPath: './tsconfig.json', // tsconfig.json 路径
          insertTypesEntry: true,     // 生成类型入口文件
          include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx'],   // 包含的文件
          exclude: ['node_modules'], // 排除的文件
          outDir: 'dist',    // 声明文件输出目录（与 tsconfig.json 一致）
        })
      ],
    },
  },
});
