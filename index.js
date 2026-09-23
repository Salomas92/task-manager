const http = require('node:http');

const tasksList = [
  {id: 1, task: 'Study English', status: 'Pending'},
  {id: 2, task: 'Study Node.js', status: 'Completed'},
  {id: 3, task: 'Go at the Gym', status: 'Pending'}
];

const server = http.createServer((req, res) => {

  const cleaningPath = new URL(req.url, 'http://localhost:3000');
  const urlPath = cleaningPath.pathname;
  const getQueryParams = new URLSearchParams('status');

  const getMethodAndPath = (methods, path) => {
    return req.method === methods && urlPath === path
  }

  if(getMethodAndPath('GET', '/tasks')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({tasksList}))
  }else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({message: 'Page Not Found'}))
  }

});

server.listen(3000, () => {
  console.log('Server running port 3000');
});