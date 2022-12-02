import glob from 'glob';
import path, { parse } from 'path';

const extenderModelGlobs = glob.sync('./dist/modules/**/*.entity.js', {
  cwd: __dirname
});

let extenderModels = {};

extenderModelGlobs.forEach((fn) => {
  const loaded = require(fn);
  const parsed = parse(fn);
  const rawname = parsed.name;

  if (loaded) {
    Object.entries(loaded).map(([, val]) => {
      extenderModels[rawname] = val;
    });
  }
});

const modelGlobs = glob.sync(
  './node_modules/@medusajs/medusa/dist/models/**/*.js',
  {
    cwd: __dirname,
    ignore: ['index.js']
  }
);

export const getModels = () => {
  let models: any[] = [];

  modelGlobs.forEach((fn) => {
    const loaded = require(fn);
    const parsed = parse(fn);
    const rawname = parsed.name;

    if (loaded) {
      Object.entries(loaded).map(([, val]) => {
        if (extenderModels[rawname]) {
          models.push(extenderModels[rawname]);
        } else {
          models.push(val);
        }
      });
    }
  });

  return models;
};

export const getMigrations = () => {};
