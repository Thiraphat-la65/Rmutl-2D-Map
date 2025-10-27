const request = require('supertest');
const app = require('../src/app/app');

describe('GET /', () => {
	it('should return backend status', async () => {
		const res = await request(app).get('/');  // await กับ Promise ที่ supertest คืนมา
		expect(res.statusCode).toBe(200);         // เช็ค status code
		expect(res.body).toEqual({ message: 'Backend is running!' });  // เช็ค response body
	});
});
