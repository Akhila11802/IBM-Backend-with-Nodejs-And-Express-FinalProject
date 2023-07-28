const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}
//only registered users can login

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});

// Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   const isbn = req.params.isbn;
//   if (books.hasOwnProperty(isbn)) {
//     const book = books[isbn];
//     if (book.length > 0) {
//       let filtered_book = book[0];
//       let review = req.query.review;
//       //if the DOB has changed
//       if(review) {
//           filtered_book.reviews = review;
//       }
//       /*
//       Include code here similar to the one above for other attibutes
//       */
    
//     }
    
//   } else {
//     return res.status(404).json({ error: 'Book not found' });
//   }
  
//   }

// );

// Add a book review
// regd_users.put("/auth/review/:isbn", async (req, res) => {
//   try {
//     const isbn = req.params.isbn;
//     if (books.hasOwnProperty(isbn)) {
//       const book = books[isbn];
//       if (book.length > 0) {
//         let filtered_book = book;
//         let review = req.query.review;
//         // If the review has changed
//         if (review) {
//           filtered_book.reviews = review;
//         }
//         /*
//         Include code here similar to the one above for other attributes
//         */

//         // Remove the existing book entry and add the updated one
//         books = books.filter((b) => b.isbn != isbn);
//         books.push(filtered_book);
//         res.send(`User with the isbn  ${isbn} updated.`);
//       } else {
//         return res.status(404).json({ error: 'Book not found' });
//       }
//     } else {
//       return res.status(404).json({ error: 'Book not found' });
//     }
//   } catch (err) {
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// //  http://localhost:5000/customer/auth/review/2?review=It was a good book 

// });
// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book) {
        let filtered_book = book;
        let review = req.query.review;
        // If the review has changed
        if (review) {
          filtered_book.reviews = review;
        }
        /*
        Include code here similar to the one above for other attributes
        */

        // Update the existing book entry with the updated review
        books[isbn] = filtered_book;
        res.send(`Book with ISBN ${isbn} updated.`);
      } else {
        return res.status(404).json({ error: 'Book not found' });
      }
    } else {
      return res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  // http://localhost:5000/customer/auth/review/2?review=It was a great book
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book) {
        // Check if the book has a review
        if (book.reviews) {
          // Delete the review from the book
          delete book.reviews;
          res.send(`Review for book with ISBN ${isbn} deleted.`);
        } else {
          // The book does not have a review to delete
          return res.status(404).json({ error: 'Book review not found' });
        }
      } else {
        return res.status(404).json({ error: 'Book not found' });
      }
    } else {
      return res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
