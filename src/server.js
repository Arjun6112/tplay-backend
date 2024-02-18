import cluster from 'cluster';
import os from 'os';
import app from './app.js';
import dotenv from 'dotenv';
import db from './database/db.js';
import { Queries } from './database/queries.js';

dotenv.config();

//function startServer() {
//  const numCPUs = os.cpus().length;
//
//  if (cluster.isPrimary) {
//    console.log(`\n> Total CPU Cores: ${numCPUs}`)
//    console.log(`> Master ${process.pid} is running`);
//
//    // Fork workers for each CPU core
//    for (let i = 0; i < numCPUs; i++) {
//      cluster.fork();
//    }
//
//    // Listen for dying workers
//    cluster.on('exit', (worker, code, signal) => {
//      console.log(`\n> Worker ${worker.process.pid} died`);
//      // Replace the dead worker
//      cluster.fork();
//    });
//  } else {
//    const PORT = process.env.PORT || 3000;
//    app.listen(PORT, () => {
//      console.log(`> Worker ${process.pid} started and listening on http://localhost:${PORT}`);
//    });
//  }
//};

function startServer() {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`> Worker ${process.pid} started and listening on http://localhost:${PORT}`);
  });
}

// let retryCount = 5;
// while (retryCount) {
//   try {
//     const client = await db.connect();
//     if (client) {
//       console.log("> Database Connected");
//       await Queries.createUserTable();
//       await Queries.createChannelTable();
//       await Queries.createLinkTable();
//
//       startServer();
//     }
//     break;
//   } catch (error) {
//     console.log(error);
//     console.log(`Retrying to connect with database... ${retryCount}`);
//     retryCount--;
//     await new Promise((res) => setTimeout(res, 5000));
//   }
// }

startServer();