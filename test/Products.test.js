import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { fakerES_MX } from '@faker-js/faker';
import { startLogger } from '../src/utils/loggerUtil.js'
import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';

const envFile = environment === 'production' ? 'prod.env' : '.env';
dotenv.config({ path: path.resolve(`../${envFile}`) });

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const uri = process.env.DB_CONNECTION;

const isAdmin = {
    user: 'admin',
    password: 'admin'
  };

export const generateProducts =() => {
  return {
    id: fakerES_MX.string.uuid(),
    title: fakerES_MX.commerce.productName(),
    description: fakerES_MX.commerce.productDescription(),
    code: fakerES_MX.string.alphanumeric(6),
    price: fakerES_MX.commerce.price(),
    status: fakerES_MX.datatype.boolean(0.5),
    stock: fakerES_MX.number.int(100),
    category: fakerES_MX.commerce.productAdjective(),
    thumbnail: fakerES_MX.image.url({height: 100, width: 100})
  };
}

before(async () => {
    try {
        await mongoose.connect(uri)
        startLogger(`DB connection successful`);
    } catch (error) {
        startLogger(`DB connection failed`);
    }
});

describe('Testing login endpoint', () => {
    it('Login credentials', async () => {
        const response = await requester.post('/api/users/login').send(isAdmin).set('Accept', 'application/json');
        console.log(response.body);
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property('token');
    });
});

describe('Testing products routes', () => {
    it('GET Operation for Products Endpoint', async() => {
        const response = await requester.get('/api/products');
        expect(response.statusCode).to.be.eql(200);
    })

    it('POST Operation for Products Endpoint', async() => {
        const newProduct = generateProducts();
        const response = await requester.post('/api/products').send(newProduct).set('Accept', 'application/json');

        expect(response.body).to.include.keys('_id', 'title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnail');
        expect(response.body.title).to.equal(newProduct.title);
        expect(response.body.description).to.equal(newProduct.description);
        expect(response.body.code).to.equal(newProduct.code);
        expect(response.body.price).to.equal(newProduct.price);
        expect(response.body.status).to.equal(newProduct.status);
        expect(response.body.stock).to.equal(newProduct.stock);
        expect(response.body.category).to.equal(newProduct.category);
        expect(response.body.thumbnail).to.deep.equal(newProduct.thumbnail);
    })
});

after(async () => {
    await mongoose.disconnect();
    startLogger('DB disconnected');
});