// Book.js
class Book {
    constructor(title, author, year) {
      this.title = title;
      this.author = author;
      this.year = year;
    }
  
    // Prototype method to get the summary of a book
    getSummary() {
      return `${this.title} by ${this.author}, published in ${this.year}`;
    }
  }
  
  module.exports = Book;
  