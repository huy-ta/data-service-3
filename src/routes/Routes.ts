import fs from 'fs';
import path from 'path';
import { FastifyInstance } from 'fastify';

import FileUtils from '@utils/FileUtils';

class Routes {
  private fastifyApp: FastifyInstance;

  constructor(fastifyApp: FastifyInstance) {
    this.fastifyApp = fastifyApp;
  }

  public initialize(): void {
    this.registerAllRoutes(this.getRouteControllers(0, __dirname));
  }

  private registerAllRoutes(routeTree, currentPrefixes = []): void {
    Object.keys(routeTree).forEach(route => {     
      if (typeof routeTree[route] === 'object') {
        this.registerAllRoutes(routeTree[route], [...currentPrefixes, route]);

        return;
      }

      const routePlugin = require(`./${currentPrefixes.join('/')}/${route}`).default;
      this.fastifyApp.register(
        routePlugin,
        { prefix: `/${currentPrefixes.join('/')}` }
      );
    });
  }

  private getRouteControllers(currentDepth, currentDir): object {
    const readdirOutputs = fs.readdirSync(currentDir);
    let controllerTaken = false;
    let currentResult = {};

    for (let readdirOutput of readdirOutputs) {
      if (FileUtils.isDirectory(path.join(currentDir, readdirOutput))) {
        const tempResult = this.getRouteControllers(currentDepth + 1, path.join(currentDir, readdirOutput));

        if (tempResult && typeof tempResult !== 'object' || Object.keys(tempResult).length) {
          currentResult = { ...currentResult, [readdirOutput]: tempResult };
        }

        continue;
      }

      if (currentDepth && readdirOutput.includes('Controller') && !readdirOutput.includes('.map')) {
        if (controllerTaken) {
          this.fastifyApp.log.warn(
            'There are more than one controller in the directory:', `${currentDir}.`, 
            'Only the first controller will be considered.'
          );

          continue;
        }

        const controllerName = path.parse(readdirOutput).name;
        currentResult = { [controllerName]: '' };
        controllerTaken = true;
      }
    }

    return currentResult;
  }
}

export default Routes;
