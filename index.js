const fs = require('fs');
const http = require('http');
const { type } = require('os');
const { parse } = require('path');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
////////////////////////////////////////////////////
// FILES
// blocking syncronous code
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/input.txt', textOut);
// console.log('File has been written');

// non-blocking asynchronous code
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
// 	if (err) return console.log('Error 💥');
// 	fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
// 		console.log(data2);
// 		fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
// 			console.log(data3);

// 			fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
// 				console.log('Your file has been written');
// 			});
// 		});
// 	});
// });
// console.log('Will read file!');

////////////////////////////
// SERVER
let count = 0;
// Run Once

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

console.log(slugify('Fresh Avocado', { lower: true }));

// Always running
const server = http.createServer((req, res) => {
  // const pathname = req.url;
  const { query, pathname } = url.parse(req.url, true);
  // Overview page
  if (pathname === '/' || pathname == '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    let product = dataObj[query.id];
    let output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not found page
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
