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

describe('Testing carts routes', () => {
    it('GET Operation for Carts Endpoint', async() => {
        const response = await requester.get('/api/carts');
        
        expect(response.statusCode).to.be.eql(200);
    }, 10000);
});

after(async () => {
    await mongoose.disconnect();
    startLogger('DB disconnected');
}, 10000);