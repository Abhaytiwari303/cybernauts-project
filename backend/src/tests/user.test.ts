// src/tests/user.test.ts
import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app"; // Make sure your app.ts exports `app`

dotenv.config();

let userId1: string;
let userId2: string;

beforeAll(async () => {
  if (!process.env.MONGO_URI_TEST) throw new Error("MONGO_URI_TEST not defined");
  await mongoose.connect(process.env.MONGO_URI_TEST);

  // Create two users
  const user1Res = await request(app).post("/api/users").send({ username: "User1", age: 20 });
  const user2Res = await request(app).post("/api/users").send({ username: "User2", age: 21 });

  userId1 = user1Res.body._id;
  userId2 = user2Res.body._id;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("User API Tests (working cases)", () => {
  it("should create two users", async () => {
    expect(userId1).toBeDefined();
    expect(userId2).toBeDefined();
  });

  it("should unlink all friends before deleting user", async () => {
    // First, add each other as friends manually if needed
    await request(app).post(`/api/users/${userId1}/link`).send({ targetId: userId2 });

    const unlinkRes = await request(app).delete(`/api/users/${userId1}/unlinkAll`);
    expect(unlinkRes.status).toBe(200);
    expect(unlinkRes.body.message).toMatch(/all friends/i);

    const deleteRes = await request(app).delete(`/api/users/${userId1}`);
    expect(deleteRes.status).toBe(200);
  });
});
