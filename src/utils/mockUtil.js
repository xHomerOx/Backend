import { faker, fakerES_MX } from '@faker-js/faker';

export const generateProducts =() => {
  const products = [];

  for (let i = 0; i < 100; i++) {
    products.push({
      id: fakerES_MX.string.uuid(),
      title: fakerES_MX.commerce.title(),
      description: fakerES_MX.commerce.description(),
      code: fakerES_MX.commerce.code(),
      price: fakerES_MX.commerce.price(),
      status: fakerES_MX.commerce.status(),
      stock: fakerES_MX.commerce.stock(),
      category: fakerES_MX.commerce.category(),
      thumbnail: fakerES_MX.commerce.thumbnail()
    });
  }

  return products;
}