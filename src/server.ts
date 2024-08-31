import cluster from 'cluster';
import os from 'os';
import { AppDataSource } from './data-source';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Optionally, you can fork a new worker here
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  import('./app').then(({ default: app }) => {
    const { PORT = 8080 } = process.env;
    app.listen(PORT, () => {
      console.log(`Worker ${process.pid} started`);
    });
  });
}