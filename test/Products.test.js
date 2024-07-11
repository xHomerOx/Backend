import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing products routes', () => {
    it('GET Operation for Products Endpoint', async() => {
        const response = await requester.get('/api/products');
        expect(response.statusCode).to.be.eql(200);
    })
});