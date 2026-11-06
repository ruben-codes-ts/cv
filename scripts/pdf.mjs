// Renders the generated site to A4 PDFs, plus a preview image for the README, with Playwright.
// Usage: npm run generate && npm run pdf
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from '@playwright/test'

const root = 'dist'
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json' }

const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(req.url.split('?')[0]))
  if (path.endsWith('/')) path += 'index.html'
  if (!extname(path)) path += '/index.html'
  try {
    const body = await readFile(join(root, path))
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end()
  }
}).listen(0)

const base = `http://localhost:${server.address().port}`
const browser = await chromium.launch()
const page = await browser.newPage()

for (const [lang, route] of [['en', '/'], ['nl', '/nl']]) {
  await page.goto(base + route, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const out = `public/ruben-versantvoort-cv-${lang}.pdf`
  await page.pdf({ path: out, format: 'A4', preferCSSPageSize: true, printBackground: true })
  await page.pdf({ path: out.replace('public/', `${root}/`), format: 'A4', preferCSSPageSize: true, printBackground: true })
  console.log('wrote', out)
}

// README preview: the top of the English page as a site visitor sees it, without the toolbar.
const preview = await browser.newPage({ viewport: { width: 880, height: 1056 }, deviceScaleFactor: 2 })
await preview.goto(base + '/', { waitUntil: 'networkidle' })
await preview.evaluate(() => document.fonts.ready)
await preview.addStyleTag({ content: '.toolbar { display: none !important }' })
await preview.screenshot({ path: 'docs/preview.png' })
console.log('wrote docs/preview.png')

await browser.close()
server.close()
