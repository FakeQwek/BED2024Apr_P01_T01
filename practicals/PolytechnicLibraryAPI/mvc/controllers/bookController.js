const Book = require("../models/book");

const getAllBooks = async (req, res) => {
    try {
        const books = await Volunteer.getAllBooks();
        res.json(books);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving books")
    }
};

const updateBookAvailability = async (req, res) => {
    const availability = req.params.availability;
    const book_id = parseInt(req.params.book_id);
    try {
        const updatedBook = await Book.updateBookAvailability(book_id, availability);
        if (!updatedBook) {
            return res.status(404).send("Book not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating book")
    }
}

module.exports = {
    getAllBooks,
    updateBookAvailability,
}