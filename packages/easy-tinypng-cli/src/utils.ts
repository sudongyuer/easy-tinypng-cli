import path from 'node:path'
import { cwd } from 'node:process'
import fs from 'node:fs'
import tinify from 'tinify'
import chokidar from 'chokidar'
import fse from 'fs-extra'
import figlet from 'figlet'
import chalk from 'chalk'
import ora from 'ora'
import type { Config, ExportConfig } from './types'
// eslint-disable-next-line no-console
const log = console.log
const RecordFilePath = path.resolve(cwd(), 'record.json')

function defineTinyConfig(config: ExportConfig): ExportConfig {
  return config
}

export {
  defineTinyConfig,
}
export function getAllConfigs(config: ExportConfig) {
  return config.configs
}

export async function startOptimize(configs: Config[], APIKey: string) {
  tinify.key = APIKey
  await ConsoleFigFont('tinypng is running ！！！')
  for (let i = 0; i < configs.length; i++) {
    const { targetDir } = configs[i]
    log(chalk.bgBlue.bold(`${targetDir} watching~~~\n`))
    chokidar.watch(path.resolve(cwd(), targetDir), {
      atomic: true,
      followSymlinks: true,
    }).on('all', (event, pathDir) => {
      switch (event) {
        case 'add':
          reduceImage(targetDir, pathDir, pathDir)
          break
        case 'unlink':
          autoRecord(targetDir, event, pathDir)
          break
        case 'change':
        default:
          break
      }
    })
  }
}

export function isPathDirectory(path: string) {
  return fs.statSync(path)?.isDirectory()
}

export function isFileExist(pathDir: string) {
  return new Promise((resolve) => {
    fs.access(pathDir, fs.constants.F_OK, (err) => {
      resolve(!err)
    })
  })
}

export async function isRecord(watchFileDir: string, pathDir: string) {
  const isExist = await isFileExist(RecordFilePath)
  if (isExist) {
    const json: Object = fse.readJSONSync(RecordFilePath)
    const isRecord = Object.prototype.hasOwnProperty.call(json, path.relative(watchFileDir, pathDir))
    return isRecord
  }
  else {
    return false
  }
}

export async function record(watchFileDir: string, pathDir: string) {
  const isExist = await isFileExist(RecordFilePath)
  if (isExist) {
    const json: Object = fse.readJSONSync(RecordFilePath)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    json[path.relative(watchFileDir, pathDir)] = path.relative(watchFileDir, pathDir)
    fse.writeJSONSync(RecordFilePath, json)
  }
  else {
    fse.writeJSONSync(RecordFilePath, { [path.relative(watchFileDir, pathDir)]: path.relative(watchFileDir, pathDir) })
  }
}

export async function removeRecord(watchFileDir: string, pathDir: string) {
  const RecordFilePath = path.resolve(cwd(), 'record.json')
  const isExist = await isFileExist(RecordFilePath)
  if (isExist) {
    const json: Object = fse.readJSONSync(RecordFilePath)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete json[path.relative(watchFileDir, pathDir)]
    fse.writeJSONSync(RecordFilePath, json)
  }
}

export function getFileName(pathDir: string) {
  return path.basename(pathDir)
}

export function getExtName(pathDir: string) {
  return path.extname(pathDir).slice(1)
}

export function autoRecord(watchFileDir: string, action: 'add' | 'unlink' | 'change', pathDir: string) {
  if (!isImageFile(pathDir))
    return

  if (action === 'add')
    record(watchFileDir, pathDir)

  if (action === 'unlink')
    removeRecord(watchFileDir, pathDir)
}

export function isImageFile(pathDir: string) {
  const fileExtname = getExtName(pathDir)
  const supportFiles = ['webp', 'jpeg', 'png']
  return supportFiles.includes(fileExtname)
}

export async function reduceImage(watchFileDir: string, fileDir: string, targetDir: string) {
  const recorded = await isRecord(watchFileDir, fileDir)
  if (recorded)
    return

  if (!isImageFile(fileDir))
    return
  const spinner = ora('Loading').start()
  try {
    spinner.color = 'blue'
    spinner.text = chalk.bold.greenBright(`compressing ${fileDir}`)
    tinify.fromFile(fileDir).toFile(targetDir).then(() => {
      autoRecord(watchFileDir, 'add', fileDir)
      spinner.succeed()
    })
  }
  catch (err) {
    spinner.fail()
  }
}

export function ConsoleFigFont(str: string) {
  return new Promise((resolve, reject) => {
    figlet(str, (err, data) => {
      if (err) {
        console.warn('Something went wrong...')
        console.warn(err)
        reject(err)
      }
      console.warn(data)
      resolve('')
    })
  })
}
