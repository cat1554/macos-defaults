const fs = require('fs')
jest.mock('fs')

const writeConfig = require('./write-config')

const templatesPath = 'templates'
const destinationPath = 'dist'
const copiedFiles = ['favicon.ico']

describe('write-config', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('no categories', () => {
    beforeEach(() => callWriteConfig({ url: '/', home: 'Home', defaults: { categories: null } }))

    it('should copy some static files', () => {
      copiedFiles.forEach(file => {
        const fileContent = readFile(`${destinationPath}/${file}`)
        expect(fileContent).toEqual(`copied:${templatesPath}/${file}`)
      })
    })

    it('should write a sidebar config file using the sidebar template', () => {
      const sidebarConfigContent = readFile(`${destinationPath}/_sidebar.md`)
      expect(sidebarConfigContent).toMatchSnapshot()
    })

    it('should write a navbar config file using the navbar template', () => {
      const navbarConfigContent = readFile(`${destinationPath}/_navbar.md`)
      expect(navbarConfigContent).toMatchSnapshot()
    })

    it('should write an index config file using the index template', () => {
      const indexConfigContent = readFile(`${destinationPath}/index.html`)
      expect(indexConfigContent).toMatchSnapshot()
    })
  })

  describe('one category, no page', () => {
    beforeEach(() =>
      callWriteConfig({
        url: '/',
        home: 'Home',
        defaults: { 
          categories: [
            {
              folder: 'category',
              name: 'Category',
              description: 'Category description.',
              image: {
                filename: 'category.png',
                width: 740,
                height: 80
              }
            }
          ]
        }
      })
    )

    it('should copy some static files', () => {
      copiedFiles.forEach(file => {
        const fileContent = readFile(`${destinationPath}/${file}`)
        expect(fileContent).toEqual(`copied:${templatesPath}/${file}`)
      })
    })

    it('should write a sidebar config file using the sidebar template', () => {
      const sidebarConfigContent = readFile(`${destinationPath}/_sidebar.md`)
      expect(sidebarConfigContent).toMatchSnapshot()
    })

    it('should write a navbar config file using the navbar template', () => {
      const navbarConfigContent = readFile(`${destinationPath}/_navbar.md`)
      expect(navbarConfigContent).toMatchSnapshot()
    })

    it('should write an index config file using the index template', () => {
      const indexConfigContent = readFile(`${destinationPath}/index.html`)
      expect(indexConfigContent).toMatchSnapshot()
    })
  })

  describe('one category, one page', () => {
    beforeEach(() =>
      callWriteConfig({
        url: '/',
        home: 'Home',
        defaults: { 
          categories: [
            {
              folder: 'category',
              name: 'Category',
              description: 'Category description.',
              keys: [
                {
                  key: 'page',
                  domain: 'com.apple.category',
                  title: 'Page',
                  description: 'Page description.',
                  param: { type: 'string' },
                  examples: [
                    {
                      value: '~/Desktop',
                      default: true,
                      text: 'output when value is ~/Desktop'
                    },
                    {
                      value: '~/Pictures',
                      text: 'output when value is ~/Pictures'
                    }
                  ],
                  versions: ['Big Sur']
                }
              ]
            }
          ]
        }
      })
    )

    it('should copy some static files', () => {
      copiedFiles.forEach(file => {
        const fileContent = readFile(`${destinationPath}/${file}`)
        expect(fileContent).toEqual(`copied:${templatesPath}/${file}`)
      })
    })

    it('should write a sidebar config file using the sidebar template', () => {
      const sidebarConfigContent = readFile(`${destinationPath}/_sidebar.md`)
      expect(sidebarConfigContent).toMatchSnapshot()
    })

    it('should write a navbar config file using the navbar template', () => {
      const navbarConfigContent = readFile(`${destinationPath}/_navbar.md`)
      expect(navbarConfigContent).toMatchSnapshot()
    })

    it('should write an index config file using the index template', () => {
      const indexConfigContent = readFile(`${destinationPath}/index.html`)
      expect(indexConfigContent).toMatchSnapshot()
    })
  })

  describe('one category, two pages', () => {
    beforeEach(() =>
      callWriteConfig({
        url: '/',
        home: 'Home',
        defaults: { 
          categories: [
            {
              folder: 'category',
              name: 'Category',
              description: 'Category description.',
              keys: [
                {
                  key: 'page1',
                  domain: 'com.apple.category',
                  title: 'Page 1',
                  description: 'Page 1 description.',
                  param: { type: 'bool' },
                  examples: [
                    {
                      value: true,
                      default: true,
                      text: 'output when value is true'
                    },
                    {
                      value: false,
                      text: 'output when value is false'
                    }
                  ],
                  versions: ['Big Sur']
                },
                {
                  key: 'page2',
                  domain: 'com.apple.category',
                  title: 'Page 2',
                  description: 'Page 2 description.',
                  param: { type: 'bool' },
                  examples: [
                    {
                      value: true,
                      text: 'output when value is true'
                    },
                    {
                      value: false,
                      default: true,
                      text: 'output when value is false'
                    }
                  ],
                  versions: ['Big Sur']
                }
              ]
            }
          ]
        }
      })
    )

    it('should copy some static files', () => {
      copiedFiles.forEach(file => {
        const fileContent = readFile(`${destinationPath}/${file}`)
        expect(fileContent).toEqual(`copied:${templatesPath}/${file}`)
      })
    })

    it('should write a sidebar config file using the sidebar template', () => {
      const sidebarConfigContent = readFile(`${destinationPath}/_sidebar.md`)
      expect(sidebarConfigContent).toMatchSnapshot()
    })

    it('should write a navbar config file using the navbar template', () => {
      const navbarConfigContent = readFile(`${destinationPath}/_navbar.md`)
      expect(navbarConfigContent).toMatchSnapshot()
    })

    it('should write an index config file using the index template', () => {
      const indexConfigContent = readFile(`${destinationPath}/index.html`)
      expect(indexConfigContent).toMatchSnapshot()
    })
  })

  describe('two categories, one page in each', () => {
    beforeEach(() =>
      callWriteConfig({
        url: '/',
        home: 'Home',
        defaults: { 
          categories: [
            {
              folder: 'category1',
              name: 'Category 1',
              description: 'Category 1 description.',
              keys: [
                {
                  key: 'page',
                  domain: 'com.apple.category1',
                  title: 'Page',
                  description: 'Page description.',
                  param: { type: 'bool' },
                  examples: [
                    {
                      value: true,
                      default: true,
                      text: 'output when value is true'
                    },
                    {
                      value: false,
                      text: 'output when value is false'
                    }
                  ],
                  versions: ['Big Sur']
                }
              ]
            },
            {
              folder: 'category2',
              name: 'Category 2',
              description: 'Category 2 description.',
              keys: [
                {
                  key: 'page',
                  domain: 'com.apple.category2',
                  title: 'Page',
                  description: 'Page description.',
                  param: { type: 'bool' },
                  examples: [
                    {
                      value: true,
                      text: 'output when value is true'
                    },
                    {
                      value: false,
                      default: true,
                      text: 'output when value is false'
                    }
                  ],
                  versions: ['Big Sur']
                }
              ]
            }
          ]
        }
      })
    )

    it('should copy some static files', () => {
      copiedFiles.forEach(file => {
        const fileContent = readFile(`${destinationPath}/${file}`)
        expect(fileContent).toEqual(`copied:${templatesPath}/${file}`)
      })
    })

    it('should write a sidebar config file using the sidebar template', () => {
      const sidebarConfigContent = readFile(`${destinationPath}/_sidebar.md`)
      expect(sidebarConfigContent).toMatchSnapshot()
    })

    it('should write a navbar config file using the navbar template', () => {
      const navbarConfigContent = readFile(`${destinationPath}/_navbar.md`)
      expect(navbarConfigContent).toMatchSnapshot()
    })

    it('should write an index config file using the index template', () => {
      const indexConfigContent = readFile(`${destinationPath}/index.html`)
      expect(indexConfigContent).toMatchSnapshot()
    })
  })
})

const supportedLanguages = {
  languages: [
    { url: '/fr/', lang: 'fr-FR' },
    { url: '/', lang: 'en-US' }
  ],
}
const callWriteConfig = supportedLanguage => writeConfig(supportedLanguage, supportedLanguages, templatesPath, destinationPath, true)
const readFile = file => fs.readFakeFileSync(file, 'utf8')
