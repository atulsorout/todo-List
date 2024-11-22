// books.js
const Book = require('./Book');

// Create an array of Book instances
const books = [
  new Book("To Kill a Mockingbird", "Harper Lee", 1960),
  new Book("1984", "George Orwell", 1949),
  new Book("The Great Gatsby", "F. Scott Fitzgerald", 1925),
  new Book("Pride and Prejudice", "Jane Austen", 1813)
];

// Export the array of books
module.exports = books;
