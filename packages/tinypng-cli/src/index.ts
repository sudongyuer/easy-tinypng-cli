import path from 'path'
import { cwd } from 'node:process'
import tinify from 'tinify'
import { loadConfig } from 'unconfig'
import chokidar from 'chokidar'
import type { Config, ExportConfig } from './types'
const { config } = await loadConfig<ExportConfig>({
  sources: [
    {
      files: 'tiny.config',
      extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
    },
  ],
})
// 获取config
const configs = getAllConfigs(config)
// 监听targetDir
// 记录日志
// tinify.key = 'xfxl7mvvzR3kvT8bDrQQJrDJMF1sW3wJ'
// tinify.fromFile('./src/react.png').toFile('./src/react.png')

function getAllConfigs(config: ExportConfig) {
  return config.configs
}

function startOptimize(configs: Config[]) {
// 遍历配置获取targetDir
  for (let i = 0; i < configs.length; i++) {
    const { targetDir } = configs[i]
    chokidar.watch(path.resolve(cwd(), targetDir), {
      ignoreInitial: true,
      atomic: true,
      followSymlinks: true,
    }).on('all', (event, pathDir) => {
      // 新增时进行压缩TODO
      // 删除时TODO
    })
  }
}
