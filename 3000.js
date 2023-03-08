const http = require('http');
const url = require('url');
const querystring = require('querystring');

const port = process.env.PORT || 3000;

const routes = {
  '/': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello, World! ${port}`);
  },
  '/user': (req, res) => {
    const uid = req.params.uid;
    console.log(`req.params.uid::`, req.params.uid)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end( (+uid === 1) ? `User VIP 1: ${uid} ::port ${port}` : `User VIP 2: ${uid} :: port ${port}` );
  },
  '404': (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
};

// Define middleware to extract query parameters
const extractParamsMiddleware = (req, res, next) => {
  const { pathname, query } = url.parse(req.url);
  req.params = querystring.parse(query);

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  next();
};

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  const route = routes[pathname] || routes['404'];

  extractParamsMiddleware(req, res, () => {
    route(req, res);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
