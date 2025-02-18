const aperture = require('aperture')()
const robot = require('robotjs')
const wait = require('delay')
const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

class MacRunner {
  constructor(commands = []) {
    this.commands = commands
  }

  /**
   * @return {{screenWidth: number, screenHeight: number}} The main screen size
   */
  static getScreenSize() {
    const { width, height } = robot.getScreenSize()
    return { screenWidth: width, screenHeight: height }
  }

  /**
   * @return {number} The Dock height
   */
  static getDockHeight() {
    return 76
  }

  /**
   * @return {number} The Menu Bar height
   */
  static getMenuBarHeight() {
    return 22
  }

  /**
   * Set MacOS defaults system
   * @param {*} domain Application domain
   * @param {*} key Default key
   * @param {*} params Values for the default
   * @param {*} expectedResult Expected defaults read result
   */
  setDefault(domain, key, params, expectedResult) {
    return this.register(async () => {
      const defaultCommand = `defaults write ${domain} ${key} ${params}`

      // Retry command until it works (sometimes it doesn't...)
      for (let i = 10; i--; i > 0) {
        try {
          await execCommand(defaultCommand, 100)
          const result = await execCommand(`defaults read ${domain} ${key}`, 0)
          if (expectedResult === result.trim()) {
            break
          }
        } catch (error) {
          console.error(error)
        }

        if (i === 1) {
          throw new Error(`[${defaultCommand}] failed (too much trials)`)
        }
      }
    })
  }

  /**
   * Read MacOS defaults system
   * @param {*} domain Application domain
   * @param {*} key Default key
   */
  readDefault(domain, key) {
    return this.register(async () => {
      const defaultCommand = `defaults read ${domain} | grep ${key}`
      console.log(await execCommand(defaultCommand, 0))
    })
  }

  /**
   * Delete MacOS defaults system
   * @param {*} domain Application domain
   * @param {*} key Default key
   */
  deleteDefault(domain, key) {
    return this.register(async () => {
      const defaultCommand = `defaults delete ${domain} ${key}`
      await execCommand(defaultCommand)
    })
  }

  /**
   * Open an application from it's name
   * @param {*} appName Application name (ex: Finder)
   * @param {*} params Application parameters
   */
  openApp(appName, params = '') {
    return this.register(() => execCommand(`open -a "${appName}" ${params}`))
  }

  /**
   * Make active a running application
   * @param {*} appName Application name
   */
  activateApp(appName) {
    return this.register(() =>
      execCommand(`osascript -e 'tell application "${appName}" to activate'`)
    )
  }

  /**
   * Kill an application from it's name
   * @param {*} appName Application name
   */
  killApp(appName) {
    return this.register(() => execCommand(`killall ${appName}`))
  }

  /**
   * Move and resize an application window
   * @param {*} appName Application name
   * @param {*} x X coordinate (from the left of the screen)
   * @param {*} y Y coordinate (from the top of the screen)
   * @param {*} width Width of the app window
   * @param {*} height Height of the app window
   */
  moveAndResizeApp(appName, x, y, width, height) {
    const h = { start: x, end: x + width }
    const v = { start: y, end: y + height }
    return this.register(() =>
      execCommand(
        `osascript -e 'tell application "${appName}" to set the bounds of the first window to {${h.start}, ${v.start}, ${h.end}, ${v.end}}'`
      )
    )
  }

  /**
   * Capture the whole screen into a file
   * @param {*} output Output file name (png)
   */
  captureScreen(output) {
    return this.register(async () => {
      await this.wait(2000)
      execCommand(`screencapture ${output}`)
    })
  }

  /**
   * Capture a screen rect into a file
   * @param {*} x X coordinate (from the left of the screen)
   * @param {*} y Y coordinate (from the top of the screen)
   * @param {*} width Width of the capture
   * @param {*} height Height of the capture
   * @param {*} output Output file name (png)
   */
  captureScreenRect(x, y, width, height, output) {
    return this.register(() =>
      execCommand(`screencapture -R${x},${y},${width},${height} ${output}`)
    )
  }

  /**
   * Capture the app window into a file
   * @param {*} appName Application name to capture
   * @param {*} output Output file name (png)
   * @param {boolean} disableShadow Do not capture the App shadow
   */
  captureApp(appName, output, disableShadow = true) {
    return this.register(() =>
      execCommand(
        `screencapture ${
          disableShadow ? '-o' : ''
        } -l$(osascript -e 'tell app "${appName}" to id of window 1') ${output}`
      )
    )
  }

  /**
   * Start the video recording using aperturejs
   * @param {*} options aperturejs options
   */
  startVideo(options) {
    return this.register(async () => {
      console.info('   Start video recording...')
      await aperture.startRecording(options)
      await aperture.isFileReady
    })
  }

  /**
   * Stop the video recording
   * @param {*} output video file output
   */
  stopVideo(output) {
    return this.register(async () => {
      console.info('   Stop video recording...')
      const fp = await aperture.stopRecording()
      if (fs.existsSync(output)) {
        fs.unlinkSync(output)
      }
      fs.renameSync(fp, output)
    })
  }

  /**
   * Wait for a given delay
   * @param {*} delay Delay in ms
   */
  wait(delay) {
    return this.register(() => wait(delay))
  }

  /**
   * Execute the runner with all given commands
   */
  async run() {
    await this.commands.reduce((p, fn) => p.then(fn), Promise.resolve())
  }

  register(command) {
    this.commands.push(command)
    return new MacRunner(this.commands)
  }
}

async function execCommand(command, delay = 1000) {
  console.info(`   Command: [${command}]`)
  const { stderr, stdout } = await exec(command)
  if (stderr) {
    throw new Error(stderr)
  }
  await wait(delay)
  return stdout
}

module.exports = MacRunner
