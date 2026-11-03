import { defineConfig } from 'vitest/config';
import voltoVitestConfig from '@plone/volto/vitest.config.mjs';
import path from 'path';
import { createRequire } from 'module';

const voltoPath = path.resolve(__dirname, '../../core/packages/volto');
// Dependências que o Volto fornece em runtime (via webpack) são resolvidas
// a partir do próprio pacote do Volto, já que o pnpm isola os pacotes.
const requireFromVolto = createRequire(path.join(voltoPath, 'package.json'));
const fromVolto = (pkg) =>
  path.dirname(requireFromVolto.resolve(`${pkg}/package.json`));

const addonAliases = {
  '@plone/volto': path.join(voltoPath, 'src'),
  'react-intl': fromVolto('react-intl'),
  'semantic-ui-react': fromVolto('semantic-ui-react'),
};

// O config do Volto define "projects", cada um com seus próprios aliases;
// só o projeto "volto" interessa ao add-on.
const voltoProject = voltoVitestConfig.test.projects.find(
  (project) => project.test.name === 'volto',
);

export default defineConfig({
  ...voltoVitestConfig,
  test: {
    ...voltoVitestConfig.test,
    projects: [
      {
        ...voltoProject,
        resolve: {
          alias: { ...voltoProject.resolve.alias, ...addonAliases },
        },
      },
    ],
  },
});
