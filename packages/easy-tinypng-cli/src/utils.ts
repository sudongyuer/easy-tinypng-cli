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
          reduceImage(pathDir, pathDir)
          break
        case 'unlink':
          autoRecord(event, pathDir)
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

export async function isRecord(pathDir: string) {
  const isExist = await isFileExist(RecordFilePath)
  if (isExist) {
    const json: Object = fse.readJSONSync(RecordFilePath)
    const fileName = path.basename(pathDir)
    const isRecord = Object.prototype.hasOwnProperty.call(json, fileName)
    return isRecord
  }
  else {
    return false
  }
}

export async function record(pathDir: string) {
  const isExist = await isFileExist(RecordFilePath)
  const fileName = getFileName(pathDir)
  if (isExist) {
    const json: Object = fse.readJSONSync(RecordFilePath)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    json[fileName] = pathDir
    fse.writeJSONSync(RecordFilePath, json)
  }
  else {
    fse.writeJSONSync(RecordFilePath, { [fileName]: pathDir })
  }
}

export async function removeRecord(pathDir: string) {
  const RecordFilePath = path.resolve(cwd(), 'record.json')
  const isExist = await isFileExist(RecordFilePath)
  const fileName = getFileName(pathDir)
  if (isExist) {
    const json: Object = fse.readJSONSync(RecordFilePath)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete json[fileName]
    fse.writeJSONSync(RecordFilePath, json)
  }
}

export function getFileName(pathDir: string) {
  return path.basename(pathDir)
}

export function getExtName(pathDir: string) {
  return path.extname(pathDir).slice(1)
}

export function autoRecord(action: 'add' | 'unlink' | 'change', pathDir: string) {
  if (!isImageFile(pathDir))
    return

  if (action === 'add')
    record(pathDir)

  if (action === 'unlink')
    removeRecord(pathDir)
}

export function isImageFile(pathDir: string) {
  const fileExtname = getExtName(pathDir)
  const supportFiles = ['webp', 'jpeg', 'png']
  return supportFiles.includes(fileExtname)
}

export async function reduceImage(fileDir: string, targetDir: string) {
  const recorded = await isRecord(fileDir)
  if (recorded)
    return

  if (!isImageFile(fileDir))
    return
  const spinner = ora('Loading').start()
  try {
    spinner.color = 'blue'
    spinner.text = chalk.bold.greenBright(`compressing ${fileDir}`)
    tinify.fromFile(fileDir).toFile(targetDir).then(() => {
      autoRecord('add', fileDir)
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
