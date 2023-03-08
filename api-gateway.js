const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Define API routes and corresponding backend services
const routes = {
  '/hello': 'http://localhost:4000',
};

// Create proxy middleware
const proxy = createProxyMiddleware({
  changeOrigin: true,
  xfwd: true,
  router: (req) => {
    // Select backend server based on the requested route
    const route = Object.keys(routes).find(r => req.url.startsWith(r));
    if (route) {
      return routes[route];
    }
    return null;
  },
});

// Create API gateway server
const server = http.createServer((req, res) => {
  proxy(req, res);
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`API gateway running on port ${port}`);
});
