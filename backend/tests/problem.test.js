import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/userModel.js';
import jwt from 'jsonwebtoken';

describe('Problem Controller', () => {
  let token;
  let userId;

  // 1. Create a "Fake" user and a "Fake" JWT token for the tests
  beforeEach(async () => {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      isAccountVerified: true
    });
    userId = user._id;
    
    // Create a token that your middleware would usually create
    token = jwt.sign({ id: userId }, process.env.ACCESS_SECRET || 'test_secret');
  });

  it('should create a new problem when authenticated', async () => {
    const res = await request(app)
      .post('/api/problems')
      .set('Authorization', `Bearer ${token}`) // Pass the fake token
      .send({
        title: "Build a Testing Suite",
        summary: "Learn how to use Jest and Supertest",
        description: "Full guide on integration testing",
        domain: "Backend",
        difficulty: "Medium",
        tags: ["js", "testing"]
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe("Build a Testing Suite");
    expect(res.body.slug).toBeDefined(); // Tests your slug service too!
  });

  it('should return 404 if a problem slug does not exist', async () => {
    const res = await request(app).get('/api/problems/non-existent-slug');
    expect(res.statusCode).toEqual(404);
  });
});