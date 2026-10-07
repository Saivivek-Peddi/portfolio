import { expect, test, type Page } from '@playwright/test'

const PAGES = ['/', '/notes/', '/notes/the-loop-should-be-yours/', '/404.html']

function collectErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  return errors
}

for (const path of PAGES) {
  test(`${path} renders, hydrates cleanly and has SEO tags`, async ({ page }) => {
    const errors = collectErrors(page)
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page).toHaveTitle(/.+/)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\.jpg$/)
    await page.waitForLoadState('networkidle')
    expect(errors).toEqual([])
  })
}

test('home has every section and no horizontal overflow', async ({ page }) => {
  await page.goto('/')
  for (const id of ['about', 'story', 'built', 'life', 'lens', 'community', 'research', 'writing', 'contact']) {
    await expect(page.locator(`#${id}`)).toBeAttached()
  }
  await expect(page.locator('#built article')).toHaveCount(8)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('prerendered HTML carries the content without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('great dosa')
  await expect(page.getByText('svp@mlpal.ai').first()).toBeVisible()
  await context.close()
})

test('hero degrades to the static backdrop without a GPU, and stickers still work', async ({ page }) => {
  const logs: string[] = []
  page.on('console', (m) => logs.push(m.text()))
  await page.goto('/')
  // CI browsers rasterize WebGL in software, which the hero deliberately skips.
  await expect.poll(() => logs.some((l) => l.includes('[hero] WebGL'))).toBe(true)
  await expect(page.locator('section[aria-labelledby="hero-title"] canvas')).toHaveCount(2)
  await page.mouse.click(400, 400)
  const drawn = await page.locator('section[aria-labelledby="hero-title"] canvas').nth(1).evaluate(async (c: HTMLCanvasElement) => {
    await new Promise((r) => setTimeout(r, 600))
    const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data
    for (let i = 3; i < data.length; i += 4) if (data[i] > 0) return true
    return false
  })
  expect(drawn).toBe(true)
})

test('theme toggle cycles and persists', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const html = page.locator('html')
  await expect(html).toHaveAttribute('data-theme', 'dark')
  const toggle = page.getByRole('button', { name: /Change theme/ })
  await toggle.click() // auto -> light
  await expect(html).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(html).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: /Change theme/ }).click() // light -> dark
  await expect(html).toHaveAttribute('data-theme', 'dark')
})

test('status bar ink turns white over the black footer in light theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(page.locator('header').first()).toHaveClass(/text-white/)
})

test('reduced motion: words are visible and the finale still renders', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(page.getByRole('link', { name: 'svp@mlpal.ai' })).toBeVisible()
  await context.close()
})

test('feeds list every note', async ({ request }) => {
  const rss = await (await request.get('/rss.xml')).text()
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(rss).toContain('https://www.svpeddi.com/notes/the-loop-should-be-yours/')
  expect(sitemap).toContain('https://www.svpeddi.com/notes/the-loop-should-be-yours/')
})

test('badminton rally counts hits', async ({ page, isMobile }) => {
  test.skip(isMobile, 'pointer aiming is desktop-only in this test')
  await page.goto('/')
  await page.locator('#life').scrollIntoViewIfNeeded()
  const court = page.getByRole('application', { name: /Badminton mini-game/ })
  // locator.click waits for the element to stop moving (smooth scroll settles first).
  const shuttle = court.locator('[data-ready]')
  await expect(shuttle).toHaveAttribute('data-ready', 'true')
  // Smooth scroll keeps easing for a moment after the jump; retry until a hit lands.
  await expect(async () => {
    await shuttle.click()
    await expect(page.getByText(/Rally [1-9]/)).toBeVisible({ timeout: 400 })
  }).toPass({ timeout: 10_000 })
})

test('Project Hail Mary says hi', async ({ page }) => {
  await page.goto('/')
  const book = page.getByRole('button', { name: /Project Hail Mary/ })
  await book.scrollIntoViewIfNeeded()
  await book.click()
  await expect(book).toContainText('Fist my bump')
})

test('hero introduces Sai once, with the nickname', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('section[aria-labelledby="hero-title"]')
  await expect(hero.getByText("I'm Sai. Close friends call me Peddi.")).toBeVisible()
  const text = (await hero.innerText()).toLowerCase()
  expect(text.match(/\bsai\b/g)?.length).toBe(1)
  expect(text.match(/dosa/g)?.length).toBe(1)
})

test('photo lightbox opens, steps and closes', async ({ page }) => {
  await page.goto('/')
  const first = page.locator('#lens button[aria-label^="Open photo"]:visible').first()
  await first.scrollIntoViewIfNeeded()
  await first.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveAttribute('aria-label', 'Black-necked stilt')
  await page.keyboard.press('ArrowRight')
  await expect(dialog).toHaveAttribute('aria-label', 'Milky Way')
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
})

test('sound toggle starts and stops the soundtrack', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the sound toggle is shown on desktop only')
  await page.addInitScript(() => {
    const w = window as unknown as { __osc: number }
    w.__osc = 0
    const create = AudioContext.prototype.createOscillator
    AudioContext.prototype.createOscillator = function () {
      w.__osc++
      return create.call(this)
    }
  })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: /Sound/ })
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(() => page.evaluate(() => (window as unknown as { __osc: number }).__osc)).toBeGreaterThan(5)
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
})

test('closing quote is shown whole, without pinning the page', async ({ page }) => {
  await page.goto('/')
  const quote = page.getByRole('region', { name: 'Closing quote' })
  await quote.scrollIntoViewIfNeeded()
  await expect(quote).toContainText("Success is not final. Failure is not fatal. It's the courage to continue that counts.")
  const h = await quote.evaluate((el) => el.getBoundingClientRect().height)
  expect(h).toBeLessThan(1.5 * (await page.evaluate(() => innerHeight)))
})
