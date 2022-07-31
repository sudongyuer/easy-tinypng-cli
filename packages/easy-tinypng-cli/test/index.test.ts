import { cwd } from 'node:process'
import path from 'path'
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import fse from 'fs-extra'
import ora from 'ora'
import { isRecord, record } from '../src/utils'
describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })
})

it('isFileExist', async () => {
  function isFileExist(pathDir: string) {
    console.warn(pathDir, '======================================')
    return new Promise((resolve) => {
      fs.access(pathDir, fs.constants.F_OK, (err) => {
        resolve(!err)
      })
    })
  }

  const result = await isFileExist(path.resolve(cwd(), 'src/react.png'))
  expect(result).toEqual(true)
})

it('test jsonRead', () => {
  const jsonPathDir = path.resolve(cwd(), '../src/hello.json')
  const result = fse.readJSONSync(jsonPathDir)
  expect(result).toMatchSnapshot()
})

it('test pathName exist', () => {
  const pathName = path.resolve(cwd(), '../src/hello.json')
  const fileName = path.basename(pathName)
  expect(fileName).toEqual('hello.json')
})

it('test writeJsonFile', () => {
  const pathDir = path.resolve(cwd(), '../src/C.png')
  record(pathDir)
})

it('get extname', () => {
  const pathDir = path.resolve(cwd(), './src')
  const extname = path.extname(pathDir).slice(1)
  expect(extname).toEqual('text')
})

it('is record', async () => {
  const pathDir = path.resolve(cwd(), '../src/B.png')
  const recorded = await isRecord(pathDir)
  expect(recorded).toEqual(true)
})

it('test spinner', () => {
  const spinner = ora('loading').start()
  setTimeout(() => {
    spinner.color = 'yellow'
    spinner.text = 'Loading rainbows'
  }, 1000)
})
