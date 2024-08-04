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

    it('POST Operation for Carts Endpoint', async() => {
        const response = await requester.post('/api/carts');
        
        expect(response.statusCode).to.be.eql(200);
    });

    it('PUT Operation for Carts Endpoint', async() => {
        const response = await requester.put('/api/carts/66919d2eeef71e51df84d2b2');
        
        expect(response.statusCode).to.be.eql(200);
    });

    it('DELETE Operation for Carts Endpoint', async() => {
        const response = await requester.delete('/api/carts/66919d2eeef71e51df84d2b2');
        
        expect(response.statusCode).to.be.eql(200);
    });

});

after(async () => {
    await mongoose.disconnect();
    startLogger('DB disconnected');
});