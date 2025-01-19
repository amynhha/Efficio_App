import User from '../src/user.js';
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

        const result = await User.registerUser({ username, email, password });

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
    
        const result = await User.getAllUsers();
    
        expect(db.query).toHaveBeenCalledWith("select * from User");
    
        expect(result).toEqual(mockUsers);
      });
    
      test("should throw an error if no users are found", async () => {
        db.query.mockResolvedValue([[]]);
    
        try {
          await User.getAllUsers();
        } catch (error) {
          expect(error.message).toBe("No user");
        }
      });
    
      test("should throw an error if db.query fails", async () => {
        db.query.mockRejectedValue(new Error("Database error"));
    
        try {
          await User.getAllUsers();
        } catch (error) {
          expect(error.message).toBe("Database error");
        }
      });

//getUserByID
      test("should return users by ID when the query is successful", async () => {
        const mockUser = { id: 1, username: "user1", email: "user1@example.com" };

        db.query.mockResolvedValue([mockUser]);
    
        const result = await User.getUserByID(1);
    
        expect(db.query).toHaveBeenCalledWith("select * from User where userId = ?", [1]);
        expect(result).toEqual(mockUser);
      });
    
      test("should throw an error if no users are found", async () => {
        db.query.mockResolvedValue([[]]);
    
        try {
          await User.getUserByID(1);
        } catch (error) {
          expect(error.message).toBe("User not found");
        }
      });
    
      test("should throw an error if db.query fails", async () => {
        db.query.mockRejectedValue(new Error("Database error"));
    
        try {
          await User.getUserByID(1);
        } catch (error) {
          expect(error.message).toBe("Database error");
        }
      });

//getUserByUsername
test("should return users by username when the query is successful", async () => {
    const mockUser = { id: 1, username: "user1", email: "user1@example.com" };

    db.query.mockResolvedValue([mockUser]);

    const result = await User.getUserByUsername("user1");

    expect(db.query).toHaveBeenCalledWith("select * from User where username = ?", ["user1"]);
    expect(result).toEqual(mockUser);
  });

  test("should throw an error if no users are found", async () => {
    db.query.mockResolvedValue([[]]);

    try {
      await User.getUserByUsername("user1");
    } catch (error) {
      expect(error.message).toBe("User not found");
    }
  });

  test("should throw an error if db.query fails", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    try {
      await User.getUserByUsername("user1");
    } catch (error) {
      expect(error.message).toBe("Database error");
    }
  });

//getUserByEmail
test("should return users by email when the query is successful", async () => {
    const mockUser = { id: 1, username: "user1", email: "user1@example.com" };

    db.query.mockResolvedValue([mockUser]);

    const result = await User.getUserByEmail("user1@example.com");

    expect(db.query).toHaveBeenCalledWith("select * from User where email = ?", ["user1@example.com"]);
    expect(result).toEqual(mockUser);
  });

  test("should throw an error if no users are found", async () => {
    db.query.mockResolvedValue([[]]);

    try {
      await User.getUserByEmail("user1@example.com");
    } catch (error) {
      expect(error.message).toBe("User not found");
    }
  });

  test("should throw an error if db.query fails", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    try {
      await User.getUserByEmail("user1@example.com");
    } catch (error) {
      expect(error.message).toBe("Database error");
    }
  });

//login
  test('should login successfully with valid username and password', async () => {
    const mockUser = {
      username: 'testUser',
      password: await bcrypt.hash("correctPassword", 10),
      userId: 1,
    };
  
    // Mock db query to return the mock user when a username is searched
    db.query.mockResolvedValue([[mockUser]]);
  
    // Mock bcrypt.compare to return true when passwords match
    bcrypt.compare.mockResolvedValue(true);
  
    const credentials = { username: 'testUser', password: 'correctPassword' };
  
    const result = await User.loginUser(credentials);
  
    // Checking the result message and userId
    expect(result).toEqual({ message: 'Login successful', userId: 1 });
  });
  
  test('should throw error for invalid username', async () => {
    // Mock db query to return empty array (no user found)
    db.query.mockResolvedValue([[]]);
  
    const credentials = { username: 'incorrectUser', password: 'correctPassword' };
  
    bcrypt.compare.mockResolvedValue(true);

    await expect(User.loginUser(credentials)).rejects.toThrow('Invalid username');
  });
  
  test('should throw error for invalid password', async () => {
    const mockUser = {
      username: 'testUser',
      password: await bcrypt.hash('correctPassword', 10),
      userId: 1,
    };
  
    // Mock db query to return the mock user when the username is searched
    db.query.mockResolvedValue([[mockUser]]);
  
    // Mock bcrypt.compare to return false when passwords don't match
    bcrypt.compare.mockResolvedValue(false);
  
    const credentials = { username: 'testUser', password: 'wrongPassword' };
  
    await expect(User.loginUser(credentials)).rejects.toThrow('Invalid password');
  });

//deleteUserByID
test('should delete user by ID successfully', async () => {
  const mockResult = { affectedRows: 1 };
  db.query.mockResolvedValue([mockResult]);

  const result = await User.deleteUserByID(1);

  expect(result).toEqual({ message: "User is successfully deleted" });
});

test('should throw error if no user with given ID is found to be deleted', async () => {
  const mockResult = { affectedRows: 0 };
  db.query.mockResolvedValue([mockResult]);

  await expect(User.deleteUserByID(1)).rejects.toThrow('No user with given ID is found to be deleted');
});

//deleteUserByUsername
test('should delete user by username successfully', async () => {
  const mockResult = { affectedRows: 1 };
  db.query.mockResolvedValue([mockResult]);

  const result = await User.deleteUserByUsername('testUser');

  expect(result).toEqual({ message: "User is successfully deleted" });
});

test('should throw error if no user with given username is found to be deleted', async () => {
  const mockResult = { affectedRows: 0 };
  db.query.mockResolvedValue([mockResult]);

  await expect(User.deleteUserByUsername('nonExistentUser')).rejects.toThrow('No user with given username is found to be deleted');
});

//updateUserPassword
test('should update password successfully', async () => {
  const mockUser = { 
    username: 'testUser', 
    password: await bcrypt.hash('correctPassword', 10), 
    userId: 1 };
    
  db.query.mockResolvedValue([[mockUser]]);
  bcrypt.compare.mockResolvedValue(true);

  const result = await User.updateUserPassword('correctPassword', 'testUser', 'newPassword');

  expect(result).toEqual({ message: 'Password updated successfully' });
});

test('should throw error if user is not found during password update', async () => {
  db.query.mockResolvedValue([[]]);

  await expect(User.updateUserPassword('correctPassword', 'nonExistentUser', 'newPassword')).rejects.toThrow('Invalid credentials');
});

test('should throw error if password does not match during password update', async () => {
  const mockUser = { username: 'testUser', password: await bcrypt.hash('correctPassword', 10), userId: 1 };
  db.query.mockResolvedValue([[mockUser]]);
  bcrypt.compare.mockResolvedValue(false);

  await expect(User.updateUserPassword('wrongPassword', 'testUser', 'newPassword')).rejects.toThrow('Invalid credentials');
});

//updateUserEmail
test('should update email successfully', async () => {
  const mockUser = { username: 'testUser', password: await bcrypt.hash('correctPassword', 10), userId: 1 };
  db.query.mockResolvedValue([[mockUser]]);
  bcrypt.compare.mockResolvedValue(true);

  const result = await User.updateUserEmail('correctPassword', 'testUser', 'newEmail@example.com');

  expect(result).toEqual({ message: 'Email updated successfully' });
});

test('should throw error if user is not found during email update', async () => {
  db.query.mockResolvedValue([[]]);

  await expect(User.updateUserEmail('correctPassword', 'nonExistentUser', 'newEmail@example.com')).rejects.toThrow('Invalid credentials');
});

test('should throw error if password does not match during email update', async () => {
  const mockUser = { username: 'testUser', password: await bcrypt.hash('correctPassword', 10), userId: 1 };
  db.query.mockResolvedValue([[mockUser]]);
  bcrypt.compare.mockResolvedValue(false);

  await expect(User.updateUserEmail('wrongPassword', 'testUser', 'newEmail@example.com')).rejects.toThrow('Invalid credentials');
});

//updateUsername
test('should update username successfully', async () => {
  const mockUser = { username: 'testUser', password: await bcrypt.hash('correctPassword', 10), userId: 1 };
  db.query.mockResolvedValue([[mockUser]]);
  bcrypt.compare.mockResolvedValue(true);

  const result = await User.updateUsername('correctPassword', 'testUser@example.com', 'newUsername');

  expect(result).toEqual({ message: 'Username updated successfully' });
});

test('should throw error if user is not found during username update', async () => {
  db.query.mockResolvedValue([[]]);

  await expect(User.updateUsername('correctPassword', 'nonExistentUser@example.com', 'newUsername')).rejects.toThrow('Invalid credentials');
});

test('should throw error if password does not match during username update', async () => {
  const mockUser = { username: 'testUser', password: await bcrypt.hash('correctPassword', 10), userId: 1 };
  db.query.mockResolvedValue([[mockUser]]);
  bcrypt.compare.mockResolvedValue(false);

  await expect(User.updateUsername('wrongPassword', 'testUser@example.com', 'newUsername')).rejects.toThrow('Invalid credentials');
});

});