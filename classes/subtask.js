class Subtask {
    constructor(subtaskId, title, description, status, deadline, createdTime, updatedTime, createdUserId, assignedUserId) {
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
        - Task ID: ${this.taskId}
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