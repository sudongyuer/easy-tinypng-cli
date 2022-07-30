import { loadConfig } from 'unconfig'
import type { ExportConfig } from './types'
import { getAllConfigs, startOptimize } from './utils'
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
startOptimize(configs)

