import Category from '../src/category.js';
import { db } from '../src/database.js';
import { expect, vi } from 'vitest';

// Mock db
vi.mock('../src/database.js', () => ({
    db: {
        query: vi.fn(),
    },
}));

describe("Category Functions", () => {
    afterEach(() => {
        vi.clearAllMocks(); // Clear mocks after each test
    });

// addCategory
test('addCategory - successfully adds a Category', async () => {
    db.query.mockResolvedValue([{ insertId: 1 }]);

    const categoryData = {
        categoryName: 'category'
    };
    const result = await Category.addCategory(categoryData);
    expect(result).toBe(1);

    expect(db.query).toHaveBeenCalledWith(
        'insert into Category(categoryName, colorCode) values (?, ?)',
        [
            categoryData.categoryName,
            null
        ]
    );
});

// getAllCategories
test('getAllCategories - returns all category', async () => {
    db.query.mockResolvedValue([[{ CategoryId: 1}]]);

    const result = await Category.getAllCategories();
    expect(result).toEqual([{ CategoryId: 1 }]);

    expect(db.query).toHaveBeenCalledWith('select * from Category');
});

test('getAllCategories - throws error when no category exist', async () => {
    db.query.mockResolvedValue([[]]);

    await expect(Category.getAllCategories()).rejects.toThrow('No Category');
});

// getCategoriesByID
test('getCategoriesByID - retrieves a category by ID', async () => {
    db.query.mockResolvedValue([[{ categoryId: 1 }]]);

    const result = await Category.getCategoriesByID(1);
    expect(result).toEqual([{ categoryId: 1 }]);

    expect(db.query).toHaveBeenCalledWith(
        'select * from Category where categoryId = ?',
        [1]
    );
});

test('getCategoriesByID - throws error if category not found', async () => {
    db.query.mockResolvedValue([[]]);

    await expect(Category.getCategoriesByID(99)).rejects.toThrow('Category not found');
});
    
// getCategoriesByUser
test('getCategoriesByUser - retrieves category by user ID', async () => {
    db.query.mockResolvedValue([[{ categoryId: 1 }]]);

    const result = await Category.getCategoriesByUser(1);
    expect(result).toEqual([{ categoryId: 1 }]);

    expect(db.query).toHaveBeenCalledWith(
        'select * from Category where userId = ?',
        [1]
    );
});

test('getCategoriesByUser - throws error if no category are found', async () => {
    db.query.mockResolvedValue([[]]);

    await expect(Category.getCategoriesByUser(99)).rejects.toThrow('Category not found');
});

// deleteCategoryById
test('deleteCategoryById - successfully deletes a category', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Category.deleteCategoryById(1);
    expect(result).toEqual({ message: 'Category is successfully deleted' });

    expect(db.query).toHaveBeenCalledWith(
        'delete from Category where categoryId = ?',
        [1]
    );
});

test('deleteCategoryById - throws error if no category is found', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Category.deleteCategoryById(99)).rejects.toThrow(
        'No Category with given ID is found to be deleted'
    );
});

// updateCategoryName
test('updateCategoryName - successfully updates category categoryName', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Category.updateCategoryName(1, 'Updated categoryName');
    expect(result).toEqual({ message: 'category name updated successfully' });

    expect(db.query).toHaveBeenCalledWith(
        'update Category set categoryName = ? where categoryId = ?',
        ['Updated categoryName', 1]
    );
});

test('updateCategoryName - throws error if no category is found to update', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Category.updateCategoryName(99, 'new categoryName')).rejects.toThrow(
        'No Category found to be updated'
    );
});


// updateCategoryColor
test('updateCategoryColor - successfully updates category colorCode', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const result = await Category.updateCategoryColor(1, 'Updated colorCode');
    expect(result).toEqual({ message: 'color code updated successfully' });

    expect(db.query).toHaveBeenCalledWith(
        'update Category set colorCode = ? where categoryId = ?',
        ['Updated colorCode', 1]
    );
});

test('updateCategoryColor - throws error if no category is found to update', async () => {
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    await expect(Category.updateCategoryColor(99, 'new colorCode')).rejects.toThrow(
        'No Category found to be updated'
    );
});

});