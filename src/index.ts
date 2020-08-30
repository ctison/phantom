'phantombuster package: 5'
'phantombuster command: nodejs'
'phantombuster flags: save-folder'

import Buster from 'phantombuster'
import puppeteer from 'puppeteer'

const buster = new Buster()

async function main() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()

  await page.goto('https://news.ycombinator.com')
  await page.waitForSelector('#hnmain')

  const hackerNewsLinks = await page.evaluate(() => {
    const data: { title: string; url?: string }[] = []
    document
      .querySelectorAll<HTMLAnchorElement>('a.storylink')
      .forEach((element) => {
        data.push({
          title: element.text,
          url: element.getAttribute('href') ?? undefined,
        })
      })
    return data
  })

  await buster.setResultObject(hackerNewsLinks)

  await page.close()
  await browser.close()
  process.exit()
}

main()
