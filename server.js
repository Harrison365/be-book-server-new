const http = require("http");
const fs = require("fs/promises");

const server = http.createServer((request, response) => {
  const { method, url } = request;

  if (method === "GET" && url === "/api") {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;
    response.write(JSON.stringify({ message: "Hello!" }));
    response.end();
  }
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
});
server.listen(8080, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listneing on port 8080");
  }
});
