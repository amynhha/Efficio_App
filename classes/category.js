//This class is responsible for the Category data, including queries that have to do with cetegories.
import db from "./database";

class Category {
    constructor(categoryId, categoryName, colorCode) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.colorCode = colorCode;
    }

    //Getters and setters
    getcategoryId() { return this.categoryId; }
    getcategoryName() { return this.categoryName; }
    getcolorCode() { return this.colorCode; }

    setcategoryId(categoryId) { this.categoryId = categoryId; }
    setcategoryName(categoryName) { this.categoryName = categoryName; }
    setcolorCode(colorCode) { this.colorCode = colorCode; }

    toString() {
        return `Category:
        - Category ID: ${this.categoryId}
        - Category Name: ${this.categoryName}
        - Color Code: ${this.colorCode}`;
    }
}

async function addCategory(categoryData) {
    const {categoryName, colorCode} = categoryData;
    
    const query = "insert into Category(categoryName, colorCode) values (?, ?)";
    const values = [categoryName, colorCode];

    try {
        const [result] = await pool.query(query, values);
        return result.insertId
    } catch (error) {
        console.error("Error adding Category:", error);
        throw error;
    }
}

async function getAllCategories() {
    const query = "select * from Category";

    try {
        const [result] = await pool.query(query);
        if (result.length == 0) {
            throw new Error("No Category");
        }
        return result;
    } catch (error) {
        console.error("Error getting all Category", error);
        throw error;
    }
}

async function getCategoriesByID(categoryId) {
    const query = "select * from Category where categoryId = ?";
    const values = [categoryId];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("Category not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting Category by ID:", error);
        throw error;
    }
}

async function getCategoriesByUser(userId) {
    const query = "select * from Category where userId = ?";
    const values = [userId];

    try {
        const [result] = await pool.query(query, values);
        if (result.length == 0) {
            throw new Error("Category not found");
        }
        return result; //returning the user that is found in result set
    } catch (error) {
        console.error("Error getting Category by user ID:", error);
        throw error;
    }
}

async function deleteCategoryById(categoryId) {
    const query = "delete from Category where categoryId = ?";
    const values = [categoryId];

    try {
        const [result] = await pool.query(query, values);
        if (result.affectedRows == 0) {
            throw new Error("No Category with given ID is found to be deleted");
        }
        return {message: "Category is successfully deleted"};
    } catch (error) {
        console.error("Error deleting Category by ID:", error);
        throw error;
    }
}

async function updateCategoryName(categoryId, categoryName) {
    const query = "update Category set message = ? where categoryId = ?";
    const values = [categoryName, categoryId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No Category found to be updated");
        }
        return {message: "category name updated successfully"}; 
    } catch (error) {
        console.error("Error updating category name by categoryId:", error);
        throw new error;
    }
}

async function updateCategoryColor(categoryId, colorCode) {
    const query = "update Category set colorCode = ? where categoryId = ?";
    const values = [colorCode, categoryId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows == 0) {
            throw new Error("No Category found to be updated");
        }
        return {message: "color code updated successfully"}; 
    } catch (error) {
        console.error("Error updating color code by categoryId:", error);
        throw new error;
    }
}

export default {
    addCategory,
    getAllCategories,
    getCategoriesByID,
    getCategoriesByUser,
    deleteCategoryById,
    updateCategoryName,
    updateCategoryColor
};