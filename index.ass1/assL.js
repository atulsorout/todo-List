// Base constructor function: Product
function Product(name, price, quantity) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
  
  // Method for Product prototype
  Product.prototype.getDetails = function () {
    return `${this.name} - $${this.price} (Quantity: ${this.quantity})`;
  };
  
  // Specialized constructor function: Electronics
  function Electronics(name, price, quantity, brand, model) {
    Product.call(this, name, price, quantity); // Inherit properties from Product
    this.brand = brand;
    this.model = model;
  }
  
  // Set up inheritance for Electronics
  Electronics.prototype = Object.create(Product.prototype);
  Electronics.prototype.constructor = Electronics;
  
  // Methods specific to Electronics
  Electronics.prototype.powerOn = function () {
    console.log(`${this.name} is now ON.`);
  };
  
  Electronics.prototype.powerOff = function () {
    console.log(`${this.name} is now OFF.`);
  };
  
  // Specialized constructor function: Clothing
  function Clothing(name, price, quantity, size, material) {
    Product.call(this, name, price, quantity); // Inherit properties from Product
    this.size = size;
    this.material = material;
  }
  
  // Set up inheritance for Clothing
  Clothing.prototype = Object.create(Product.prototype);
  Clothing.prototype.constructor = Clothing;
  
  // Method specific to Clothing
  Clothing.prototype.getClothingInfo = function () {
    return `Size: ${this.size}, Material: ${this.material}`;
  };
  
  // Specialized constructor function: Books
  function Books(name, price, quantity, author, genre) {
    Product.call(this, name, price, quantity); // Inherit properties from Product
    this.author = author;
    this.genre = genre;
  }
  
  // Set up inheritance for Books
  Books.prototype = Object.create(Product.prototype);
  Books.prototype.constructor = Books;
  
  // Method specific to Books
  Books.prototype.getBookInfo = function () {
    return `Author: ${this.author}, Genre: ${this.genre}`;
  };
  
  // Test the system
  // Create instances of each product type
  const laptop = new Electronics("Laptop", 1000, 5, "Dell", "Inspiron 15");
  const shirt = new Clothing("T-Shirt", 20, 50, "M", "Cotton");
  const novel = new Books("The Great Gatsby", 15, 10, "F. Scott Fitzgerald", "Fiction");
  
  // Call common and specific methods
  console.log(laptop.getDetails()); // Common method from Product
  laptop.powerOn(); // Specific to Electronics
  console.log(shirt.getDetails()); // Common method from Product
  console.log(shirt.getClothingInfo()); // Specific to Clothing
  console.log(novel.getDetails()); // Common method from Product
  console.log(novel.getBookInfo()); // Specific to Books
  