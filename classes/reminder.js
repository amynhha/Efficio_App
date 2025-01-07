class Reminder {
    constructor(reminderId, message, remindedTime, taskId, subtaskId) {
       this.reminderId = reminderId;
       this.message = message;
       this.remindedTime = remindedTime;
       this.taskId = taskId;
       this.subtaskId = subtaskId;
    }

    //Getters and setters
    getreminderId() { return this.reminderId; }
    getmessage() { return this.message; }
    getreminderTime() { return this.reminderTime; }
    gettaskId() { return this.taskId; }
    getsubtaskId() { return this.subtaskId; }

    setreminderId(reminderId) { this.reminderId = reminderId; }
    setmessage(message) { this.message = message; }
    setreminderTime(reminderTime) { this.reminderTime = reminderTime; }
    settaskId(taskId) { this.taskId = taskId; }
    setsubtaskId(subtaskId) { this.subtaskId = subtaskId; }

    toString() {
        return `Reminder:
        - Reminder ID: ${this.userId}
        - Message: ${this.username}
        - Reminder Time: ${this.email}
        - Task ID: ${this.createdTime}
        - Subtask ID: ${this.profilePic}`;
    }
    
}