import { chromium } from 'playwright';

const url = 'http://localhost:5174/?mode=edit';
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

console.log('=== TITLE ===', await page.title());
console.log('=== console errors ===');
console.log(errors.join('\n') || '(none)');
console.log('=== BODY TEXT (first 1500 chars) ===');
console.log((await page.locator('body').innerText()).slice(0, 1500));
await page.screenshot({ path: '/tmp/shot.png', fullPage: false });
console.log('=== screenshot saved ===');

await browser.close();
