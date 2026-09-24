const http = require('node:http');

const tasksList = [
  {id: 1, task: 'Study English', status: 'Pending'},
  {id: 2, task: 'Study Node.js', status: 'Completed'},
  {id: 3, task: 'Go at the Gym', status: 'Pending'}
];

const readRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    const peaces = [];

    req.on('data', (chunks) => {
      peaces.push(chunks);
    });

    req.on('end', () => {
      const fullBody = Buffer.concat(peaces).toString();
      resolve(fullBody)
    });
    
    req.on('error', (error) => {
      reject(error)
    })

  });
}

const server = http.createServer( async (req, res) => {

  const cleaningPath = new URL(req.url, 'http://localhost:3000');
  const urlPath = cleaningPath.pathname;
  const getQueryParams = cleaningPath.searchParams.get('status');

  const getMethodAndPath = (methods, path) => {
    return req.method === methods && urlPath === path
  }

  if (getMethodAndPath('POST', '/tasks')) {
    try {

      const bodyRequest = await readRequestBody(req);

      const data = JSON.parse(bodyRequest);
      const title = data.task;
      const id = tasksList.length +1

      const newTask = {
        id,
        task: title,
        status: 'Completed'
      }

      tasksList.push(newTask);

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(newTask));

    } catch (error) {

      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ erro: 'Erro ao processar dados' }));

    }
    return;
  }

  if(getMethodAndPath('GET', '/tasks')) {

    const getFilterList = tasksList.filter(tasks => tasks.status === getQueryParams);

    if (getQueryParams) {
      res.statusCode === 200
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({lista: getFilterList}));
    }

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