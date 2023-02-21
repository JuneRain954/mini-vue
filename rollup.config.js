import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' assert {type: "json"};

export default {
  // TODO 指定入口文件
  input: "./src/index.ts",
  // TODO 指定出口路径
  output: [
    // cjs => commonjs 规范的打包配置
    {
      format: "cjs", // 格式
      // file: "lib/guide-mini-vue.cjs.js", // 文件输出路径以及名称
      file: pkg.main,
    },
    // esm => import方式导包的规范的打包配置
    {
      format: "es", // 格式
      // file: "lib/guide-mini-vue.esm.js", // 文件输出路径以及名称
      file: pkg.module,
    },
  ],
  // TODO 使用插件
  plugins: [
    typescript(),
  ]
}