require('dotenv').config() 
//aws
const config = require('./config.json');

//google
const {Storage} = require('@google-cloud/storage');


const express = require('express')
const app = express()
const mongoose = require('mongoose')


const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))



const { exec } = require('child_process');
exec('mongoexport --collection=items --db=items --out=E:\Items.json', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
const storage = new Storage();
//   # Compress for faster load
//   gzip sample.json
  
//   # Move to GCloud
//   gsutil mv ./sample.json.gz gs://your-bucket/sample/sample.json.gz

// exec('gzip E:\Items.csv', (err, stdout, stderr) => {
//     if (err) {
//       // node couldn't execute the command
//       return;
//     }
  
//     // the *entire* stdout and stderr (buffered)
//     console.log(`stdout: ${stdout}`);
//     console.log(`stderr: ${stderr}`);
//   });

  exec('gsutil mv E:\Items.csv gs://items_buck/Items.csv', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
 
app.use(express.json())

const itemsRouter = require('./routes/item')
app.use('/items', itemsRouter)

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
app.listen(port, () => console.log("Server listening on port " + port))

