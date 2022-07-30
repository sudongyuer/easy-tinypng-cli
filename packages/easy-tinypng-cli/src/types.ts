export interface Config {
  targetDir: string
}

export interface ExportConfig {
  configs: Array<Config>
  APIKey: string
}
