import { fakerES_MX } from '@faker-js/faker';

export const generateProducts =() => {
  const status = fakerES_MX.datatype.boolean(0.5);

  const stock = status ? fakerES_MX.number.int(20) : 0;

  return {
    id: fakerES_MX.string.uuid(),
    title: fakerES_MX.commerce.productName(),
    description: fakerES_MX.commerce.productDescription(),
    code: fakerES_MX.string.alphanumeric(6),
    price: fakerES_MX.commerce.price(),
    status: status,
    stock: stock,
    category: fakerES_MX.commerce.productAdjective(),
    thumbnail: fakerES_MX.image.urlLoremFlickr({ category: 'abstract' }),
    owner: 'admin'
  };
}