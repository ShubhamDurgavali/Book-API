require("dotenv").config();

const express = require("express");
const { get } = require("http");
const mongoose = require("mongoose");

var bodyParser = require("body-parser");

// Database
const database = require("./database/database");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Initialize express

const booky = express();

booky.use(bodyParser.urlencoded({ extended: true }));
booky.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("Connection has been established"));

/*
Route       /
Description         Get all the books
Acsess              Public
Parameter           None
Method              GET
*/

booky.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route               /is/:isbn
Description         Get a speicific book on isbn
Acsess              Public
Parameter           isbn
Method              GET
*/

booky.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the isbn of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route               /c
Description         Get a speicific book on category
Acsess              Public
Parameter           category
Method              GET
*/

booky.get("/c/:category", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({
    category: req.params.category,
  });

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route               /l
Description         Get a speicific book on languages
Acsess              Public
Parameter           languages
Method              GET
*/

booky.get("/l/:language", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({
    language: req.params.language,
  });

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the language ${req.params.language}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route               /author
Description         Get all authors
Acsess              Public
Parameter           NONE
Method              GET
*/

booky.get("/authors", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});

/*
Route               /author
Description         Get a specific author (based on id)
Acsess              Public
Parameter           id
Method              GET
*/

booky.get("/authors/:id", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({ id: req.params.id });

  if (!getSpecificAuthor) {
    return res.json({ error: ` No author found for id ${req.params.id}` });
  }

  return res.json({ authors: getSpecificAuthor });
});

/*
Route               /author/book
Description         Get all authors based on books
Acsess              Public
Parameter           isbn
Method              GET
*/

booky.get("/authors/book/:isbn", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.find(req.params.isbn);

  if (!getSpecificAuthor) {
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthor });
});

/*
Route               /publication
Description         Get all publication
Acsess              Public
Parameter           NONe
Method              GET
*/

booky.get("/publications", async (req, res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
});

/*
Route               /publication
Description         Get a specific publication (based on id)
Acsess              Public
Parameter           id
Method              GET
*/

booky.get("/publication/:id", async (req, res) => {
  const getSpecificPub = await PublicationModel.findOne({ id: req.params.id });

  if (!getSpecificPub) {
    return res.json({
      error: ` No publication found for the id ${req.params.id}`,
    });
  }

  return res.json({ publications: getSpecificPub });
});

/*
Route               /publication/book
Description         Get a specific publication (based on book)
Acsess              Public
Parameter           isbn
Method              GET
*/

booky.get("/publication/book/:isbn", async (req, res) => {
  const getSpecificPub = await PublicationModel.findOne({
    publications: req.params.isbn,
  });

  if (!getSpecificPub) {
    return res.json({
      error: `No publication found for the book of isbn ${req.params.isbn}`,
    });
  }

  return res.json({ publications: getSpecificPub });
});

/*
Route               /book/new
Description         Get a specific publication (based on book)
Acsess              Public
Parameter           NONE
Method              POST
*/

booky.post("/book/new", async (req, res) => {
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message: "Book was added!!",
  });
});

/*
Route               /author/new
Description         Add new authors
Acsess              Public
Parameter           NONE
Method              POST
*/

booky.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;
  const addNewAuthor = AuthorModel.create(newAuthor);
  return res.json({
    authors: addNewAuthor,
    message: "Author was added!!",
  });
});

/*
Route               /publication/new
Description         Add new publications
Acsess              Public
Parameter           NONE
Method              POST
*/

booky.post("/publication/new", (req, res) => {
  const { newPublication } = req.body;
  const addNewPublication = PublicationModel.create(newPublication);
  return res.json({
    publications: addNewPublication,
    message: "Publication was added",
  });
});

/*****PUT **********/

/*
Route            /book/update
Description      Update book on isbn
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

booky.put("/book/update/:isbn", async (req, res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.bookTitle,
    },
    {
      new: true,
    }
  );

  return res.json({
    books: updatedBook,
  });
});

/*****Updating New Author**********/
/*
Route            /book/author/update
Description      Update /add new author
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

booky.put("/book/author/update/:isbn", async (req, res) => {
  // update database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        authors: req.body.newAuthor,
      },
    },
    {
      new: true,
    }
  );

  // update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );

  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
    message: "Author updated",
  });
});

/*
Route            /publication/update/book
Description      Update /add new publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
  //Update the publication database
  database.publication.forEach((pub) => {
    if (pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publication,
    message: "Successfully updated publications",
  });
});

/****DELETE*****/
/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

booky.delete("/book/delete/:isbn", async (req, res) => {
  //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
  //and rest will be filtered out
  const updatedBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  return res.json({
    books: updatedBookDatabase,
  });
});

/*
Route            /book/delete/author
Description      Delete an author from a book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  //Update the book database

  const updatedBook = await  BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: {
        authors: parseInt(req.params.authorId)
      },
    },
      {
        new: true
      }
  )

  //Update the author database
  database.author.forEach((eachAuthor) => {
    if (eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!!",
  });
});

booky.listen(4000, () => {
  console.log("server is running on port 4000");
});
