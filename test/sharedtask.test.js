import Sharedtask from '../src/sharedtask.js';
import { db } from '../src/database.js';
import { expect, vi } from 'vitest';

// Mock db
vi.mock('../src/database.js', () => ({
    db: {
        query: vi.fn(),
    },
}));

describe("Sharedtask Functions", () => {
    afterEach(() => {
        vi.clearAllMocks(); // Clear mocks after each test
    });

const sharedtasks = [
  { sharedtaskId: 1,
    role: 'creator',
    taskId: 1,
    userId: 1 },

  { sharedtaskId: 2,
    role: 'editor',
    taskId: 2,
    userId: 2 }
];

// addSharedTask
test('addSharedtask adds a sharedtask successfully', async () => {
  db.query.mockResolvedValue([{ insertId: 1 }]);

  const result = await Sharedtask.addSharedTask(1, sharedtasks[0]);
  expect(result).toBe(1);
  expect(db.query).toHaveBeenCalledWith(
    'insert into Sharedtask(role, taskId, userId) values (?, ?, ?)',
    ['creator', 1, 1]
  );
});

test('addSharedTask throws an error if database fails', async () => {
  db.query.mockRejectedValue(new Error('DB Error'));

  await expect(Sharedtask.addSharedTask(1, sharedtasks[0])).rejects.toThrow('DB Error');
});

//getAllSharedTasks
test('getAllSharedTasks retrieves all sharedtasks successfully', async () => {
  db.query.mockResolvedValue([sharedtasks]);

  const result = await Sharedtask.getAllSharedTasks();
  expect(result).toEqual(sharedtasks);
  expect(db.query).toHaveBeenCalledWith('select * from Sharedtask');
});

test('getAllSharedTasks throws an error if no sharedtasks found', async () => {
  db.query.mockResolvedValue([[]]);

  await expect(Sharedtask.getAllSharedTasks()).rejects.toThrow('No sharedtask');
});

//getSharedTaskById
test('should return shared task by ID successfully', async () => {
  db.query.mockResolvedValue([[sharedtasks[0]]]);

  const result = await Sharedtask.getSharedTaskById(1);
  expect(result).toEqual([sharedtasks[0]]);
  expect(db.query).toHaveBeenCalledWith('select * from Sharedtask where sharedtaskId = ?', [1]);
});

test('getSharedTaskById throws an error if shared task not found', async () => {
  db.query.mockResolvedValue([[]]);

  await expect(Sharedtask.getSharedTaskById(999)).rejects.toThrow('Sharedtask not found');
});

//getSharedTasksByUser
test('should return shared task by username successfully', async () => {
    db.query.mockResolvedValue([sharedtasks]); 

    const result = await Sharedtask.getSharedTasksByUser('testuser');

    expect(result).toEqual(sharedtasks);
    expect(db.query).toHaveBeenCalledWith('select * from Sharedtask where userId = ?', ['testuser']);
});

test('should throw an error when database query fails', async () => {
    db.query.mockRejectedValue(new Error('Database query failed')); 

    await expect(Sharedtask.getSharedTasksByUser('testuser')).rejects.toThrow('Database query failed');
    expect(db.query).toHaveBeenCalledWith('select * from Sharedtask where userId = ?', ['testuser']);
});

//getUsersBySharedTask
test('returns users associated with the shared task', async () => {
    db.query.mockResolvedValue([
        [
            { username: 'testuser1', role: 'editor' },
            { username: 'testuser2', role: 'viewer' },
        ],
    ]);

    const result = await Sharedtask.getUsersBySharedTask(1);

    expect(result).toEqual([
        { username: 'testuser1', role: 'editor' },
        { username: 'testuser2', role: 'viewer' },
    ]);

    expect(db.query).toHaveBeenCalledWith(
        'select u.username, st.role from Sharedtask st join User u on st.userId = u.userId where st.taskId = ?',
        [1]
    );
});

test('throws an error if no users are associated with the task', async () => {
    db.query.mockResolvedValue([[]]);

    await expect(Sharedtask.getUsersBySharedTask(99)).rejects.toThrow('User not found');

    expect(db.query).toHaveBeenCalledWith(
        'select u.username, st.role from Sharedtask st join User u on st.userId = u.userId where st.taskId = ?',
        [99]
    );
});

test('throws an error if there is a database error', async () => {
    db.query.mockRejectedValue(new Error('Database connection failed'));

    await expect(Sharedtask.getUsersBySharedTask(1)).rejects.toThrow(
        'Database connection failed'
    );

    expect(db.query).toHaveBeenCalledWith(
        'select u.username, st.role from Sharedtask st join User u on st.userId = u.userId where st.taskId = ?',
        [1]
    );
});

//getSharedTasksByRole
test('returns users associated with the shared task', async () => {
    db.query.mockResolvedValue([
        [
            { title: 'title1', description: 'description1', status: 'Pending' },
            { title: 'title2', description: 'description2', status: 'In Progress' },
        ],
    ]);

    const result = await Sharedtask.getSharedTasksByRole(1, 'editor');

    expect(result).toEqual([
        { title: 'title1', description: 'description1', status: 'Pending' },
        { title: 'title2', description: 'description2', status: 'In Progress' },
    ]);

    expect(db.query).toHaveBeenCalledWith(
        'select t.title, t.description, t.status from Sharedtask st join Task t on st.taskId = t.taskId where st.userId = ? and st.role = ?',
        [1, 'editor']
    );
});

test('returns an empty array when no tasks are found', async () => {
    db.query.mockResolvedValue([[]]);

    const result = await Sharedtask.getSharedTasksByRole(99, 'viewer');

    expect(result).toEqual([]);
    expect(db.query).toHaveBeenCalledWith(
        'select t.title, t.description, t.status from Sharedtask st join Task t on st.taskId = t.taskId where st.userId = ? and st.role = ?',
        [99, 'viewer']
    );
});

test('throws an error if there is a database error', async () => {
    db.query.mockRejectedValue(new Error('Database connection failed'));

    await expect(Sharedtask.getSharedTasksByRole(99, 'creator')).rejects.toThrow(
        'Database connection failed'
    );

    expect(db.query).toHaveBeenCalledWith(
        'select t.title, t.description, t.status from Sharedtask st join Task t on st.taskId = t.taskId where st.userId = ? and st.role = ?',
        [99, 'creator']
    );
});

//deleteSharedTask
test('deletes shared task for viewer role', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Sharedtask.deleteSharedTask(1, 1, 'viewer');
    expect(result).toEqual({ message: 'Shared task successfully deleted' });

    expect(db.query).toHaveBeenCalledWith(
        'delete from Sharedtask where sharedtaskId = ? and userId = ?',
        [1, 1]
    );
});

test('deletes shared task for creator role', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Sharedtask.deleteSharedTask(1, null, 'creator');
    expect(result).toEqual({ message: 'Shared task successfully deleted' });

    expect(db.query).toHaveBeenCalledWith(
        'delete from Sharedtask where sharedtaskId = ?',
        [1]
    );
});

test('throws error for invalid role', async () => {
    await expect(Sharedtask.deleteSharedTask(1, 1, 'admin')).rejects.toThrow(
        'No permissions to delete the shared task'
    );
});

test('throws error if no task is found to delete', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Sharedtask.deleteSharedTask(1, 1, 'viewer')).rejects.toThrow(
        'No shared task with the given ID is found to be deleted'
    );
});

//deleteSharedTasksByTaskId
test('deletes all shared tasks for a task ID', async () => {
    db.query.mockResolvedValue([{ affectedRows: 3 }]);

    const result = await Sharedtask.deleteSharedTasksByTaskId(1);
    expect(result).toEqual({
        message: 'All shared tasks for the task have been deleted successfully',
    });

    expect(db.query).toHaveBeenCalledWith(
        'delete from Sharedtask where taskId = ?',
        [1]
    );
});

test('throws error if no shared tasks are found for a task ID', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Sharedtask.deleteSharedTasksByTaskId(99)).rejects.toThrow(
        'No shared tasks found for the given task ID.'
    );
});

//updateSharedTaskRole
test('updates the role of a shared task successfully', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Sharedtask.updateSharedTaskRole(1, 'editor');
    expect(result).toEqual({ message: 'Role updated successfully' });

    expect(db.query).toHaveBeenCalledWith(
        'update Sharedtask set role = ? where sharedTaskId = ?',
        ['editor', 1]
    );
});

test('throws error if no shared task is found to update', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Sharedtask.updateSharedTaskRole(99, 'editor')).rejects.toThrow(
        'No sharedtask found to be updated'
    );
});

test('throws error if database operation fails', async () => {
    db.query.mockRejectedValue(new Error('Database connection failed'));

    await expect(Sharedtask.updateSharedTaskRole(1, 'viewer')).rejects.toThrow(
        'Database connection failed'
    );

    expect(db.query).toHaveBeenCalledWith(
        'update Sharedtask set role = ? where sharedTaskId = ?',
        ['viewer', 1]
    );
});

});


