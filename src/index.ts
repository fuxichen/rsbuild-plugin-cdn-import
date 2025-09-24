import type { RsbuildPlugin } from '@rsbuild/core';
import fs from 'fs';
import path from 'path';
import auto from './autoComplete.js';
// import type { HtmlTagDescriptor, Plugin, UserConfig } from 'vite'
import type { Module, Options } from './type.js';

const isDev = process.env.NODE_ENV === 'development';

/**
 * get npm module version
 * @param name
 * @returns
 */
function getModuleVersion(name: string): string {
  const pwd = process.cwd();
  const pkgFile = path.join(pwd, 'node_modules', name, 'package.json');
  if (fs.existsSync(pkgFile)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
    return pkgJson.version;
  }

  return '';
}

/**
 * 是否完整的 url
 * @param path
 * @returns
 */
function isFullPath(path: string) {
  return path.startsWith('http:') ||
    path.startsWith('https:') ||
    path.startsWith('//')
    ? true
    : false;
}

function renderUrl(
  url: string,
  data: {
    name: string;
    version: string;
    path: string;
  },
) {
  const { path } = data;
  if (isFullPath(path)) {
    url = path;
  }
  return url
    .replace(/\{name\}/g, data.name)
    .replace(/\{version\}/g, data.version)
    .replace(/\{path\}/g, path);
}

function getModuleInfo(module: Module, prodUrl: string) {
  prodUrl = module.prodUrl || prodUrl;
  const v = module;
  const version = getModuleVersion(v.name);
  let pathList: string[] = [];
  if (!Array.isArray(v.path)) {
    pathList.push(v.path);
  } else {
    pathList = v.path;
  }

  const data = {
    ...v,
    version,
  };

  pathList = pathList.map((p) => {
    if (!version && !isFullPath(p)) {
      throw new Error(`modules: ${data.name} package.json file does not exist`);
    }
    return renderUrl(prodUrl, {
      ...data,
      path: p,
    });
  });

  let css = v.css || [];
  if (!Array.isArray(css) && css) {
    css = [css];
  }

  const cssList = !Array.isArray(css)
    ? []
    : css.map((c) =>
        renderUrl(prodUrl, {
          ...data,
          path: c,
        }),
      );

  return {
    ...v,
    version,
    pathList,
    cssList,
  };
}

export const pluginImportToCDN = (options: Options): RsbuildPlugin => ({
  name: 'plugin-cdn-import',
  enforce: 'pre',

  setup(api) {
    console.log('Hello Rsbuild!', options);

    const {
      modules = [],
      prodUrl = 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
      enableInDevMode = false,
      generateCssLinkTag,
      generateScriptTag,
    } = options;

    const isBuild = api.context.action !== 'dev';

    const data = modules.flatMap((_m) => {
      const m = typeof _m === 'string' ? auto(_m) : _m;
      const list = (Array.isArray(m) ? m : [m]).map((v) =>
        typeof v === 'function' ? v(prodUrl) : v,
      );
      return list.map((v) => getModuleInfo(v, prodUrl));
    });

    const externalMap: {
      [name: string]: string;
    } = {};

    data.forEach((v) => {
      externalMap[v.name] = v.var;
      if (Array.isArray(v.alias)) {
        v.alias.forEach((alias) => {
          externalMap[alias] = v.var;
        });
      }
    });

    api.modifyEnvironmentConfig((config) => {
      if (!isBuild && !enableInDevMode) {
        return config;
      }
      config.output.externals = {
        ...externalMap,
      };
    });

    api.modifyHTMLTags(({ headTags, bodyTags }) => {
      if (!isBuild && !enableInDevMode) {
        return { headTags, bodyTags };
      }
      data.forEach((v) => {
        v.pathList.forEach((url) => {
          const cusomize = generateScriptTag?.(v.name, url) || {};

          const attrs = {
            src: url,
            crossorigin: 'anonymous',
            ...cusomize.attrs,
          };

          headTags.push({
            tag: 'script',
            ...cusomize,
            attrs,
          });
        });
        v.cssList.forEach((url) => {
          const cusomize = generateCssLinkTag?.(v.name, url) || {};
          const attrs = {
            href: url,
            rel: 'stylesheet',
            crossorigin: 'anonymous',
            ...cusomize.attrs,
          };

          headTags.push({
            tag: 'link',
            ...cusomize,
            attrs,
          });
        });
      });
      return {
        headTags,
        bodyTags,
      };
    });
  },
});
