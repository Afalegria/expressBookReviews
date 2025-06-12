const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn])
    }
    else {
        return res.status(404).json({message: "Book not found"});
    }
 });
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const requestedAuthor = req.params.author.toLowerCase();
    let booksByAuthor = [];
  
    // Iterate directly over the keys of the books object
    for (const key in books) {
      // Ensure the key is a direct property of the object
      if (books.hasOwnProperty(key)) {
        const book = books[key];
        // Perform a case-insensitive comparison
        if (book.author.toLowerCase() === requestedAuthor) {
          booksByAuthor.push(book);
        }
      }
    }

    if (booksByAuthor.length > 0) {
      // Send the list of found books
      return res.json(booksByAuthor);
    } else {
      // If no books are found, return a 404 error
      return res.status(404).json({message: "No books found by this author"});
    }
  });


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const requestedTitle = req.params.title.toLowerCase();
    let booksByTitle = [];

    // Iterate directly over the keys of the books object
    for (const key in books) {
        // Ensure the key is a direct property of the object
        if (books.hasOwnProperty(key)) {
            const book = books[key];
            // Perform a case-insensitive comparison for the title
            if (book.title.toLowerCase() === requestedTitle) {
                booksByTitle.push(book);
            }
        }
    }

    if (booksByTitle.length > 0) {
        // Send the list of found books
        return res.json(booksByTitle);
    } else {
        // If no books are found, return a 404 error
        return res.status(404).json({ message: "No books found with this title" });
    }
  });


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});


module.exports.general = public_users;
