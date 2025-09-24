import { defineConfig } from '@rsbuild/core';
import { pluginImportToCDN } from '../src';

export default defineConfig({
  plugins: [
    pluginImportToCDN({
      prodUrl: 'https://unpkg.com/{name}@{version}/{path}',
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: 'dist/vue.global.prod.js',
        },
      ],
    }),
  ],
});
