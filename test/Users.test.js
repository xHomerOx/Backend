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

export const generateUsers = () => {
    return {
        user: fakerES_MX.internet.userName(),
        email: fakerES_MX.internet.email(),
        password: fakerES_MX.string.alphanumeric(8)
    };
};

const newUser = generateUsers();

console.log(newUser);

before(async function () {
    this.timeout(10000);

    try {
        await mongoose.connect(uri);

        startLogger(`DB connection successful`);
    } catch (error) {
        startLogger(`Error during setup: ${error.message}`);
    }
});

describe('Testing users routes', () => {
    it('POST Login Operation for Users Endpoint', async () => {
        const response = await requester.post('/api/users/login').send(isAdmin).set('Accept', 'application/json');

        expect(response.statusCode).to.equal(200);
    });

    it('POST Register for Users Endpoint', async () => {
        const response = await requester.post('/api/users/register').send(newUser).set('Accept', 'application/json');
        
        expect(response.statusCode).to.equal(200);
    });
});

after(async () => {
    await mongoose.disconnect();
    startLogger('DB disconnected');
});