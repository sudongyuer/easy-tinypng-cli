import path from 'node:path'
import { cwd } from 'node:process'
import fs from 'node:fs'
import tinify from 'tinify'
import chokidar from 'chokidar'
import fse from 'fs-extra'
import figlet from 'figlet'
import chalk from 'chalk'
import type { Config, ExportConfig } from './types'
// eslint-disable-next-line no-console
const log = console.log
const RecordFilePath = path.resolve(cwd(), 'record.json')
tinify.key = 'xfxl7mvvzR3kvT8bDrQQJrDJMF1sW3wJ'

function defineTinyConfig(config: ExportConfig): ExportConfig {
  return config
}

export {
  defineTinyConfig,
}
export function getAllConfigs(config: ExportConfig) {
  return config.configs
}

export async function startOptimize(configs: Config[]) {
  await ConsoleFigFont('tinypng is running 🐻 ！！！')
  // 遍历配置获取targetDir
  for (let i = 0; i < configs.length; i++) {
    const { targetDir } = configs[i]
    log(chalk.bgBlue.bold(`${targetDir} watching~~~\n`))
    chokidar.watch(path.resolve(cwd(), targetDir), {
      atomic: true,
      followSymlinks: true,
    }).on('all', (event, pathDir) => {
      // 新增时进行压缩TODO
      switch (event) {
        case 'add':
          reduceImage(pathDir, pathDir)
          break
        case 'unlink':
          autoRecord(event, pathDir)
          break
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
    // 读取json文件，判断是否存在key
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
  const fileName = getFIleName(pathDir)
  if (isExist) {
    // 读取json文件，判断是否存在key
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
  const fileName = getFIleName(pathDir)
  if (isExist) {
    // 读取json文件，判断是否存在key
    const json: Object = fse.readJSONSync(RecordFilePath)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete json[fileName]
    fse.writeJSONSync(RecordFilePath, json)
  }
}

export function getFIleName(pathDir: string) {
  return path.basename(pathDir)
}

export function getExtName(pathDir: string) {
  return path.extname(pathDir).slice(1)
}

export function autoRecord(action: 'add' | 'unlink', pathDir: string) {
  if (!isImageFIle(pathDir))
    return

  if (action === 'add')
    record(pathDir)

  if (action === 'unlink')
    removeRecord(pathDir)
}

export function isImageFIle(pathDir: string) {
  const fileExtname = getExtName(pathDir)
  const supportFiles = ['webp', 'jpeg', 'png']
  return supportFiles.includes(fileExtname)
}

export async function reduceImage(fileDir: string, targetDir: string) {
  const recorded = await isRecord(fileDir)
  if (recorded)
    return

  if (!isImageFIle(fileDir))
    return
  const fileName = getFIleName(fileDir)
  try {
    tinify.fromFile(fileDir).toFile(targetDir).then(() => {
      log(chalk.bgGreenBright(`fileDir:${fileDir} file:${fileName} compress success!`))
      autoRecord('add', fileDir)
    })
  }
  catch (err) {
    log(chalk.bgRed(`fileDir:${fileDir} file:${fileName} compress error!`))
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
