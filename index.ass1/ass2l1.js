// Book Constructor
function Book(title, author, isAvailable = true) {
  this.title = title;
  this.author = author;
  this.isAvailable = isAvailable;
}

// Member Constructor
function Member(name) {
  this.name = name;
  this.borrowedBooks = [];
}

// Borrow Book Method for Member
Member.prototype.borrowBook = function (book) {
  if (this.borrowedBooks.length >= 3) {
    console.log(`${this.name} cannot borrow more than 3 books at a time.`);
    return;
  }

  if (book.isAvailable) {
    book.isAvailable = false;
    this.borrowedBooks.push(book.title);
    console.log(`${this.name} borrowed "${book.title}".`);
  } else {
    console.log(`"${book.title}" is already borrowed.`);
  }
};

// Premium Member Constructor
function PremiumMember(name) {
  Member.call(this, name); // Inherit Member properties
  this.specialCollectionAccess = true;
}

// Inherit Member prototype
PremiumMember.prototype = Object.create(Member.prototype);
PremiumMember.prototype.constructor = PremiumMember;

// Override Borrow Book Method for Premium Member
PremiumMember.prototype.borrowBook = function (book) {
  if (this.borrowedBooks.length >= 5) {
    console.log(`${this.name} cannot borrow more than 5 books at a time.`);
    return;
  }

  // Use Member's borrowBook method to handle borrowing logic
  Member.prototype.borrowBook.call(this, book);
};

// Example Usage
const book1 = new Book("The Great Gatsby", "F. Scott Fitzgerald");
const book2 = new Book("1984", "George Orwell");
const book3 = new Book("To Kill a Mockingbird", "Harper Lee");
const book4 = new Book("The Catcher in the Rye", "J.D. Salinger");

const member = new Member("Atul");
const premiumMember = new PremiumMember("Kritika");

// Regular member borrowing books
member.borrowBook(book1); // Atul borrowed "The Great Gatsby".
member.borrowBook(book2); // Atul borrowed "1984".
member.borrowBook(book3); // Atul borrowed "To Kill a Mockingbird".
member.borrowBook(book4); // Atul cannot borrow more than 3 books at a time.

// Premium member borrowing books
premiumMember.borrowBook(book1); // "The Great Gatsby" is already borrowed.
premiumMember.borrowBook(book2); // Kritika borrowed "1984".
premiumMember.borrowBook(book3); // Kritika borrowed "To Kill a Mockingbird".
premiumMember.borrowBook(book4); // Kritika borrowed "The Catcher in the Rye".
