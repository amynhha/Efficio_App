//TODO: Continue and fix the login test
import userFunctions from '../src/user.js';
import { db } from '../src/database.js';
import { vi } from 'vitest';
import bcrypt from 'bcrypt';

// Mock bcrypt
vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn(),
    },
}));

// Mock db
vi.mock('../src/database.js', () => ({
    db: {
        query: vi.fn(),
    },
}));

describe("User Functions", () => {
    afterEach(() => {
        vi.clearAllMocks(); // Clear mocks after each test
    });
//registerUser
    test("registerUser should insert a new user and return insertId", async () => {
        const username = "testUser";
        const email = "test@example.com";
        const password = "password123";
        const hashedPassword = "hashedPassword123";
        const insertId = 1;

        bcrypt.hash.mockResolvedValue(hashedPassword);
        db.query.mockResolvedValue([{ insertId }]);

        const result = await userFunctions.registerUser({ username, email, password });

        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
        expect(db.query).toHaveBeenCalledWith(
            "insert into User(username, email, password) values (?, ?, ?)",
            [username, email, hashedPassword]
        );
        expect(result).toBe(insertId);
    });
//getAllUsers
    test("should return users when the query is successful", async () => {
        const mockUsers = [
          { id: 1, username: "user1", email: "user1@example.com" },
          { id: 2, username: "user2", email: "user2@example.com" }
        ];

        db.query.mockResolvedValue([mockUsers]);
    
        const result = await userFunctions.getAllUsers();
    
        expect(db.query).toHaveBeenCalledWith("select * from User");
    
        expect(result).toEqual(mockUsers);
      });
    
      test("should throw an error if no users are found", async () => {
        db.query.mockResolvedValue([[]]);
    
        try {
          await userFunctions.getAllUsers();
        } catch (error) {
          expect(error.message).toBe("No user");
        }
      });
    
      test("should throw an error if db.query fails", async () => {
        db.query.mockRejectedValue(new Error("Database error"));
    
        try {
          await userFunctions.getAllUsers();
        } catch (error) {
          expect(error.message).toBe("Database error");
        }
      });
//getUserByID
      test("should return users by ID when the query is successful", async () => {
        const mockUser = { id: 1, username: "user1", email: "user1@example.com" };

        db.query.mockResolvedValue([mockUser]);
    
        const result = await userFunctions.getUserByID(1);
    
        expect(db.query).toHaveBeenCalledWith("select * from User where userId = ?", [1]);
        expect(result).toEqual(mockUser);
      });
    
      test("should throw an error if no users are found", async () => {
        db.query.mockResolvedValue([[]]);
    
        try {
          await userFunctions.getUserByID(1);
        } catch (error) {
          expect(error.message).toBe("User not found");
        }
      });
    
      test("should throw an error if db.query fails", async () => {
        db.query.mockRejectedValue(new Error("Database error"));
    
        try {
          await userFunctions.getUserByID(1);
        } catch (error) {
          expect(error.message).toBe("Database error");
        }
      });
//getUserByUsername
test("should return users by username when the query is successful", async () => {
    const mockUser = { id: 1, username: "user1", email: "user1@example.com" };

    db.query.mockResolvedValue([mockUser]);

    const result = await userFunctions.getUserByUsername("user1");

    expect(db.query).toHaveBeenCalledWith("select * from User where username = ?", ["user1"]);
    expect(result).toEqual(mockUser);
  });

  test("should throw an error if no users are found", async () => {
    db.query.mockResolvedValue([[]]);

    try {
      await userFunctions.getUserByUsername("user1");
    } catch (error) {
      expect(error.message).toBe("User not found");
    }
  });

  test("should throw an error if db.query fails", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    try {
      await userFunctions.getUserByUsername("user1");
    } catch (error) {
      expect(error.message).toBe("Database error");
    }
  });
//getUserByEmail
test("should return users by email when the query is successful", async () => {
    const mockUser = { id: 1, username: "user1", email: "user1@example.com" };

    db.query.mockResolvedValue([mockUser]);

    const result = await userFunctions.getUserByEmail("user1@example.com");

    expect(db.query).toHaveBeenCalledWith("select * from User where email = ?", ["user1@example.com"]);
    expect(result).toEqual(mockUser);
  });

  test("should throw an error if no users are found", async () => {
    db.query.mockResolvedValue([[]]);

    try {
      await userFunctions.getUserByEmail("user1@example.com");
    } catch (error) {
      expect(error.message).toBe("User not found");
    }
  });

  test("should throw an error if db.query fails", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    try {
      await userFunctions.getUserByEmail("user1@example.com");
    } catch (error) {
      expect(error.message).toBe("Database error");
    }
  });
//login
  test('should login successfully with valid username and password', async () => {
    const mockUser = {
      username: 'testUser',
      password: 'correctPassowrd',
      userId: 1,
    };
  
    // Mock db query to return the mock user when a username is searched
    db.query.mockResolvedValue([mockUser]);
  
    hashedPassowrd = bcrypt.hash(password);
    // Mock bcrypt.compare to return true when passwords match
    bcrypt.compare.mockResolvedValue(true);
  
    const credentials = { username: 'testUser', password: 'correctPassword' };
  
    const result = await userFunctions.loginUser(credentials);
  
    // Checking the result message and userId
    expect(result).toEqual({ message: 'Login successful', userId: 1 });
  });
  
  test('should throw error for invalid username', async () => {
    // Mock db query to return empty array (no user found)
    db.query.mockResolvedValue([[]]);
  
    const credentials = { username: 'nonExistentUser', password: 'password' };
  
    await expect(userFunctions.loginUser(credentials)).rejects.toThrow('Invalid credentials');
  });
  
  test('should throw error for invalid password', async () => {
    const mockUser = {
      username: 'testUser',
      password: 'hashedPassword',
      userId: 1,
    };
  
    // Mock db query to return the mock user when the username is searched
    db.query.mockResolvedValue([mockUser]);
  
    // Mock bcrypt.compare to return false when passwords don't match
    bcrypt.compare.mockResolvedValue(false);
  
    const credentials = { username: 'testUser', password: 'wrongPassword' };
  
    await expect(userFunctions.loginUser(credentials)).rejects.toThrow('Invalid credentials');
  });



    });