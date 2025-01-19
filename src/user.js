//This class is responsible for the User data, including queries that have to do with users
import {db} from './database.js';
import bcrypt from 'bcrypt';

class User {
    constructor(userId, username, email, password, createdTime) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdTime = createdTime;
    }

    //Getters and setters
    getuserId() { return this.userId; }
    getusername() { return this.username; }
    getemail() { return this.email; }
    getpassword() { return this.password; }
    getcreatedTime() { return this.createdTime; }

    setuserId(userId) { this.userId = userId; }
    setusername(username) { this.username = username; }
    setemail(email) { this.email = email; }
    setpassword(password) { this.password = password; }
    setcreatedTime(createdTime) { this.createdTime = createdTime; }

    toString() {
        return `User:
        - User ID: ${this.userId}
        - Username: ${this.username}
        - Email: ${this.email}
        - Account Created: ${this.createdTime}`;
    }
}

//Adding a new user to the database
async function registerUser(userData) {
    const {username, email, password} = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "insert into User(username, email, password) values (?, ?, ?)";
    const values = [username, email, hashedPassword];

    try {
        const [result] = await db.query(query, values);
        return result.insertId //returning newly registered user's Id
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
}

async function getAllUsers() {
    const query = "select * from User";

    try {
        const [result] = await db.query(query);
        if (result.length == 0) {
            throw new Error("No user");
        }
        return result;
    } catch (error) {
        console.error("Error getting all users", error);
        throw error;
    }
}

async function getUserByID(userId) {
    const query = "select * from User where userId = ?";
    const values = [userId];

    try {
        const [result] = await db.query(query, values);
        if (result.length == 0) {
            throw new Error("User not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting user by ID:", error);
        throw error;
    }
}

async function getUserByUsername(username) {
    const query = "select * from User where username = ?";
    const values = [username];

    try {
        const [result] = await db.query(query, values);
        if (result.length == 0) {
            throw new Error("User not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting user by username:", error);
        throw error;
    }
}

async function getUserByEmail(email) {
    const query = "select * from User where email = ?";
    const values = [email];

    try {
        const [result] = await db.query(query, values);
        if (result.length == 0) {
            throw new Error("User not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
    }
}

async function loginUser(credentials) {
    const {username, password} = credentials;
    try {
        const query = "select * from User where username = ?";
        const values = [username];
        const [user] = await db.query(query, values);

        if (!user || user.length == 0) {
            throw new Error('Invalid username');
        }
        
        const matchedPassword = await bcrypt.compare(password, user[0].password);

        if (!matchedPassword) {
            throw new Error('Invalid password');
        }

        return {message: "Login successful", userId: user[0].userId};
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

async function deleteUserByID(userId) {
    const query = "delete from User where userId = ?";
    const values = [userId];

    try {
        const [result] = await db.query(query, values);
        if (result.affectedRows == 0) {
            throw new Error("No user with given ID is found to be deleted");
        }
        return {message: "User is successfully deleted"};
    } catch (error) {
        console.error("Error deleting user by ID:", error);
        throw error;
    }
}

async function deleteUserByUsername(username) {
    const query = "delete from User where username = ?";
    const values = [username];

    try {
        const [result] = await db.query(query, values);
        if (result.affectedRows == 0) {
            throw new Error("No user with given username is found to be deleted");
        }
        return {message: "User is successfully deleted"}; 
    } catch (error) {
        console.error("Error deleting user by username:", error);
        throw error;
    }
}

async function updateUserPassword(currentPassword, username, newPassword) {
    try {
        const query = "select * from User where username = ?";
        const values = [username];
        const [user] = await db.query(query, values);

        if (!user || user.length == 0) {
            throw new Error('Invalid credentials');
        }
        
        const matchedPassword = await bcrypt.compare(currentPassword, user[0].password);

        if (!matchedPassword) {
            throw new Error('Invalid credentials');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedQuery = "update User set password = ? where username = ?";
        const updatedValues = [hashedPassword, username];
        const [result] = await db.query(query, updatedValues);
        
        if (result.affectedRows == 0) {
            throw new Error("No user with the given credentials found to be updated");
        }

        return {message: "Password updated successfully"};
    } catch (error) {
        console.error("Error updating password by username:", error);
        throw error;
    }
}

async function updateUserEmail(password, username, newEmail) {
    try {
        const query = "select * from User where username = ?";
        const values = [username];
        const [user] = await db.query(query, values);

        if (!user || user.length == 0) {
            throw new Error('Invalid credentials');
        }
        
        const matchedPassword = await bcrypt.compare(password, user[0].password);

        if (!matchedPassword) {
            throw new Error('Invalid credentials');
        }
        const updatedQueryuery = "update User set email = ? where username = ?";
        const updatedValues = [newEmail, username];
        const [result] = await db.query(query, updatedValues);

        if (result.affectedRows == 0) {
            throw new Error("No user with the given credentials is found to be updated");
        }
        return {message: "Email updated successfully"}; 
    } catch (error) {
        console.error("Error updating email by username:", error);
        throw error;
    }
}

async function updateUsername(password, email, newUsername) {
    try {
        const query = "select * from useer where email = ?";
        const values = [email];
        const [user] = await db.query(query, values);

        if (!user || user.length == 0) {
            throw new Error('Invalid credentials');
        }
        
        const matchedPassword = await bcrypt.compare(password, user[0].password);

        if (!matchedPassword) {
            throw new Error('Invalid credentials');
        }
        const updatedQuery = "update User set username = ? where email = ?";
        const updatedValues = [newUsername, email];
        const [result] = await db.query(query, updatedValues);

        if (result.affectedRows == 0) {
            throw new Error("No user with the given credentials is found to be updated");
        }

        return {message: "Username updated successfully"}; 
    } catch (error) {
        console.error("Error updating username by email:", error);
        throw error;
    }
}

export default {
    registerUser,
    loginUser,
    getUserByID,
    getUserByUsername,
    getUserByEmail,
    getAllUsers,
    deleteUserByID,
    deleteUserByUsername,
    updateUserPassword,
    updateUserEmail,
    updateUsername
};