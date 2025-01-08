//This class is responsible for the Task data, including queries that have to do with tasks
import db from './database.js';

class Task {
    constructor(taskId, title, description, status, deadline, priority, createdTime, updatedTime, userId, categoryId) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.deadline = deadline;
        this.priority = priority;
        this.createdTime = createdTime;
        this.updatedTime = updatedTime;
        this.userId = userId;
        this.categoryId = categoryId;
    }

    //Getters and setters
    gettaskId() { return this.taskId; }
    gettitle() { return this.title; }
    getdescription() { return this.description; }
    getstatus() { return this.status; }
    getdeadline() { return this.deadline; }
    getpriority() { return this.priority; }
    getcreatedTime() { return this.createdTime; }
    getupdatedTime() { return this.updatedTime; }
    getuserId() { return this.userId; }
    getcategoryId() { return this.categoryId; }

    settaskId(taskId) { this.taskId = taskId; }
    settitle(title) { this.title = title; }
    setdescription(description) { this.description = description; }
    setstatus(status) { this.status = status; }
    setdeadline(deadline) { this.deadline = deadline; }
    setpriority(priority) { this.priority = priority; }
    setcreatedTime(createdTime) { this.createdTime = createdTime; }
    setupdatedTime(updatedTime) { this.updatedTime = updatedTime; }
    setuserId(userId) { this.userId = userId; }
    setcategoryId(categoryId) { this.categoryId = categoryId; }

    toString() {
        return `Task:
        - Task ID: ${this.taskId}
        - Title: ${this.title}
        - Description: ${this.description}
        - Status: ${this.status}
        - Deadline: ${this.deadline}
        - Priority: ${this.priority}
        - Created Time: ${this.createdTime}
        - Updated Time: ${this.updatedTime}
        - User ID: ${this.userId} 
        - Category ID: ${this.categoryId}`;
    }
}

async function addTask(taskData) {
    const {title, description, status, deadline, priority, userId, categoryId} = taskData;
    
    const query = "insert into Task(title, description, status, deadline, priority, userId, categoryId) values (?, ?, ?, ?, ?, ?, ?)";
    const values = [title, description, status, deadline, priority, userId, categoryId];

    try {
        const [result] = await db.query(query, values);
        return result.insertId
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
}

async function getAllTasks() {
    const query = "select * from Task";

    try {
        const [result] = await db.query(query);
        if (result.length == 0) {
            throw new Error("No task");
        }
        return result;
    } catch (error) {
        console.error("Error getting all tasks", error);
        throw error;
    }
}

async function getTaskByID(taskId) {
    const query = "select * from Task where taskId = ?";
    const values = [taskId];

    try {
        const [result] = await db.query(query, values);
        if (result.length == 0) {
            throw new Error("Task not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting task by ID:", error);
        throw error;
    }
}

async function getTasksByUser(username) {
    const query = "select * from Task where username = ?";
    const values = [username];

    try {
        const [result] = await db.query(query, values);
        if (result.length == 0) {
            throw new Error("Task not found");
        }
        return result;
    } catch (error) {
        console.error("Error getting task by username:", error);
        throw error;
    }
}

async function getTasksByCategory(categoryId) {
    const query = "select * from Task where categoryId = ?";
    const values = [categoryId];

    try {
        const [result] = await db.query(query, values);
        if (result.length == 0) {
            throw new Error("Task not found");
        }
        return result;
    } catch (error) {
        console.error("Error getting task by category ID:", error);
        throw error;
    }
}

async function getTasksByPriority(priority) {
    const query = "select * from Task where priority = ?";
    const values = [priority];

    try {
        const [result] = await db.query(query, values);
        if (result.length == 0) {
            throw new Error("Task not found");
        }
        return result;
    } catch (error) {
        console.error("Error getting task by priority:", error);
        throw error;
    }
}

async function getTasksByStatus(status) {
    const query = "select * from Task where status = ?";
    const values = [status];

    try {
        const [result] = await db.query(query, values);
        if (result.length == 0) {
            throw new Error("Task not found");
        }
        return result;
    } catch (error) {
        console.error("Error getting task by status:", error);
        throw error;
    }
}

async function getTasksWithin(numDay) {
    const query = "select * from Task where deadline between curdate() and curdate() + interval ? day";
    try {
        const [rows] = await db.query(query, [numDay]);
        return rows;
    } catch (error) {
        console.error('Error getting tasks within specified days:', error);
        throw error;
    }
}

async function deleteTaskById(taskId) {
    const query = "delete from Task where taskId = ?";
    const values = [taskId];

    try {
        const [result] = await db.query(query, values);
        if (result.affectedRows == 0) {
            throw new Error("No task with given ID is found to be deleted");
        }
        return {message: "Task is successfully deleted"};
    } catch (error) {
        console.error("Error deleting task by ID:", error);
        throw error;
    }
}

async function updateTaskPriority(taskId, priority) {
    const query = "update Task set priority = ? where taskId = ?";
    const values = [priority, taskId];

    try {
        const [result] = await db.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No task found to be updated");
        }
        return {message: "Priority updated successfully"}; 
    } catch (error) {
        console.error("Error updating priority by taskId:", error);
        throw new error;
    }
}

async function updateTaskStatus(taskId, status) {
    const query = "update Task set status = ? where taskId = ?";
    const values = [status, taskId];

    try {
        const [result] = await db.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No task found to be updated");
        }
        return {message: "Status updated successfully"}; 
    } catch (error) {
        console.error("Error updating status by taskId:", error);
        throw new error;
    }
}

async function updateTaskTitle(taskId, title) {
    const query = "update Task set title = ? where taskId = ?";
    const values = [title, taskId];

    try {
        const [result] = await db.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No task found to be updated");
        }
        return {message: "Title updated successfully"}; 
    } catch (error) {
        console.error("Error updating title by taskId:", error);
        throw new error;
    }
}

async function updateTaskDescription(taskId, description) {
    const query = "update Task set description = ? where taskId = ?";
    const values = [description, taskId];

    try {
        const [result] = await db.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No task found to be updated");
        }
        return {message: "Description updated successfully"}; 
    } catch (error) {
        console.error("Error updating description by taskId:", error);
        throw new error;
    }
}

async function updateTaskCategory(taskId, category) {
    const query = "update Task set category = ? where taskId = ?";
    const values = [category, taskId];

    try {
        const [result] = await db.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No task found to be updated");
        }
        return {message: "Category updated successfully"}; 
    } catch (error) {
        console.error("Error updating category by taskId:", error);
        throw new error;
    }
}

async function updateTaskDeadline(taskId, deadline) {
    const query = "update Task set deadline = ? where taskId = ?";
    const values = [deadline, taskId];

    try {
        const [result] = await db.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No task found to be updated");
        }
        return {message: "Deadline updated successfully"}; 
    } catch (error) {
        console.error("Error updating deadline by taskId:", error);
        throw new error;
    }
}

export default {
    addTask,
    deleteTaskById,
    getAllTasks,
    getTaskByID,
    getTasksByUser,
    getTasksByCategory,
    getTasksByPriority,
    getTasksByStatus,
    getTasksWithin,
    updateTaskPriority,
    updateTaskStatus,
    updateTaskTitle,
    updateTaskDescription,
    updateTaskCategory,
    updateTaskDeadline
};