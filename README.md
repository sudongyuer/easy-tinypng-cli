# easy-tinypng-cli

A cli can automatically compress images with [tinypng.com.](https://tinypng.com/)

[![NPM version](https://badge.fury.io/js/easy-tinypng-cli.png)](https://www.npmjs.com/package/easy-tinypng-cli)


<p align='center'>
<img src='https://git.poker/sudongyuer/image-bed/blob/master/20220731/easy-tinypng-cli.png?raw=true' width='200'/>
</p>

## Why

When delevoping a website, we often need to `compress` `images` to reduce the `network io` cast.In normal way, we may need four steps to compress images: 
1. download images from the internet
2. upload the image to [tinypng.com](https://tinypng.com/)  
3. download the compressed image from [tinypng.com](https://tinypng.com/)  
4. copy the compressd images into our workspace

The above steps are very time-consuming. So !!! this `cli` can automatically compress images in background process. It will watch the fileSystem changes to auto handle if there are any images that need to be compressed.

## 🚀 Features

- 💾 Support configuration file
- 🍁 Multiple directory watching
- ✨ Support HMR
- 🦋 Auto detection nested directory images and compress them
- 🌝 Background process will not block the main thread
- 🐻‍❄️ Compressed record logging to avoid repeated compression

<p align="center">
<img src="https://git.poker/sudongyuer/image-bed/blob/master/20220731/easy-tinypng-cli-preview.xkrdjpi00ao.gif?raw=true" alt="vite-plugin-vue-inspector">
</p>

## Usage

### Install

```ball
pnpm add -D easy-tinypng-cli
```

### Config `tiny.config.ts`

- APIKey (required) : the API key of [tinypng.com](https://tinypng.com/), you can get it from [tinypng.com](https://tinypng.com/)

- targetDir (required) : the top directory that you want to compress images


```js
import { defineTinyConfig } from 'easy-tinypng-cli/utils'

export default defineTinyConfig({
  configs: [
    {
      targetDir: './src/images',
    },
  ],
  APIKey: 'xxxxxxxxx',
})

```
### Add Script in `package.json`

```js
{
  "scripts": {
    "optimizeImages": "tiny"
  }
}
```

## Author

sudongyuer email:976499226@qq.com

## License

[MIT](./LICENSE) License © 2021 [SuDongYu](https://github.com/sudongyuer)
