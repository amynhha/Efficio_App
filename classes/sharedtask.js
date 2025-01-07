//This class is responsible for the Shared task data, including queries that have to do with shared tasks
import db from './database.js';

class Sharedtask {
    constructor(sharedtaskId, role, createdTime, updatedTime, taskId, userId) {
        this.sharedtaskId = sharedtaskId;
        this.role = role;
        this.createdTime = createdTime;
        this.updatedTime = updatedTime;
        this.taskId = taskId;
        this.userId = userId;
    }

    //Getters and setters
    getsharedtaskId() { return this.sharedtaskId; }
    getrole() { return this.role; }
    getcreatedTime() { return this.createdTime; }
    getupdatedTime() { return this.updatedTime; }
    gettaskId() { return this.taskId; }
    getuserId() { return this.userId; }

    setsharedtaskId(sharedtaskId) { this.sharedtaskId = sharedtaskId; }
    setrole(role) { this.role = role; }
    setcreatedTime(createdTime) { this.createdTime = createdTime; }
    setupdatedTime(updatedTime) { this.updatedTime = updatedTime; }
    settaskId(taskId) { this.taskId = taskId; }
    setuserId(userId) { this.userId = userId; }

    toString() {
        return `Shared Task:
        - Shared task ID: ${this.sharedtaskId}
        - Role: ${this.role}
        - Created Time: ${this.createdTime}
        - Updated Time: ${this.updatedTime}
        - Task ID: ${this.taskId}
        - User ID: ${this.userId}`;
    }
}

async function addSharedTask(sharedtaskData) {
    const {role, taskId, userId} = sharedtaskData;
    
    const query = "insert into Sharedtask(role, taskId, userId) values (?, ?, ?)";
    const values = [role, taskId, userId];

    try {
        const [result] = await pool.query(query, values);
        return result.insertId
    } catch (error) {
        console.error("Error adding sharedtask:", error);
        throw error;
    }
}

async function isUserSharedTask(taskId, userId) {
    const query = "select * from Sharedtask where taskId = ? and userId = ?";
    const values = [taskId, userId];

    try {
        const [rows] = await pool.query(query, values);
        if (rows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking shared task for user:", error);
        throw error;
    }
}

async function getAllSharedTasks() {
    const query = "select * from Sharedtask";

    try {
        const [result] = await pool.query(query);
        if (result.length == 0) {
            throw new Error("No sharedtask");
        }
        return result;
    } catch (error) {
        console.error("Error getting all sharedtask", error);
        throw error;
    }
}

async function getSharedTaskById(sharedtaskId) {
    const query = "select * from Sharedtask where sharedtaskId = ?";
    const values = [sharedtaskId];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("Sharedtask not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting sharedtask by ID:", error);
        throw error;
    }
}

async function getSharedTasksByUser(userId) {
    const query = "select * from Sharedtask where userId = ?";
    const values = [userId];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("Sharedtask not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting sharedtask by user ID:", error);
        throw error;
    }
}

async function getUsersBySharedTask(taskId) {
    const query = "select u.username, st.role from Sharedtask st join User u on st.userId = u.userId where st.taskId = ?";
    const values = [taskId];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("User not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting users by sharedtask:", error);
        throw error;
    }
}

async function getSharedTasksByRole(userId, role) {
    const query = "select t.title, t.description, t.status from Sharedtask st join Task t on st.taskId = t.taskId where st.userId = ? and st.role = ?";
    const values = [userId, role];

    try {
        const [tasks] = await pool.query(query, values);
        return tasks;
    } catch (error) {
        console.error("Error getting shared tasks by role:", error);
        throw error;
    }
}

async function deleteSharedTask(sharedtaskId, userId, role) {
    let query, values;

    if (role === "viewer") {
        query = "delete from Sharedtask where sharedtaskId = ? and userId = ?";
        values = [sharedtaskId, userId];
    } else if (["creator", "editor"].includes(role)) {
        query = "delete from Sharedtask where sharedtaskId = ?";
        values = [sharedtaskId];
    } else {
        throw new Error("No permissions to delete the shared task");
    }

    try {
        const [result] = await pool.query(query, values);
        if (result.affectedRows == 0) {
            throw new Error("No shared task with the given ID is found to be deleted");
        }
        return {message: "Shared task successfully deleted"};
    } catch (error) {
        console.error("Error deleting shared task by ID:", error);
        throw error;
    }
}

async function deleteSharedTasksByTaskId(taskId) {
    const query = "delete from Sharedtask where taskId = ?";
    const values = [taskId];

    try {
        const [result] = await pool.query(query, values);
        if (result.affectedRows == 0) {
            throw new Error("No shared tasks found for the given task ID.");
        }
        return {message: "All shared tasks for the task have been deleted successfully"};
    } catch (error) {
        console.error("Error deleting shared tasks by task ID:", error);
        throw error;
    }
}

async function updateSharedTaskRole(sharedTaskId, role) {
    const query = "update Sharedtask set role = ? where sharedTaskId = ?";
    const values = [role, sharedTaskId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No sharedtask found to be updated");
        }
        return {message: "Role updated successfully"}; 
    } catch (error) {
        console.error("Error updating role by taskId:", error);
        throw new error;
    }
}

export default {
    addSharedTask,
    deleteSharedTask,
    getAllSharedTasks,
    getSharedTaskById,
    getSharedTasksByUser,
    updateSharedTaskRole,
    isUserSharedTask,
    deleteSharedTasksByTaskId,
    getSharedTasksByRole,
    getUsersBySharedTask
};