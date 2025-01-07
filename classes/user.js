//This class is responsible for the User data, including queries that have to do with users
import db from './database.js';
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
        const [result] = await pool.query(query, values);
        return result.insertId //returning newly registered user's Id
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
}

async function getAllUsers() {
    const query = "select * from User";

    try {
        const [result] = await pool.query(query);
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
        const [result] = await pool.query(query, values);
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
        const [result] = await pool.query(query, values);
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
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("User not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
    }
}

async function verifyingCredentials(username, password) {
        try {
        const user = await User.getUserByUsername(username);
    
        //throw error if there is no such user in database
        if (!user) {
            throw new Error("Invalid credentials");
        }

        //checking for correct password
        const matchedPassword = await bcrypt.compare(password, user.getpassword());

        if (!matchedPassword) {
            throw new Error("Invalid credentials");
        } else {
            return;
        }
    } catch (error) {
        console.error('Error verifying credentials:', error);
        throw new error;
    }
}

async function verifyingEmailCredentials(email, password) {
    try {
    const user = await User.getUserByEmail(email);

    //throw error if there is no such user in database
    if (!user) {
        throw new Error("Invalid credentials");
    }

    //checking for correct password
    const matchedPassword = await bcrypt.compare(password, user.getpassword());

    if (!matchedPassword) {
        throw new Error("Invalid credentials");
    } else {
        return;
    }
} catch (error) {
    console.error('Error verifying credentials:', error);
    throw new error;
}
}

//TODO: handle tokens when loging in
async function loginUser(credentials) {
    const {username, password} = credentials;
   
    try {
        const user = await verifyingCredentials(username, password);
        return {message: "Login successful", userId: user.userId};
    } catch (error) {
              console.error('Error logging in:', error);
              throw new error;
    }
}

async function deleteUserByID(userId) {
    const query = "delete from User where userId = ?";
    const values = [userId];

    try {
        const [result] = await pool.query(query, values);
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
        const [result] = await pool.query(query, values);
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
        await verifyingCredentials(username, currentPassword);
    } catch (error) {
        console.error("Error during verification:", error);
        throw new Error("Verification failed");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = "update User set password = ? where username = ?";
    const values = [hashedPassword, username];

    try {
        const [result] = await pool.query(query, values);
        
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
        await verifyingCredentials(username, password);
    } catch (error) {
        console.error("Error during verification:", error);
        throw new Error("Verification failed");
    }
    const query = "update User set email = ? where username = ?";
    const values = [newEmail, username];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No user with the given credentials is found to be updated");
        }
        return {message: "Email updated successfully"}; 
    } catch (error) {
        console.error("Error updating email by username:", error);
        throw new error;
    }
}

async function updateUsername(password, email, newUsername) {
    try {
        await verifyingEmailCredentials(email, password);
    } catch (error) {
        console.error("Error during verification:", error);
        throw new Error("Verification failed");
    }
    const query = "update User set username = ? where email = ?";
    const values = [newUsername, email];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No user with the given credentials is found to be updated");
        }
        return {message: "Username updated successfully"}; 
    } catch (error) {
        console.error("Error updating username by email:", error);
        throw new error;
    }
}

export default {
    registerUser,
    verifyingCredentials,
    verifyingEmailCredentials,
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