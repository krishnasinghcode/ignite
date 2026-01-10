import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/userModel.js';
import bcrypt from 'bcryptjs';

describe('Auth Controller', () => {
  it('should login an existing user and return a token', async () => {
    // Manually create a user in the memory DB
    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "john@example.com",
        password: "password123"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.header['set-cookie']).toBeDefined();
  });
});