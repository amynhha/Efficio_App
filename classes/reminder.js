//This class is responsible for the Reminder data, including queries that have to do with reminders
import db from './database.js';
import cron from 'node-cron';

class Reminder {
    constructor(reminderId, message, remindedTime, taskId, subtaskId, userId) {
       this.reminderId = reminderId;
       this.message = message;
       this.remindedTime = remindedTime;
       this.taskId = taskId;
       this.subtaskId = subtaskId;
       this.userId = userId;
    }

    //Getters and setters
    getreminderId() { return this.reminderId; }
    getmessage() { return this.message; }
    getreminderTime() { return this.reminderTime; }
    gettaskId() { return this.taskId; }
    getsubtaskId() { return this.subtaskId; }
    getuserId() { return this.userId; }

    setreminderId(reminderId) { this.reminderId = reminderId; }
    setmessage(message) { this.message = message; }
    setreminderTime(reminderTime) { this.reminderTime = reminderTime; }
    settaskId(taskId) { this.taskId = taskId; }
    setsubtaskId(subtaskId) { this.subtaskId = subtaskId; }
    setuserId(userId) { this.userId = userId; }

    toString() {
        return `Reminder:
        - Reminder ID: ${this.userId}
        - Message: ${this.username}
        - Reminder Time: ${this.email}
        - Task ID: ${this.createdTime}
        - Subtask ID: ${this.profilePic}
        - User ID: ${this.userId}`;
    }
    
}

async function addReminder(reminderData) {
    const {message, reminderTime, taskId, subtaskId, userId} = reminderData;
    
    const query = "insert into Reminder(message, reminderTime, taskId, subtaskId) values (?, ?, ?, ?)";
    const values = [message, reminderTime, taskId, subtaskId, userId];

    try {
        const [result] = await pool.query(query, values);
        return result.insertId
    } catch (error) {
        console.error("Error adding reminder by task ID:", error);
        throw error;
    }
}

async function getAllReminder() {
    const query = "select * from Reminder";

    try {
        const [result] = await pool.query(query);
        if (result.length == 0) {
            throw new Error("No reminder");
        }
        return result;
    } catch (error) {
        console.error("Error getting all reminder", error);
        throw error;
    }
}

async function getReminderkById(reminderId) {
    const query = "select * from Reminder where reminderId = ?";
    const values = [reminderId];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("Reminder not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting Reminder by ID:", error);
        throw error;
    }
}

async function getRemindersByUser(userId) {
    const query = "select * from Reminder where userId = ?";
    const values = [userId];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("Reminder not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting Reminder by user ID:", error);
        throw error;
    }
}

async function checkReminders() {
    const query = "select message FROM Reminder where reminderTime <= NOW() and reminderTime > DATE_SUB(NOW(), interval 1 minute)"
    
    try {
        const [result] = await pool.query(query);
        if (result.length > 0) {
            result.forEach(reminder => {
                console.log(`Reminder: ${reminder.message}`);
            });
        }
    } catch (error) {
        console.error('Error checking reminders:', error);
    }
}
// Set up a cron job to check every minute until reminder time
cron.schedule('* * * * *', async () => {
    await checkReminders();
});

async function deleteReminder(reminderId) {
    const query = "delete from Reminder where reminderId = ?";
    const values = [reminderId];

    try {
        const [result] = await pool.query(query, values);
        if (result.affectedRows == 0) {
            throw new Error("No Reminder found for the given task ID.");
        }
        return {message: "Reminder is deleted successfully"};
    } catch (error) {
        console.error("Error deleting Reminder by reminder ID:", error);
        throw error;
    }
}

async function updateReminderMessage(reminderId, message) {
    const query = "update Reminder set message = ? where reminderId = ?";
    const values = [message, reminderId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No Reminder found to be updated");
        }
        return {message: "message updated successfully"}; 
    } catch (error) {
        console.error("Error updating message by reminderId:", error);
        throw new error;
    }
}

async function updateReminderTime(reminderId, reminderTime) {
    const query = "update Reminder set reminderTime = ? where reminderId = ?";
    const values = [reminderTime, reminderId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No Reminder found to be updated");
        }
        return {message: "reminder time updated successfully"}; 
    } catch (error) {
        console.error("Error updating reminder time by reminderId:", error);
        throw new error;
    }
}

export default {
    addReminder,
    getAllReminder,
    getReminderkById,
    getRemindersByUser,
    checkReminders,
    deleteReminder,
    updateReminderMessage,
    updateReminderTime
};