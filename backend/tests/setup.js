import {
  connectTestDB,
  clearTestDB,
  closeTestDB
} from "./helpers/setupTestDB.js";

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});
