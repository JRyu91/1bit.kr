// Run with playwright-cli run-code --filename=portfolio.browser.js against the local server.
async page => {
  const base = 'http://127.0.0.1:8765';
  await page.unroute('**/assets/bow.gif');
  await page.unroute('**/assets/bow.png');
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const check = (value, message) => {if (!value) throw new Error(message);};
  const results = [];
  for (const [width, height] of [[1440,900],[1280,800],[768,1024],[390,844],[360,800],[320,800]]) {
    await page.setViewportSize({width,height});
    for (const route of ['/', '/profile/', '/portfolio/', '/contact/']) {
      await page.goto(base + route, {waitUntil:'domcontentloaded'});
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(document.getAnimations().filter(a => a.effect.getTiming().iterations !== Infinity).map(a => a.finished));
        for (const image of document.images) {image.loading = 'eager'; await image.decode();}
      });
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route + ' overflows at ' + width);
      check(await page.locator('h1').count() === 1, route + ' heading');
      if (route !== '/') check(await page.locator('[aria-current="page"]').count() === 1, route + ' active navigation');
      await page.screenshot({path:'/tmp/1bit-after-' + (route.split('/')[1] || 'home') + '-' + width + '.png',fullPage:true});
      results.push(route + ' ' + width + ': PASS');
    }
  }
  await page.goto(base + '/portfolio/', {waitUntil:'domcontentloaded'});
  for (const [id, pdfPage] of [['personal',4],['hackathon',7],['endive',8],['bluebell',2]]) {
    const cover = page.locator('#' + id + ' .cover');
    await cover.click();
    check(await page.locator('.viewer').evaluate(el => el.open), id + ' dialog');
    check((await page.locator('.viewer iframe').getAttribute('src')).endsWith('#page=' + pdfPage), id + ' PDF page');
    check((await page.locator('#pdf-open').getAttribute('href')).endsWith('#page=' + pdfPage), id + ' original link');
    await page.getByRole('button', {name:'발표자료 닫기'}).click();
    check(await cover.evaluate(el => el === document.activeElement), id + ' focus return');
    await page.locator('#' + id + ' .button').click();
    await page.keyboard.press('Escape');
    check(!(await page.locator('.viewer').evaluate(el => el.open)), id + ' Escape');
    const pending = page.waitForEvent('download');
    await page.locator('#' + id + ' a[download]').click();
    const download = await pending;
    check((await download.failure()) === null, id + ' download');
  }
  await page.goto(base + '/contact/', {waitUntil:'domcontentloaded'});
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', {name:'이메일 복사'}).click();
  await page.getByRole('status').filter({hasText:'이메일 주소를 복사했습니다.'}).waitFor();
  check(await page.evaluate(() => navigator.clipboard.readText()) === 'ujun5190@gmail.com', 'clipboard content');
  await page.evaluate(() => {navigator.clipboard.writeText = async () => {throw new Error('denied');};});
  await page.getByRole('button', {name:'이메일 복사'}).click();
  await page.getByRole('status').filter({hasText:'선택해 복사'}).waitFor();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base, {waitUntil:'domcontentloaded'});
  check(await page.locator('.media img').evaluate(el => el.currentSrc.endsWith('bow.png')), 'reduced motion image');
  check(await page.locator('.live').evaluate(el => getComputedStyle(el,'::before').animationName) === 'none', 'reduced motion pulse');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.route('**/assets/bow.gif', route => route.abort());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => document.querySelector('.media img').currentSrc.endsWith('bow.png'));
  await page.route('**/assets/bow.png', route => route.abort());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('.media.is-empty').waitFor();
  check(await page.locator('.media-empty').isVisible(), 'image error fallback');
  await page.unroute('**/assets/bow.gif');
  await page.unroute('**/assets/bow.png');
  await page.goto(base, {waitUntil:'domcontentloaded'});
  await page.keyboard.press('Tab');
  check(await page.locator('.skip-link').evaluate(el => el === document.activeElement), 'keyboard skip link');
  await page.keyboard.press('Enter');
  check(page.url().endsWith('#main'), 'skip target');
  check(errors.length === 0, 'JavaScript errors: ' + errors.join('; '));
  return {viewports:results, interactions:'PDF pages, close, Escape, focus, downloads, clipboard, failure, reduced motion, broken images, keyboard PASS',errors};
}
