import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  import('./app').then(({ default: app }) => {
    const { PORT = 8080, DB_NAME } = process.env;
    app.listen(PORT, () => {
      console.log(
        `Worker ${process.pid} started on port ${PORT} and connected to ${DB_NAME}`
      );
    });
  });
}
