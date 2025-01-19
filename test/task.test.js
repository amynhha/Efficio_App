import Task from '../src/task.js';
import { db } from '../src/database.js';
import { expect, vi } from 'vitest';

// Mock db
vi.mock('../src/database.js', () => ({
    db: {
        query: vi.fn(),
    },
}));

describe("Task Functions", () => {
    afterEach(() => {
        vi.clearAllMocks(); // Clear mocks after each test
    });

    const tasks = [
        {
          taskId: 1,
          title: 'Task 1',
          description: 'Description 1',
          deadline: '2025-01-15',
          priority: 'high',
          userId: 1,
          categoryId: 1,
        },
        {
          taskId: 2,
          title: 'Task 2',
          description: 'Description 2',
          status: 'Completed',
          deadline: '2025-01-20',
          priority: 'medium',
          userId: 1,
          categoryId: 2,
        },
      ];

//addTask
    test("askTask should insert a new task and return insertId", async () => {
        const taskData = {
            title: 'Test Task',
            description: 'Test description',
            deadline: '2025-01-20',
            priority: 'High',
            userId: 1,
            categoryId: 2
        };
        db.query.mockResolvedValue([{ insertId: 1 }]);

        const result = await Task.addTask(taskData);
        expect(result).toBe(1);
    });

    test('should throw error if task insert fails', async () => {
        const taskData = {
            title: 'Test Task',
            description: 'Test description',
            deadline: '2025-01-20',
            priority: 'High',
            userId: 1,
            categoryId: 2
        };
        db.query.mockRejectedValue(new Error('Database error'));
    
        await expect(Task.addTask(taskData)).rejects.toThrow('Database error');
    });

//getAllTasks
test('should return all tasks', async () => {
    db.query.mockResolvedValue([tasks]); 
  
    const result = await Task.getAllTasks();
  
    expect(result).toEqual(tasks);
    expect(db.query).toHaveBeenCalledWith('select * from Task');
  });
  
  test('should throw an error when database query fails', async () => {
    db.query.mockRejectedValue(new Error('Database query failed'));

    await expect(Task.getAllTasks()).rejects.toThrow('Database query failed');
    expect(db.query).toHaveBeenCalledWith('select * from Task');
  });

//getTaskByID
    test('should return a task by ID successfully', async () => {
        db.query.mockResolvedValue([[tasks[0]]]); 

        const result = await Task.getTaskByID(1);

        expect(result).toEqual([tasks[0]]);
        expect(db.query).toHaveBeenCalledWith('select * from Task where taskId = ?', [1]);
    });

    test('should throw an error when database query fails', async () => {
        db.query.mockRejectedValue(new Error('Database query failed'))

        await expect(Task.getTaskByID(1)).rejects.toThrow('Database query failed');
        expect(db.query).toHaveBeenCalledWith('select * from Task where taskId = ?', [1]);
    });

//getTasksByUser
    test('should return tasks by username successfully', async () => {
    db.query.mockResolvedValue([tasks]); 

    const result = await Task.getTasksByUser('testuser');

    expect(result).toEqual(tasks);
    expect(db.query).toHaveBeenCalledWith('select * from Task where username = ?', ['testuser']);
  });

    test('should throw an error when database query fails', async () => {
    db.query.mockRejectedValue(new Error('Database query failed')); 

    await expect(Task.getTasksByUser('testuser')).rejects.toThrow('Database query failed');
    expect(db.query).toHaveBeenCalledWith('select * from Task where username = ?', ['testuser']);
  });

//getTasksByCategory
test('should return tasks by category ID successfully', async () => {
    db.query.mockResolvedValue([tasks]);

    const result = await Task.getTasksByCategory(1);

    expect(result).toEqual(tasks);
    expect(db.query).toHaveBeenCalledWith('select * from Task where categoryId = ?', [1]);
  });

  test('should throw an error when database query fails', async () => {
    db.query.mockRejectedValue(new Error('Database query failed')); 

    await expect(Task.getTasksByCategory(1)).rejects.toThrow('Database query failed');
    expect(db.query).toHaveBeenCalledWith('select * from Task where categoryId = ?', [1]);
  });

//getTasksByPriority
test('should return tasks by priority successfully', async () => {
    db.query.mockResolvedValue([tasks]); // Mock success

    const result = await Task.getTasksByPriority('high');

    expect(result).toEqual(tasks);
    expect(db.query).toHaveBeenCalledWith('select * from Task where priority = ?', ['high']);
  });

  test('should throw an error when database query fails', async () => {
    db.query.mockRejectedValue(new Error('Database query failed')); // Mock failure

    await expect(Task.getTasksByPriority('high')).rejects.toThrow('Database query failed');
    expect(db.query).toHaveBeenCalledWith('select * from Task where priority = ?', ['high']);
  });

//getTasksByStatus
    test('should return tasks by status successfully', async () => {
    db.query.mockResolvedValue([tasks]); // Mock success

    const result = await Task.getTasksByStatus('pending');

    expect(result).toEqual(tasks);
    expect(db.query).toHaveBeenCalledWith('select * from Task where status = ?', ['pending']);
  });

  test('should throw an error when database query fails', async () => {
    db.query.mockRejectedValue(new Error('Database query failed')); // Mock failure

    await expect(Task.getTasksByStatus('pending')).rejects.toThrow('Database query failed');
    expect(db.query).toHaveBeenCalledWith('select * from Task where status = ?', ['pending']);
  });

//getTasksWithin
    test('should return tasks within specified days successfully', async () => {
        db.query.mockResolvedValue([tasks]);

        const result = await Task.getTasksWithin([7]);

        expect(result).toEqual(tasks);
        expect(db.query).toHaveBeenCalled('select * from Task where deadline between curdate() and curdate() + interval ? day', [7]);
    });

    test('should throw an error when database query fails', async () => {
        db.query.mockRejectedValue(new Error('Database query failed'));
  
        await expect(Task.getTasksWithin(7)).rejects.toThrow('Database query failed');
        expect(db.query).toHaveBeenCalledWith('select * from Task where deadline between curdate() and curdate() + interval ? day',[7]);
    });

//deleteTaskById
test('should delete a task by ID successfully', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Task.deleteTaskById(1);

    expect(result).toEqual({ message: 'Task is successfully deleted' });
    expect(db.query).toHaveBeenCalledWith('delete from Task where taskId = ?', [1]);
  });

  test('should throw an error if no task is found to delete', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Task.deleteTaskById(1)).rejects.toThrow(
      'No task with given ID is found to be deleted'
    );
    expect(db.query).toHaveBeenCalledWith('delete from Task where taskId = ?', [1]);
  });

  test('should throw an error when database query fails', async () => {
    db.query.mockRejectedValue(new Error('Database query failed'));

    await expect(Task.deleteTaskById(1)).rejects.toThrow('Database query failed');
    expect(db.query).toHaveBeenCalledWith('delete from Task where taskId = ?', [1]);
  });

//updates
    const updates = [
      { method: 'updateTaskPriority', column: 'priority', value: 'high' },
      { method: 'updateTaskStatus', column: 'status', value: 'completed' },
      { method: 'updateTaskTitle', column: 'title', value: 'Updated Task Title' },
      { method: 'updateTaskDescription', column: 'description', value: 'Updated Description' },
      { method: 'updateTaskCategory', column: 'category', value: 'Updated Category' },
      { method: 'updateTaskDeadline', column: 'deadline', value: '2025-01-31' },
    ];

    updates.forEach(({ method, column, value }) => {
      describe(method, () => {
        test(`should update ${column} successfully`, async () => {
          db.query.mockResolvedValue([{ affectedRows: 1 }]);

          const result = await Task[method](1, value); //(taskId, value)

          expect(result).toEqual({ message: `${column.charAt(0).toUpperCase() + column.slice(1)} updated successfully` });
          expect(db.query).toHaveBeenCalledWith(`update Task set ${column} = ? where taskId = ?`, [value, 1]);
        });

        test(`should throw an error if no task is found to update ${column}`, async () => {
          db.query.mockResolvedValue([{ affectedRows: 0 }]);

          await expect(Task[method](1, value)).rejects.toThrow('No task found to be updated');
          expect(db.query).toHaveBeenCalledWith(`update Task set ${column} = ? where taskId = ?`, [value, 1]);
        });

        test(`should throw an error when database query fails for updating ${column}`, async () => {
          db.query.mockRejectedValue(new Error('Database query failed'));

          await expect(Task[method](1, value)).rejects.toThrow('Database query failed');
          expect(db.query).toHaveBeenCalledWith(`update Task set ${column} = ? where taskId = ?`, [value, 1]);
        });
      });
    });
  });