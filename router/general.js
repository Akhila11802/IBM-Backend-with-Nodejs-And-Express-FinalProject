const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop using async await
public_users.get('/', async (req, res) => {
  try {


    await new Promise((resolve) => setTimeout(resolve, 100));

    // Send the books data as the response
    res.send(books);
  } catch (err) {
    res.status(500).json(err);
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    await new Promise((resolve) => setTimeout(resolve, 100));

  
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;

  
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Filter books based on the author
    const booksByAuthor = Object.values(books).filter((book) => book.author === author);

    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ error: 'No books found for the given author' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;

  
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Filter books based on the title
    const booksByTitle = Object.values(books).filter((book) => book.title === title);

    if (booksByTitle.length > 0) {
      res.json(booksByTitle);
    } else {
      res.status(404).json({ error: 'No books found for the given title' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    return res.json(book.reviews);
  } else {
    return res.status(404).json({ error: 'Book not found' });
  }
});

module.exports.general = public_users;
