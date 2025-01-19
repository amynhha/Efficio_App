import Reminder from '../src/reminder.js';
import { db } from '../src/database.js';
import cron from 'node-cron';
import { expect, vi } from 'vitest';

// Mock db
vi.mock('../src/database.js', () => ({
    db: {
        query: vi.fn(),
    },
}));

describe("Reminder Functions", () => {
    afterEach(() => {
        vi.clearAllMocks(); // Clear mocks after each test
    });

// addReminder
test('addReminder - successfully adds a reminder', async () => {
    db.query.mockResolvedValue([{ insertId: 1 }]);

    const reminderData = {
        reminderTime: '2025-01-20 10:00:00',
        taskId: 1,
        subtaskId: 1,
        userId: 1,
    };
    const result = await Reminder.addReminder(reminderData);
    expect(result).toBe(1);

    expect(db.query).toHaveBeenCalledWith(
        'insert into Reminder(message, reminderTime, taskId, subtaskId) values (?, ?, ?, ?)',
        [
            null,
            reminderData.reminderTime,
            reminderData.taskId,
            reminderData.subtaskId,
            reminderData.userId,
        ]
    );
});

// getAllReminder
test('getAllReminder - returns all reminders', async () => {
    db.query.mockResolvedValue([[{ reminderId: 1, message: 'Test' }]]);

    const result = await Reminder.getAllReminder();
    expect(result).toEqual([{ reminderId: 1, message: 'Test' }]);

    expect(db.query).toHaveBeenCalledWith('select * from Reminder');
});

test('getAllReminder - throws error when no reminders exist', async () => {
    db.query.mockResolvedValue([[]]);

    await expect(Reminder.getAllReminder()).rejects.toThrow('No reminder');
});

// getReminderById
test('getReminderById - retrieves a reminder by ID', async () => {
    db.query.mockResolvedValue([[{ reminderId: 1, message: 'Test' }]]);

    const result = await Reminder.getReminderkById(1);
    expect(result).toEqual([{ reminderId: 1, message: 'Test' }]);

    expect(db.query).toHaveBeenCalledWith(
        'select * from Reminder where reminderId = ?',
        [1]
    );
});

test('getReminderById - throws error if reminder not found', async () => {
    db.query.mockResolvedValue([[]]);

    await expect(Reminder.getReminderkById(99)).rejects.toThrow('Reminder not found');
});

// getRemindersByUser
test('getRemindersByUser - retrieves reminders by user ID', async () => {
    db.query.mockResolvedValue([[{ reminderId: 1, message: 'Test' }]]);

    const result = await Reminder.getRemindersByUser(1);
    expect(result).toEqual([{ reminderId: 1, message: 'Test' }]);

    expect(db.query).toHaveBeenCalledWith(
        'select * from Reminder where userId = ?',
        [1]
    );
});

test('getRemindersByUser - throws error if no reminders are found', async () => {
    db.query.mockResolvedValue([[]]);

    await expect(Reminder.getRemindersByUser(99)).rejects.toThrow('Reminder not found');
});

// checkReminders
test('checkReminders - logs reminders due now', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    db.query.mockResolvedValue([[{ message: 'Time to take a break' }]]);

    await Reminder.checkReminders();

    expect(consoleSpy).toHaveBeenCalledWith('Reminder: Time to take a break');
    expect(db.query).toHaveBeenCalledWith(
        'select message FROM Reminder where reminderTime <= NOW() and reminderTime > DATE_SUB(NOW(), interval 1 minute)'
    );
    consoleSpy.mockRestore();
});

// deleteReminder
test('deleteReminder - successfully deletes a reminder', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Reminder.deleteReminder(1);
    expect(result).toEqual({ message: 'Reminder is deleted successfully' });

    expect(db.query).toHaveBeenCalledWith(
        'delete from Reminder where reminderId = ?',
        [1]
    );
});

test('deleteReminder - throws error if no reminder is found', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Reminder.deleteReminder(99)).rejects.toThrow(
        'No Reminder found for the given task ID.'
    );
});

// updateReminderMessage
test('updateReminderMessage - successfully updates reminder message', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Reminder.updateReminderMessage(1, 'Updated message');
    expect(result).toEqual({ message: 'message updated successfully' });

    expect(db.query).toHaveBeenCalledWith(
        'update Reminder set message = ? where reminderId = ?',
        ['Updated message', 1]
    );
});

test('updateReminderMessage - throws error if no reminder is found to update', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Reminder.updateReminderMessage(99, 'New message')).rejects.toThrow(
        'No Reminder found to be updated'
    );
});

// updateReminderTime
test('updateReminderTime - successfully updates reminder time', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Reminder.updateReminderTime(1, '2025-01-20 12:00:00');
    expect(result).toEqual({
        message: 'reminder time updated successfully',
    });

    expect(db.query).toHaveBeenCalledWith(
        'update Reminder set reminderTime = ? where reminderId = ?',
        ['2025-01-20 12:00:00', 1]
    );
});

test('updateReminderTime - throws error if no reminder is found to update', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Reminder.updateReminderTime(99, '2025-01-20 12:00:00')).rejects.toThrow('No Reminder found to be updated');
});

});