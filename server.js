const http = require("http");
const fs = require("fs/promises");

const server = http.createServer((request, response) => {
  const { method, url } = request;
  //TASK 1
  if (method === "GET" && url === "/api") {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;
    response.write(JSON.stringify({ message: "Hello!" }));
    response.end();
  }
  //TASK 2
  if (method === "GET" && url === "/api/books") {
    fs.readFile("./data/books.json", "utf8").then((books) => {
      const bookJS = JSON.parse(books);
      const bookResponse = { bookJS };
      response.setHeader("Content-Type", "application/json");
      response.statusCode = 200;
      response.write(JSON.stringify(bookResponse));
      response.end();
    });
  }
  //TASK 3
  if (method === "GET" && url === "/api/authors") {
    fs.readFile("./data/authors.json", "utf8").then((authors) => {
      const authorsJS = JSON.parse(authors);
      const authorResponse = { authorsJS };
      response.setHeader("Content-Type", "application/json");
      response.statusCode = 200;
      response.write(JSON.stringify(authorResponse));
      response.end();
    });
  }
  //TASK 4
  if (method === "GET" && /\/api\/books\/\d+$/.test(url)) {
    fs.readFile("./data/books.json", "utf8").then((books) => {
      const booksJS = JSON.parse(books);

      const lastDigit = url.split("/")[3];
      const filteredBooks = booksJS.filter((book) => {
        return book.bookId === +lastDigit;
      });
      const bookResponse = filteredBooks;
      response.setHeader("Content-Type", "application/json");
      response.statusCode = 200;
      response.write(JSON.stringify(bookResponse));
      response.end();
    });
  }

  //TASK 5
  // Request body is in JSON format
  /* {
  	"bookTitle": "title",
  	"authorId": 3,
  	"isFiction": true,
  	"bookId": 17
  }
  */

  if (method === "POST" && url === "/api/books") {
    let body = "";
    request.on("data", (packet) => {
      body += packet.toString();
    });
    request.on("end", () => {
      const parsedBody = JSON.parse(body);
      fs.readFile("./data/books.json", "utf8")
        .then((books) => {
          const booksJS = JSON.parse(books);
          const highestSoFar = booksJS.length;
          parsedBody.bookId = highestSoFar + 1;
          booksJS.push(parsedBody);
          return fs.writeFile(
            "./data/books.json",
            JSON.stringify(booksJS, null, 2)
          );
        })
        .then(() => {
          response.setHeader("Content-Type", "application/json");
          response.statusCode = 201;
          response.write(JSON.stringify(parsedBody));
          response.end();
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    });
  }

  //TASK 6
  if (method === "GET" && /\/api\/books\/\d+\/author$/.test(url)) {
    const bookDigit = url.split("/")[3];
    let authorId;
    fs.readFile("./data/books.json", "utf8")
      .then((books) => {
        const booksJS = JSON.parse(books);
        const filteredBooks = booksJS.filter((book) => {
          return book.bookId === +bookDigit;
        });
        authorId = filteredBooks[0].authorId;
        return fs.readFile("./data/authors.json", "utf8");
      })
      .then((authors) => {
        const parsedAuthor = JSON.parse(authors);
        const filteredAuthors = parsedAuthor.filter((author) => {
          return author.authorId === authorId;
        });
        const authorResponse = { author: filteredAuthors[0] };
        response.setHeader("Content-Type", "application/json");
        response.statusCode = 200;
        response.write(JSON.stringify(authorResponse));
        response.end();
      });
  }

  //TASK 8 same as
  //   if (/^\/api\/books\?fiction=(true|false)$/.test(url)) {
  //     console.log("yup");
  //   } else {
  //     console.log("nope");
  //   }
});

server.listen(8080, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listneing on port 8080");
  }
});
