import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
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

before(async function () {
    this.timeout(10000);
    try {
        await mongoose.connect(uri);

        startLogger(`DB connection successful`);
    } catch (error) {
        startLogger(`Error during setup: ${error.message}`);
    }
});

describe('Testing carts routes', () => {
    it('GET Operation for Carts Endpoint', async() => {
        const response = await requester.get('/api/carts');
        
        expect(response.statusCode).to.be.eql(200);
    });

    let cartId;

    it('POST Operation for Carts Endpoint', async () => {
        const response = await requester.post('/api/carts').send(isAdmin).set('Accept', 'application/json');
        
        expect(response.statusCode).to.be.eql(200);

        cartId = response.body.payload.id;
    });

    it('PUT Operation for Carts Endpoint', async () => {
        const response = await requester.put(`/api/carts/${cartId}`).send(isAdmin).set('Accept', 'application/json');
        
        expect(response.statusCode).to.be.eql(200);
    });


    it('DELETE Operation for Carts Endpoint', async() => {
        const response = await requester.delete(`/api/carts/${cartId}`).send(isAdmin).set('Accept', 'application/json');
        
        expect(response.statusCode).to.be.eql(200);
    });

});

after(async () => {
    await mongoose.disconnect();
    startLogger('DB disconnected');
});