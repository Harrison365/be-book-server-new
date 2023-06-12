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
    //find book wih that id using read file
    //then use the author name to read author file toget their data
    //write this response.
  }
});

server.listen(8080, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listneing on port 8080");
  }
});
