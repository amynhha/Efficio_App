//This class is responsible for the Subtask data, including queries that have to do with subtasks
import db from './database.js';

class Subtask {
    constructor(SubtaskId, title, description, status, deadline, createdTime, updatedTime, createdUserId, assignedUserId) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.deadline = deadline;
        this.createdTime = createdTime;
        this.updatedTime = updatedTime;
        this.createdUserId = createdUserId;
        this.assignedUserId = assignedUserId;
    }

    //Getters and setters
    gettaskId() { return this.taskId; }
    gettitle() { return this.title; }
    getdescription() { return this.description; }
    getstatus() { return this.status; }
    getdeadline() { return this.deadline; }
    getcreatedTime() { return this.createdTime; }
    getupdatedTime() { return this.updatedTime; }
    getcreatedUserId() { return this.createdUserId; }
    getassignedUserId() { return this.assignedUserId; }

    settaskId(taskId) { this.taskId = taskId; }
    settitle(title) { this.title = title; }
    setdescription(description) { this.description = description; }
    setstatus(status) { this.status = status; }
    setdeadline(deadline) { this.deadline = deadline; }
    setcreatedTime(createdTime) { this.createdTime = createdTime; }
    setupdatedTime(updatedTime) { this.updatedTime = updatedTime; }
    setcreatedUserId(createdUserId) { this.createdUserId = createdUserId; }
    setcreatedUserId(assignedUserId) { this.assignedUserId = assignedUserId; }

    toString() {
        return `Subtask:
        - task ID: ${this.taskId}
        - Title: ${this.title}
        - Description: ${this.description}
        - Status: ${this.status}
        - Deadline: ${this.deadline}
        - Created Time: ${this.createdTime}
        - Updated Time: ${this.updatedTime}
        - Created User ID: ${this.createdUserId} 
        - Assigned User ID: ${this.assignedUserId}`;
    }
}

async function addSubtask(taskId, subtaskData) {
    const {title, description, status, deadline, createdUserId, assignedUserId} = subtaskData;
    
    const query = "insert into Subtask(title, description, status, deadline, createdUserId, assignedUserId) values (?, ?, ?, ?, ?, ?)";
    const values = [title, description, status, deadline, createdUserId, assignedUserId];

    try {
        const [result] = await pool.query(query, values);
        return result.insertId
    } catch (error) {
        console.error("Error adding Subtask:", error);
        throw error;
    }
}

async function getAllSubtasks() {
    const query = "select * from Subtask";

    try {
        const [result] = await pool.query(query);
        if (result.length == 0) {
            throw new Error("No Subtask");
        }
        return result;
    } catch (error) {
        console.error("Error getting all Subtasks", error);
        throw error;
    }
}

async function getSubtaskByID(subtaskId) {
    const query = "select * from task where subtaskId = ?";
    const values = [subtaskId];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("Subtask not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting Subtask by ID:", error);
        throw error;
    }
}

async function getSubtasksByUser(username) {
    const query = "select * from Subtask where username = ?";
    const values = [username];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("Subtask not found");
        }
        return result;
    } catch (error) {
        console.error("Error getting Subtask by username:", error);
        throw error;
    }
}

async function getSubtasksByStatus(status) {
    const query = "select * from Subtask where status = ?";
    const values = [status];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("Subtask not found");
        }
        return result;
    } catch (error) {
        console.error("Error getting Subtask by status:", error);
        throw error;
    }
}

async function getSubtasksByTask(taskId) {
    const query = "select * from Subtask where taskId = ?";
    const values = [taskId];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("Subtask not found");
        }
        return result;
    } catch (error) {
        console.error("Error getting Subtask by Task ID:", error);
        throw error;
    }
}

async function deleteSubtaskById(subtaskId) {
    const query = "delete from Subtask where subtaskId = ?";
    const values = [subtaskId];

    try {
        const [result] = await pool.query(query, values);
        if (result.affectedRows == 0) {
            throw new Error("No Subtask with given ID is found to be deleted");
        }
        return {message: "Subtask is successfully deleted"};
    } catch (error) {
        console.error("Error deleting Subtask by ID:", error);
        throw error;
    }
}

//set assigned user back to null
async function deleteSubtaskAssignedUser(subtaskId) {
    const query = "update Subtask set assignedUserId = null where subtaskId = ?";

    try {
        const [result] = await pool.query(query, [subtaskId]);

        if (result.affectedRows == 0) {
            throw new Error("Failed assigned user deletion");
        }
        return {message: "Assigned user deleted successfully"}; 
    } catch (error) {
        console.error("Error deleting assigned user by subtaskId:", error);
        throw new error;
    }
}

async function getSubtasksWithin(numDay) {
    const query = "select * from Subtask where deadline between curdate() and curdate() + interval ? day";
    try {
        const [rows] = await pool.query(query, [numDay]);
        return rows;
    } catch (error) {
        console.error('Error getting Subtasks within specified days:', error);
        throw error;
    }
}

async function updateSubtaskStatus(subtaskId, status) {
    const query = "update Task set status = ? where subtaskId = ?";
    const values = [status, subtaskId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No subtask found to be updated");
        }
        return {message: "Status updated successfully"}; 
    } catch (error) {
        console.error("Error updating status by subtaskId:", error);
        throw new error;
    }
}

async function updateSubtaskTitle(subtaskId, title) {
    const query = "update Subtask set title = ? where subtaskId = ?";
    const values = [title, subtaskId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No subtask found to be updated");
        }
        return {message: "Title updated successfully"}; 
    } catch (error) {
        console.error("Error updating title by subtaskId:", error);
        throw new error;
    }
}

async function updateSubtaskAssignedUser(subtaskId, username) {
    const query = `update Subtak st join User u on st.assignedUserid = u.userId
                set st.assignedUserId = (select userId from User where username = ?)
                where st.subtaskId = ? and u.username = ?`;
    const values = [username, subtaskId, username];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("Failed assigned user updating");
        }
        return {message: "Assigned user updated successfully"}; 
    } catch (error) {
        console.error("Error updating assigned user by subtaskId:", error);
        throw new error;
    }
}

async function updateSubtaskDescription(subtaskId, description) {
    const query = "update Subtask set description = ? where subtaskId = ?";
    const values = [description, subtaskId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No subtask found to be updated");
        }
        return {message: "Description updated successfully"}; 
    } catch (error) {
        console.error("Error updating description by subtaskId:", error);
        throw new error;
    }
}
async function updateSubtaskDeadline(subtaskId, deadline) {
    const query = "update Subtask set deadline = ? where subtaskId = ?";
    const values = [deadline, subtaskId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No subtask found to be updated");
        }
        return {message: "Deadline updated successfully"}; 
    } catch (error) {
        console.error("Error updating deadline by subtaskId:", error);
        throw new error;
    }
}

export default {
    addSubtask,
    getAllSubtasks,
    getSubtaskByID,
    getSubtasksByUser,
    getSubtasksByStatus,
    getSubtasksWithin,
    getSubtasksByTask,
    deleteSubtaskById,
    deleteSubtaskAssignedUser,
    updateSubtaskStatus,
    updateSubtaskTitle,
    updateSubtaskAssignedUser,
    updateSubtaskDescription,
    updateSubtaskDeadline
};