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

let authToken;

before(async () => {
    try {
        await mongoose.connect(uri);

        startLogger(`DB connection successful`);
    } catch (error) {
        startLogger(`Error during setup: ${error.message}`);
    }
}, 10000);

describe('Testing login endpoint', () => {
    it('Login credentials', async () => {
        const response = await requester.post('/api/users/login').send(isAdmin).set('Accept', 'application/json');

        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property('token');

        authToken = response.body.token;
    });
}, 10000);

describe('Testing products routes', () => {
    it('GET Operation for Products Endpoint', async() => {
        const response = await requester.get('/api/products');
        
        expect(response.statusCode).to.be.eql(200);
    });

    it('POST Operation for Products Endpoint', async() => {
        const newProduct = generateProducts();
        const response = await requester.post('/api/products').send(newProduct).set('Accept', 'application/json').set('Authorization', `Bearer ${authToken}`);

        expect(response.statusCode).to.be.eql(200);
    });

    it('PUT Operation for Products Endpoint', async () => {
        await requester.get('/api/products/668140f0586f527717d76ff2');

        const updatedProduct = { title: 'New Title' };
        const response = await requester.put('/api/products/668140f0586f527717d76ff2').send(updatedProduct).set('Accept', 'application/json').set('Authorization', `Bearer ${authToken}`);
        
        expect(response.status).to.equal(200);
    });

    it('DELETE Operation for Products Endpoint', async () => {
        const response = await requester.delete('/api/products/668140f0586f527717d76fec').set('Accept', 'application/json').set('Authorization', `Bearer ${authToken}`);
        
        expect(response.status).to.equal(200);
    });
}, 10000);

after(async () => {
    await mongoose.disconnect();
    startLogger('DB disconnected');
}, 10000);