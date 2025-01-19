import Subtask from '../src/subtask.js';
import { db } from '../src/database.js';
import { expect, vi } from 'vitest';

// Mock db
vi.mock('../src/database.js', () => ({
    db: {
        query: vi.fn(),
    },
}));

describe("Subtask Functions", () => {
    afterEach(() => {
        vi.clearAllMocks(); // Clear mocks after each test
    });

const subtasks = [
  { subtaskId: 1, 
    title: 'Subtask 1', 
    status: 'Pending', 
    deadline: '2025-01-15', 
    createdUserId: 1, 
    assignedUserId: 2 },

  { subtaskId: 2, 
    title: 'Subtask 2', 
    description: 'Description 2', 
    deadline: '2025-01-20', 
    createdUserId: 1 }
];

const subtaskId = 1;
const username = 'testuser';

// addSubtask
test('addSubtask adds a subtask successfully', async () => {
  db.query.mockResolvedValue([{ insertId: 1 }]);

  const result = await Subtask.addSubtask(1, subtasks[0]);
  expect(result).toBe(1);
  expect(db.query).toHaveBeenCalledWith(
    'insert into Subtask(title, description, status, deadline, createdUserId, assignedUserId) values (?, ?, ?, ?, ?, ?)',
    ['Subtask 1', null, 'Pending', '2025-01-15', 1, 2]
  );
});

// addSubtask
test('addSubtask adds a subtask successfully', async () => {
  db.query.mockResolvedValue([{ insertId: 2 }]);

  const result = await Subtask.addSubtask(2, subtasks[1]);
  expect(result).toBe(2);
  expect(db.query).toHaveBeenCalledWith(
    'insert into Subtask(title, description, status, deadline, createdUserId, assignedUserId) values (?, ?, ?, ?, ?, ?)',
    ['Subtask 2', 'Description 2', 'Pending', '2025-01-20', 1, null]
  );
});

test('addSubtask throws an error if database fails', async () => {
  db.query.mockRejectedValue(new Error('DB Error'));

  await expect(Subtask.addSubtask(1, subtasks[0])).rejects.toThrow('DB Error');
});

// getAllSubtasks
test('getAllSubtasks retrieves all subtasks successfully', async () => {
  db.query.mockResolvedValue([subtasks]);

  const result = await Subtask.getAllSubtasks();
  expect(result).toEqual(subtasks);
  expect(db.query).toHaveBeenCalledWith('select * from Subtask');
});

test('getAllSubtasks throws an error if no subtasks found', async () => {
  db.query.mockResolvedValue([[]]);

  await expect(Subtask.getAllSubtasks()).rejects.toThrow('No Subtask');
});

// getSubtaskByID
test('should return subtask by ID successfully', async () => {
  db.query.mockResolvedValue([[subtasks[0]]]);

  const result = await Subtask.getSubtaskByID(1);
  expect(result).toEqual([subtasks[0]]);
  expect(db.query).toHaveBeenCalledWith('select * from task where subtaskId = ?', [1]);
});

test('getSubtaskByID throws an error if subtask not found', async () => {
  db.query.mockResolvedValue([[]]);

  await expect(Subtask.getSubtaskByID(999)).rejects.toThrow('Subtask not found');
});

// getSubtasksByUser
test('should return subtasks by username successfully', async () => {
    db.query.mockResolvedValue([subtasks]); 

    const result = await Subtask.getSubtasksByUser('testuser');

    expect(result).toEqual(subtasks);
    expect(db.query).toHaveBeenCalledWith('select * from Subtask where username = ?', ['testuser']);
});

test('should throw an error when database query fails', async () => {
    db.query.mockRejectedValue(new Error('Database query failed')); 

    await expect(Subtask.getSubtasksByUser('testuser')).rejects.toThrow('Database query failed');
    expect(db.query).toHaveBeenCalledWith('select * from Subtask where username = ?', ['testuser']);
});

// getSubtasksByStatus
test('should return subtask by status successfully', async () => {
    db.query.mockResolvedValue([subtasks]); // Mock success

    const result = await Subtask.getSubtasksByStatus('pending');

    expect(result).toEqual(subtasks);
    expect(db.query).toHaveBeenCalledWith('select * from Subtask where status = ?', ['pending']);
});

test('should throw an error when database query fails', async () => {
    db.query.mockRejectedValue(new Error('Database query failed')); // Mock failure

    await expect(Subtask.getSubtasksByStatus('pending')).rejects.toThrow('Database query failed');
    expect(db.query).toHaveBeenCalledWith('select * from Subtask where status = ?', ['pending']);
});

// deleteSubtaskById
test('deleteSubtaskById deletes a subtask successfully', async () => {
  db.query.mockResolvedValue([{ affectedRows: 1 }]);

  const result = await Subtask.deleteSubtaskById(1);
  expect(result).toEqual({ message: 'Subtask is successfully deleted' });
  expect(db.query).toHaveBeenCalledWith('delete from Subtask where subtaskId = ?', [1]);
});

test('deleteSubtaskById throws an error if no subtask found', async () => {
  db.query.mockResolvedValue([{ affectedRows: 0 }]);

  await expect(Subtask.deleteSubtaskById(999)).rejects.toThrow('No Subtask with given ID is found to be deleted');
});

//deleteSubtaskAssignedUser
test('deleteSubtaskById deletes a subtask successfully', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Subtask.deleteSubtaskAssignedUser(1);
    expect(result).toEqual({ message: 'Assigned user deleted successfully' });
    expect(db.query).toHaveBeenCalledWith( 'update Subtask set assignedUserId = null where subtaskId = ?' , [1]);
});

test('deleteSubtaskAssignedUser throws an error if no subtask found', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);
  
    await expect(Subtask.deleteSubtaskAssignedUser(1)).rejects.toThrow('Failed assigned user deletion');
    expect(db.query).toHaveBeenCalledWith("update Subtask set assignedUserId = null where subtaskId = ?", [1]);
  });

//getSubtasksWithin
test("should return subtasks within the specified days", async () => {
    const mockResult = [{ subtaskId: 1, deadline: "2025-01-15" }];
    db.query.mockResolvedValue([mockResult]);

    const result = await Subtask.getSubtasksWithin(7);
    expect(result).toEqual(mockResult);
    expect(db.query).toHaveBeenCalledWith("select * from Subtask where deadline between curdate() and curdate() + interval ? day", [7]);
});

test("should handle error when fetching subtasks within specified days", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    await expect(Subtask.getSubtasksWithin(7)).rejects.toThrow("Database error");
    expect(db.query).toHaveBeenCalledWith("select * from Subtask where deadline between curdate() and curdate() + interval ? day", [7]);
});

//updates
    const updates = [
      { method: 'updateSubtaskStatus', column: 'status', value: 'completed' },
      { method: 'updateSubtaskTitle', column: 'title', value: 'Updated Subtask Title' },
      { method: 'updateSubtaskDescription', column: 'description', value: 'Updated Description' },
      { method: 'updateSubtaskDeadline', column: 'deadline', value: '2025-01-31' },
    ];

    updates.forEach(({ method, column, value }) => {
      describe(method, () => {
        test(`should update ${column} successfully`, async () => {
          db.query.mockResolvedValue([{ affectedRows: 1 }]);

          const result = await Subtask[method](1, value); //(taskId, value)

          expect(result).toEqual({ message: `${column.charAt(0).toUpperCase() + column.slice(1)} updated successfully` });
          expect(db.query).toHaveBeenCalledWith(`update Subtask set ${column} = ? where subtaskId = ?`, [value, 1]);
        });

        test(`should throw an error if no subtask is found to update ${column}`, async () => {
          db.query.mockResolvedValue([{ affectedRows: 0 }]);

          await expect(Subtask[method](1, value)).rejects.toThrow('No subtask found to be updated');
          expect(db.query).toHaveBeenCalledWith(`update Subtask set ${column} = ? where subtaskId = ?`, [value, 1]);
        });

        test(`should throw an error when database query fails for updating ${column}`, async () => {
          db.query.mockRejectedValue(new Error('Database query failed'));

          await expect(Subtask[method](1, value)).rejects.toThrow('Database query failed');
          expect(db.query).toHaveBeenCalledWith(`update Subtask set ${column} = ? where subtaskId = ?`, [value, 1]);
        });
      });
    });

//updateSubtaskAssignedUser,
test(`should update assigned user successfully`, async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Subtask.updateSubtaskAssignedUser(subtaskId, username); //(taskId, value)

    expect(result).toEqual({ message: "Assigned user updated successfully" });
    expect(db.query).toHaveBeenCalledWith(`update Subtak st join User u on st.assignedUserid = u.userId
                set st.assignedUserId = (select userId from User where username = ?)
                where st.subtaskId = ? and u.username = ?`, [username, subtaskId, username]);
  });

  test('should throw an error if no rows are affected', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Subtask.updateSubtaskAssignedUser(subtaskId, username)).rejects.toThrow(
      'Failed assigned user updating'
    );

    expect(db.query).toHaveBeenCalledWith(
      `update Subtak st join User u on st.assignedUserid = u.userId
                set st.assignedUserId = (select userId from User where username = ?)
                where st.subtaskId = ? and u.username = ?`,
      [username, subtaskId, username]
    );
  });

  test('should throw an error when database query fails', async () => {
    const dbError = new Error('Database query failed');
    db.query.mockRejectedValue(dbError);

    await expect(Subtask.updateSubtaskAssignedUser(subtaskId, username)).rejects.toThrow(
      'Database query failed'
    );

    expect(db.query).toHaveBeenCalledWith(
      `update Subtak st join User u on st.assignedUserid = u.userId
                set st.assignedUserId = (select userId from User where username = ?)
                where st.subtaskId = ? and u.username = ?`,
      [username, subtaskId, username]
    );
  });

});