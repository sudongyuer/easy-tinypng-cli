import { loadConfig } from 'unconfig'
import type { ExportConfig } from './types'
import { getAllConfigs, startOptimize } from './utils.js'
const { config } = await loadConfig<ExportConfig>({
  sources: [
    {
      files: 'tiny.config',
      extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
    },
  ],
})

const configs = getAllConfigs(config)
startOptimize(configs)

