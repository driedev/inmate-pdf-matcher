import { chromium } from 'playwright';
import { Inmate } from '@shared/schema';
import { randomUUID } from 'crypto';

export async function scrapeInmates(): Promise<Inmate[]> {
  const inmates: Inmate[] = [];
  const browser = await chromium.launch();
  
  try {
    const page = await browser.newPage();

    // Scrape Madison County
    try {
      await page.goto('https://www.madisoncountysheriffal.org/inmate-roster', { waitUntil: 'networkidle' });
      // Example selector structure, would need to be adjusted based on the actual live DOM
      const madisonInmates = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.inmate-card')).map((el) => {
          const nameEl = el.querySelector('.inmate-name');
          const photoEl = el.querySelector('img.inmate-photo');
          const idEl = el.querySelector('.booking-id');
          
          return {
            fullName: nameEl?.textContent?.trim() || 'Unknown',
            photoUrl: photoEl?.getAttribute('src') || undefined,
            bookingId: idEl?.textContent?.replace(/[^0-9]/g, '') || undefined,
          };
        });
      });
      
      inmates.push(...madisonInmates.map(i => ({ ...i, source: 'Madison County', id: randomUUID() })));
    } catch (e) {
      console.error("Error scraping Madison County:", e);
    }

    // Scrape Limestone County
    try {
      // Note: This portal often requires interaction or hash navigation. 
      // Simplified example.
      await page.goto('https://limestone-al-911.zuercherportal.com/#/inmates', { waitUntil: 'networkidle' });
      // Example waiting for the table
      await page.waitForSelector('.table', { timeout: 5000 }).catch(() => {});
      
      const limestoneInmates = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('tr.inmate-row')).map((el) => {
           const nameEl = el.querySelector('.name-col');
           const photoEl = el.querySelector('.photo-col img');
           const idEl = el.querySelector('.id-col');
           
           return {
             fullName: nameEl?.textContent?.trim() || 'Unknown',
             photoUrl: photoEl?.getAttribute('src') || undefined,
             bookingId: idEl?.textContent?.trim() || undefined
           };
        });
      });
      
      inmates.push(...limestoneInmates.map(i => ({ ...i, source: 'Limestone County', id: randomUUID() })));
    } catch (e) {
      console.error("Error scraping Limestone County:", e);
    }

  } finally {
    await browser.close();
  }

  return inmates;
}
