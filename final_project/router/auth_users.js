const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username": "Antonio", "password": "AntonioPassword"}];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{
    // Find a user that has a matching username and password
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    // If one or more users are found, the credentials are valid
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
  
    // Check if username and password were provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required."});
    }
  
    // Check if the user is authenticated
    if (authenticatedUser(username, password)) {
      // Create a JWT access token
      let accessToken = jwt.sign({
          data: username // The payload for the token
      }, 'fingerprint_customer', { expiresIn: 60 * 60 }); // Token expires in 1 hour
  
      // Save the user credentials for the session
      req.session.authorization = {
          accessToken
      }
      return res.status(200).json({message: "User successfully logged in."});
    } else {
      // If authentication fails, send an error message
      return res.status(401).json({message: "Invalid login. Check username and password."});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Get ISBN from the request parameters
    const isbn = req.params.isbn;
    // Get the review text from the request query
    const reviewText = req.query.review;
    // Get the username from the session's JWT
    const username = req.user.data;
  
    // Check if the review text is provided
    if (!reviewText) {
      return res.status(400).json({ message: "Review text is required." });
    }
  
    // Check if the book with the given ISBN exists
    if (books[isbn]) {
      // Access the specific book
      let book = books[isbn];
      // Add or update the review using the username as the key
      book.reviews[username] = reviewText;
      
      // Send a success response
      return res.status(200).json({ 
          message: "Review successfully added/updated.",
          reviews: book.reviews
      });
    } else {
      // If the book is not found, send a 404 error
      return res.status(404).json({ message: "Book not found." });
    }
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Get ISBN from the request parameters
    const isbn = req.params.isbn;
    // Get the username from the session's JWT
    const username = req.user.data;

    // Check if the book with the given ISBN exists
    if (books[isbn]) {
        let book = books[isbn];
        // Check if a review from this user exists for this book
        if (book.reviews[username]) {
            // Delete the user's review
            delete book.reviews[username];
            // Send a success response
            return res.status(200).json({ 
                message: "Review successfully deleted.",
                reviews: book.reviews
            });
        } else {
            // If no review from the user is found, send an error
            return res.status(404).json({ message: "Review not found for this user." });
        }
    } else {
        // If the book is not found, send a 404 error
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
