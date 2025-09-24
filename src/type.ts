import type { HtmlBasicTag } from '@rsbuild/core';
import type { ModuleName } from './autoComplete.js';

export type GetModuleFunc = (prodUrl: string) => Module;

export interface Module {
  name: string;
  var: string;
  path: string | string[];
  /** Alias ​​of name, for example "react-dom/client" is an alias of "react-dom" */
  alias?: string[];
  css?: string | string[];
  prodUrl?: string;
}

export interface Options {
  prodUrl?: string;
  modules: (ModuleName | Module | Module[] | GetModuleFunc | GetModuleFunc[])[];
  /** Enabled in dev mode, default is false */
  enableInDevMode?: boolean;
  /** Generate the external script tag */
  generateScriptTag?: (
    name: string,
    scriptUrl: string,
  ) => Omit<HtmlBasicTag, 'tag' | 'children'>;
  /** Generate the external css link tag  */
  generateCssLinkTag?: (
    name: string,
    cssUrl: string,
  ) => Omit<HtmlBasicTag, 'tag' | 'children'>;
}
