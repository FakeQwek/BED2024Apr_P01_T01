const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Book {
    constructor(book_id, title, author, availability) {
        this.book_id = book_id;
        this.title = title;
        this.author = author;
        this.availability = availability;
    }

    static async getAllBooks() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Books`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Book(row.book_id, row.title, row.author, row.availability));
    }

    static async updateBookAvailability(book_id, availability) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Books SET availability = @availability WHERE book_id = @book_id`;

        const request = connection.request();
        request.input("availability", availability);
        request.input("book_id", book_id);
        const result = await request.query(sqlQuery);

        connection.close();
    }
}

module.exports = Book;
