import express from 'express';
import { morganMiddleware } from './middlewares/morgan.js';
import { loggers } from './Javascript/LogConfig.js'
import path, {dirname} from 'path';

export function startServer() {
  const app = express();
  const port = 3000;
  let __dirname = dirname("./")
  app.use(morganMiddleware)
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  //Respond to POST request on the root route (/), the application’s home page:

  app.post('/', (req, res) => {
    res.send('Got a POST request')
  })
  //Respond to a PUT request to the /user route:

  app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user')
  })
  //Respond to a DELETE request to the /user route:

  app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user')
  })

  app.get("/api/status", (req, res) => {
    loggers.logger.info("Checking the API status: Everything is OK");
    res.status(200).send({
      status: "UP",
      message: "The API is up and running!"
    })
  });

  app.get('/file/:name', function (req, res, next) {
    let options = {
      root: path.join(__dirname, 'Logs', 'tfblade'),
      dotFiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }

    let fileName = req.params.name
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err)
      } else {
        console.log('Sent:', fileName)
      }
    })
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
