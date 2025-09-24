# rsbuild-plugin-cdn-import

Allows you to specify modules to be introduced in a production environment using a CDN.

This can reduce build time and improve page load speed in production environments.

Fork by [vite-svg-loader](https://github.com/MMF-FE/vite-plugin-cdn-import)

<p>
  <a href="https://npmjs.com/package/rsbuild-plugin-cdn-import">
   <img src="https://img.shields.io/npm/v/rsbuild-plugin-cdn-import?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/rsbuild-plugin-cdn-import?minimal=true"><img src="https://img.shields.io/npm/dm/rsbuild-plugin-cdn-import.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

## Usage

Install:

```bash
npm add rsbuild-plugin-cdn-import -D
```

Add plugin to your `rsbuild.config.ts`:

```ts
// rsbuild.config.ts
import { pluginImportToCDN } from "rsbuild-plugin-cdn-import";

export default {
  plugins: [pluginImportToCDN()],
};
```

## Options

### foo

Some description.

- Type: `string`
- Default: `undefined`
- Example:

```js
pluginImportToCDN({
  'vue',
  // 或者使用自定配置
  // {
  //   name: 'vue',
  //   var: 'Vue',
  //   path: 'dist/vue.global.prod.js',
  // },
});
```

## License

[MIT](./LICENSE).
