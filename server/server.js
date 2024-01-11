const express = require("express");
const app = express();
const port = 5500;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./myDatabase.db");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    publicationYear INTEGER NOT NULL,
    color TEXT 
);`, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Books table created.");
});

app.get("/books", (req, res) => {
    console.log("Request received for /books");

    db.all("SELECT * FROM books", (err, rows) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).send(err.message);
      }
  
      console.log("Books retrieved from the database:", rows);
      res.send(rows);
    });
});

app.get("/books/:id", (req, res) => {
    console.log(`Request received for /books/${req.params.id}`);

    db.get("SELECT * FROM books WHERE id = ?", req.params.id, (err, row) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).send(err.message);
      }
  
      console.log(`Book retrieved from the database:`, row);
      res.send(row);
    });
});

app.post("/books", (req, res) => {
    console.log("Request received for /books");

    db.run("INSERT INTO books (title, author, genre, publicationYear, color) VALUES (?, ?, ?, ?, ?)", [req.body.title, req.body.author, req.body.genre, req.body.year, req.body.color], function(err) { 
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).send(err.message);
      }
  
      console.log(`Book created in the database with id: ${this.lastID}`);
      res.send({ id: this.lastID, ...req.body });
    });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id; 
  const { id, title, author, genre, year, color } = req.body;

  if (bookId !== id) {
    return res.status(400).send('Mismatched book id in URL and request body.');
  }

  db.run(
    "UPDATE books SET title = ?, author = ?, genre = ?, publicationYear = ?, color = ? WHERE id = ?",
    [id, title, author, genre, year, color],
    function (err) {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).send(err.message);
      }

      console.log(`Book updated in the database with id: ${id}`);
      res.send({ id, title, author, genre, year, color });
    }
  );
});


app.delete("/books/:id", (req, res) => {
    console.log(`Request received for /books/${req.params.id}`);

    db.run("DELETE FROM books WHERE id = ?", req.params.id, function(err) {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).send(err.message);
      }
  
      console.log(`Book deleted from the database with id: ${req.params.id}`);
      res.send({ id: req.params.id });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
