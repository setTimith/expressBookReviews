const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error("No books found"));
    }
  });
};

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  getAllBooks()
    .then((allBooks) => {
      res.send(JSON.stringify(allBooks, null, 4));
    })
    .catch((error) => {
      res.status(404).send({ error: error.message });
    });
});

const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });
};

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  getBookByISBN(isbn)
    .then((book) => {
      res.send(book);
    })
    .catch((error) => {
      res.status(404).send({ error: error.message });
    });
});

const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    let foundBooks = [];

    for (let key in books) {
      if (books[key].author === author) {
        foundBooks.push(books[key]);
      }
    }

    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      reject(new Error("Author not found"));
    }
  });
};

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;

  getBooksByAuthor(author)
    .then((foundBooks) => {
      res.json(foundBooks);
    })
    .catch((error) => {
      res.status(404).send({ error: error.message });
    });
});

// Get all books based on title

const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    let foundBooks = [];

    for (let key in books) {
      if (books[key].title === title) {
        foundBooks.push(books[key]);
      }
    }

    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      reject(new Error("Title not found"));
    }
  });
};

public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;

  getBooksByTitle(title)
    .then((foundBooks) => {
      res.json(foundBooks);
    })
    .catch((error) => {
      res.status(404).send({ error: error.message });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
