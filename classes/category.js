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

