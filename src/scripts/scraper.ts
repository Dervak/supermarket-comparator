import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const supermarkets = [
  { name: 'Coto', url: 'https://www.cotodigital3.com.ar/' },
  { name: 'Jumbo', url: 'https://www.jumbo.com.ar/' },
  { name: 'Carrefour Argentina', url: 'https://www.carrefour.com.ar/' },
  { name: 'Disco', url: 'https://www.disco.com.ar/' },
  { name: 'Dia Argentina', url: 'https://diaonline.supermercadosdia.com.ar/' },
  { name: 'Chango Más', url: 'https://www.changomas.com.ar/' },
  { name: 'Vea', url: 'https://www.veadigital.com.ar/' },
];

async function scrapeProducts(supermarket: { name: string; url: string }) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(supermarket.url);

  // This is a placeholder for the actual scraping logic
  // You'll need to implement the specific scraping logic for each supermarket
  const products = await page.evaluate(() => {
    // This is just an example, you'll need to adjust this based on each supermarket's HTML structure
    return Array.from(document.querySelectorAll('.product-item')).map((el) => ({
      name: el.querySelector('.product-name')?.textContent,
      ean: el.querySelector('.product-ean')?.textContent,
      price: parseFloat(el.querySelector('.product-price')?.textContent || '0'),
    }));
  });

  await browser.close();

  return products;
}

async function main() {
  for (const supermarket of supermarkets) {
    console.log(`Scraping ${supermarket.name}...`);
    const products = await scrapeProducts(supermarket);

    for (const product of products) {
      if (product.name && product.ean && product.price) {
        const existingProduct = await prisma.product.findUnique({
          where: { ean: product.ean },
        });

        if (!existingProduct) {
          await prisma.product.create({
            data: {
              name: product.name,
              ean: product.ean,
              prices: {
                create: {
                  price: product.price,
                  supermarket: {
                    connectOrCreate: {
                      where: { name: supermarket.name },
                      create: { name: supermarket.name },
                    },
                  },
                },
              },
            },
          });
        } else {
          await prisma.price.upsert({
            where: {
              productId_supermarketId: {
                productId: existingProduct.id,
                supermarketId: (await prisma.supermarket.findUnique({ where: { name: supermarket.name } }))!.id,
              },
            },
            update: { price: product.price },
            create: {
              price: product.price,
              product: { connect: { id: existingProduct.id } },
              supermarket: { connect: { name: supermarket.name } },
            },
          });
        }
      }
    }
  }

  console.log('Scraping completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });