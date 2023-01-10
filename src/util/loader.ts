import fs from 'node:fs/promises';
import path from 'node:path';
import { load as esmLoad } from '@esbuild-kit/esm-loader';
import yaml from 'js-yaml';
import { require } from '../util/require.js';
import { loadJSON } from './fs.js';
import { logIfDebug } from './log.js';
import { timerify } from './performance.js';

const load = async (filePath: string) => {
  try {
    if (path.extname(filePath) === '.json' || /rc$/.test(filePath)) {
      return loadJSON(filePath);
    }

    if (path.extname(filePath) === '.yaml' || path.extname(filePath) === '.yml') {
      return yaml.load((await fs.readFile(filePath)).toString());
    }

    const imported = await esmLoad(filePath, {}, require);
    return imported.default ?? imported;
  } catch (error) {
    logIfDebug(error);
  }
};

export const _load = timerify(load);
