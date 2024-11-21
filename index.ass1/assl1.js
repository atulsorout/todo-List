// Base constructor function: Person
function Person(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // Method for Person prototype
  Person.prototype.introduce = function () {
    console.log(`Hi, my name is ${this.name} and I am ${this.age} years old.`);
  };
  
  // Specialized constructor function: Employee
  function Employee(name, age, jobTitle) {
    Person.call(this, name, age); // Call the Person constructor
    this.jobTitle = jobTitle;
  }
  
  // Set up inheritance for Employee
  Employee.prototype = Object.create(Person.prototype);
  Employee.prototype.constructor = Employee;
  
  // Method for Employee prototype
  Employee.prototype.work = function () {
    console.log(`${this.name} is working as a ${this.jobTitle}.`);
  };
  
  // Demonstration
  // 1. Create an instance of Person
  const person1 = new Person("Alice", 30);
  
  // 2. Create an instance of Employee
  const employee1 = new Employee("Bob", 40, "Software Developer");
  
  // 3. Call introduce on both instances
  person1.introduce(); // Output: Hi, my name is Alice and I am 30 years old.
  employee1.introduce(); // Output: Hi, my name is Bob and I am 40 years old.
  
  // 4. Call work on the Employee instance
  employee1.work(); // Output: Bob is working as a Software Developer.
  