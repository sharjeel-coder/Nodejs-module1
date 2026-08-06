const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
// this above is the built-in module.and that how the fs module is imported

//
// //Synchronous way of doing file reading
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// const textOut = `This is what we know about the avacado: ${textIn}.\n Created on ${Date.now()}`;
// // writing to the file this will not returns anything useful thats why we did not store it into a variable.
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("file has been written");

// //Asychronous way of doing file reading
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   console.log(data1);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("file has been written");
//       });
//     });
//   });
// });

//instead of doing the file read again and again we read at once and store when the program starts and save it to data

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8",
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8",
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8",
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
// server
const server = http.createServer((req, res) => {
  //es6 desturuting
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-Type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }

  //products page
  else if (pathname === "/product") {
    res.writeHead(200, { "content-Type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  }
  //api page
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server is listening");
});
