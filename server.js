require("dotenv").config();
//aws
const config = require("./config.json");
const Bq = require('./models/bq')


//google
const { google } = require('googleapis');
const { Storage } = require("@google-cloud/storage");
const { BigQuery } = require("@google-cloud/bigquery");
const { PubSub } = require('@google-cloud/pubsub');
const { TemplatesServiceClient } = require('@google-cloud/dataflow');
const dataflow = google.dataflow('v1b3');

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router();

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.connect(
  process.env.DATABASE_URL || config.connectionString,
  connectionOptions,
  process.env.DATABASE_URL1 || config.connectionString,
  connectionOptions,
  process.env.DATABASE_URL2 || config.connectionString,
  connectionOptions,
  process.env.DATABASE_URL3 || config.connectionString,
  connectionOptions
);

const db = mongoose.connection;
const Item = require('./models/item')
const Yelp = require('./models/yelp')
const Payment = require('./models/payment')
db.on('open', async () => {
  console.log('Connected to Database');
  const collection = db.collection('items');
  const coll = db.collection('yelps')
  const col = db.collection('bqs')
  const collect = db.collection('payment')
  /* const pipeline = [
    { $match: { 'fullDocument.store': 'Headquarters' } },
    { $addFields: { newField: 'this is an added field!' } }
  ]; */
  // const changeStream = await collection.watch({ fullDocument: 'updateLookup' });
  /* const changeStreamIterator = collection.watch({ fullDocument: 'updateLookup' });
  const next = await changeStreamIterator.next(); */
  //console.info(fullDocument)
  // changeStream.on("change", async function (change) {
  /*   changeStreamIterator("change", async function (change) {
    console.log("changed successfully");
    //console.info(fullDocument)
    db.collection('items').find().sort({updatedAt:-1}).limit(1).toArray(function (err, docs) {
    //db.collection('items').find().toArray(function (err, docs) {
      
      //const data = JSON.stringify(docs)
      console.log(docs)
      // data.forEach(b => {
      //   //delete b._id
      //   //delete b.createdAt
      //   //console.log(b)
      // });
      
      //i(docs)
      const pubsub = new PubSub({ keyFilename: path.join(__dirname, "ke.json"), projectId });
      try {
        
        var i=0,
        projectId = 'epaisa-323204', topicName = 'topic'
        docs.forEach(async (d) => {
        var temp = JSON.stringify(d)
        //console.log(temp)
        let dataBuffer = Buffer.from(temp)
        const messageId =  await pubsub.topic(topicName).publish(dataBuffer);
        
        console.log(`Message ${messageId} published.`);
        
      i++
      })
      } catch (error) {
        console.error(`Received error while publishing: ${error.message}`);
        process.exitCode = 1;
      }
    });
  }); */
});
async function i(doc) {
  projectId = 'epaisa-323204', // Your Google Cloud Platform project ID
    topicName = 'topic', // Name for the new topic to create
    subscriptionName = 'sub_node'
  const datasetId = "dataset"
  const tableId = "items";

  const pubsub = new PubSub({ keyFilename: path.join(__dirname, "ke.json"), projectId });

    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    
    
    
    //console.log(JSON.stringify(dataBuffer.data.length))
    
    try {
      var dataBuffer
      var i=0
      doc.forEach(async (d) => {
      var temp = JSON.stringify(d)
      //console.log(temp)
      dataBuffer = Buffer.from(temp)
      const messageId =  await pubsub.topic(topicName).publish(dataBuffer);
      
      console.log(`Message ${messageId} published.`);
      //callDF()
    i++
    })
      // const messageId = await pubsub.topic(topicName).publish(dataBuffer);
      
      // console.log(`Message ${messageId} published.`);

      
      //console.log(JSON.stringify(message.data))
      //const dataFlow = callDF()
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      process.exitCode = 1;
    }
  }
async function callDF() {
  //DATAFLOW
  try {
    projectId = 'epaisa-323204',
      gcsPath = 'gs://dataflow-templates/latest/PubSub_to_BigQuery'
      tempLocation = 'gs://bqbuck/'
    process.env.GOOGLE_APPLICATION_CREDENTIALS
    // Creates a client
    const df = new TemplatesServiceClient();
    //TODO(library generator): write the actual function you will be testing

    const temp = await df.getTemplate({
      projectId,
      gcsPath,
    }).catch(err => { console.log(err.message) });

    //console.info(temp);

    const request = {
      projectId: projectId,
      requestBody: {
        jobName: "bqq",
        parameters: {
          inputTopic: "projects/epaisa-323204/topics/topic",
          outputTableSpec: "epaisa-323204:dataset.items"
        },
        environment: {
          tempLocation: tempLocation,
          additionalExperiments: []
        }
      }

    }
    // const auth = await google.auth.getClient({
    //   scopes: ['https://www.googleapis.com/auth/cloud-platform']
    // })
    /* var request = {
      projectId: 'epaisa-323204',
      jobName: 'jobName',
      parameters: {
        inputSubscription: "projects/epaisa-323204/subscriptions/sub_node",
        outputTableSpec: "epaisa-323204:dataset.items"
      },
      environment: {
        bypassTempDirValidation: false,
        tempLocation: "gs://bqbuck/temp",
        ipConfiguration: "WORKER_IP_UNSPECIFIED",
        additionalExperiments: []
      }
    } */
    // request.auth = auth;
    return dataflow.projects.templates.launch(request).catch(err => { console.log(err) });

    // const dataFlow = new TemplatesServiceClient();
    // dataFlow.createJobFromTemplateRequest;
  }
  catch (error) {
    console.error(`Received error while in DF: ${error.message}`);
    process.exitCode = 1;
  }
}



//REST
const https = require("https");
const request = require("request");

const { exec } = require('child_process');
/* exec('mongoexport --collection=items --db=items --out=E:\Items.json', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  }); */

const path = require("path");
const gc = new Storage({
  keyFilename: path.join(__dirname, "keys.json"),
  projectId: "epaisa-321906",
});
//gc.getBuckets().then(x => console.log(x));
//console.log(data);
const itemsBucket = gc.bucket("kafka-bigquery");
//let data = itemsBucket.file('E://Items.csv');
//const filePath = require("E:/Items.csv");

//console.log(filePath)
//BQ
const bq = new BigQuery({
  keyFilename: path.join(__dirname, "keys.json"),//"keyss.json"),
  projectId: "epaisa-323204"//"mlops-321912",
});

// const bq = new BigQuery({
//   keyFilename: path.join(__dirname, "keyss.json"),
//   projectId: "yelp-business-321314",
// });

// const bq = new BigQuery({
//   keyFilename: path.join(__dirname, "keysss.json"),//"keyss.json"),
//   projectId: "rapid-outrider-323307"//"mlops-321912",
// });

const metadata = {
  sourceFormat: 'CSV',
  skipLeadingRows: 1,
  schema: {
    fields: [
      { name: '__v', type: 'INT' },
      { name: '_id', type: 'ObjectId' },
      { name: 'brand', type: 'STRING' },
      { name: 'buyingPrice', type: 'STRING' },
      { name: 'categories', type: 'STRING' },
      { name: 'category', type: 'STRING' },
      { name: 'createdAt', type: 'DATE' },
      { name: 'currentQuantity', type: 'STRING' },
      { name: 'discount', type: 'STRING' },
      { name: 'discountType', type: 'STRING' },
      { name: 'distributors', type: 'STRING' },
      { name: 'group', type: 'STRING' },
      { name: 'hsnCode', type: 'STRING' },
      { name: 'item', type: 'STRING' },
      { name: 'itemDescription', type: 'STRING' },
      { name: 'itemDisplay', type: 'STRING' },
      { name: 'itemHandler', type: 'STRING' },
      { name: 'manufacturers', type: 'STRING' },
      { name: 'mrp', type: 'STRING' },
      { name: 'newQuantity', type: 'STRING' },
      { name: 'rackNo', type: 'STRING' },
      { name: 'sellingPrice', type: 'STRING' },
      { name: 'shade', type: 'STRING' },
      { name: 'sku', type: 'STRING' },
      { name: 'store', type: 'STRING' },
      { name: 'taxes', type: 'STRING' },
      { name: 'threshold', type: 'STRING' },
      { name: 'unit', type: 'STRING' },
      { name: 'unitType', type: 'STRING' },
      { name: 'uom', type: 'STRING' },
      { name: 'upc', type: 'STRING' },
      { name: 'variantName', type: 'STRING' },
    ],
  },
  // Set the write disposition to overwrite existing table data.
  writeDisposition: 'WRITE_TRUNCATE',
  location: 'US',
};


//var payload = JSON.parse(JSON.stringify(filePath.toString()));
//console.log(payload);
async function uploadFile() {
  /* await itemsBucket.upload(filePath, {
   destination: items.json,
 }); */
  //console.log(`${filePath} uploaded to ${itemsBucket.id}`);
  const datasetId = "dataset";
  const tableId = "data";

  /* await bq.dataset(datasetId).table(tableId).insert(filePath);
  console.log(`Inserted ${filePath.length} rows in ${tableId}table `);  */
  // Load data from a Google Cloud Storage file into the table
  const [job] = await bq
    .dataset(datasetId)
    .table(tableId)
    .load(gc.bucket(itemsBucket).file(filePath), metadata);
  // load() waits for the job to finish
  console.log(`Job ${job.id} completed.`);

  // Check the job's status for errors
  const errors = job.status.errors;
  if (errors && errors.length > 0) {
    throw errors;
  }

}
//uploadFile().catch(console.error);
//RestApi().catch(console.error);
const axios = require("axios");
// REST

let API_KEY =
  "xnMf7juFnma34g_PO-jbQgmsrYkpCYeJ13cW9aiAuLfYU7SadfWe6RTuyG0HOgm4ueryUW_-TZLzqasyzaQK_5cyTUpzvLLXnjkfi6jwxdnQqkwk4T2rHP5CDgYVYXYx";

// REST
let yelpREST = axios.create({
  baseURL: "https://api.yelp.com/v3",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-type": "application/json",
  },
});
/* 
let yelpGQL = axios.create({
  url: "https://api.yelp.com/v3/graphql",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-type": "application/json",
  },
  method: "POST",
});
 */
async function yelpGqlApi() {
  yelpGQL({
    data: JSON.stringify({
      query: `{
      search(term: "coffee",
              location: "kyoto",
              limit: 10) {
          business {
              name
          }
      }
  }`,
    }),
  })
    .then(({ data }) => {
      // Double data: data is what Axios puts the response body in, but it's also what GraphQL returns
      let businesses = data.data.search.business;
      businesses.forEach((b) => {
        console.log("Name: ", b.name);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
//yelpGqlApi()
//yelpRestApi();

async function yelpRestApi() {
  yelpREST("/businesses/search", {
    params: {
      location: "amsterdam",
      term: "sweet",
      limit: 5,
    },
  })
    .then(({ data }) => {

      //console.log(x)
      // Do something with the data
      let { businesses } = data;
      var i = 0;
      var d = [];

      businesses.forEach((b) => {
        d[i] = {
          id: b.id,
          name: b.name,
          rating: b.rating,
          latitude: b.coordinates.latitude,
          longitude: b.coordinates.longitude,
          address: b.location.display_address[0] + " " + b.location.display_address[1],
          city: b.location.city,
          zip: b.location.zip_code,
          country: b.location.country,
          state: b.location.state
        };

        i++
      });

      // const datasetId = "dataset"
      // const tableId = "data"
      // const datasetId = "Yelpbusinessreview";
      // const tableId = "yelpbusinessreivew";
      const datasetId = "epdataset"
      const tableId = "data"
      bq.dataset(datasetId)
        .table(tableId)
        .insert(d)
        .catch((err) => {
          console.log(err)
        });
      console.log(`Inserted ${d.length} rows in ${tableId} table`);
    })
    .catch((error) => {
      console.log(error.message);
    });
}

async function RestApi() {
  request("http://ec2-18-220-100-33.us-east-2.compute.amazonaws.com/api/items", (err, res, body) => {
    //{ json: true },
    if (err) {
      return console.log(err);
    }
    //console.log(body);
    const data = JSON.parse(body.toString());
    const datasetId = "dataset";
    const tableId = "items_api";
    bq.dataset(datasetId).table(tableId).insert(data);
    console.log(`Inserted ${data.length} rows in ${tableId} table`);
  }
  );
}
var projId = 'epaisa-323204', datasetId = 'dataset', tableId = 'pubSub';
//var projId='yelp-business-321314',datasetId='Yelpbusinessreview',tableId='yelpbusinessreivew'
//var projId = 'rapid-outrider-323307', datasetId = 'epdataset', tableId = 'data';
//getBQdata();

function getBQdata() {
  const getData = async (projId, datasetId, tableId) => {
    const query = ` 
    SELECT * from \`${projId}.${datasetId}.${tableId}\`
    LIMIT 200`;
    // const query = ` 
    // DELETE from \`${projId}.${datasetId}.${tableId}\`
    // WHERE true`;
    const options = {
      query: query,
      location: 'us',
      //location: 'asia-southeast1',
    };

    //Run the query as job
    const [job] = await bq.createQueryJob(options).catch((err) => {
      console.log(err)
    });
    console.log(`Job '${job.id}' started.\n`);

    //Wait for query to finish
    const [rows] = await job.getQueryResults().catch((err) => {
      console.log(err)
    });

    //Print the results
    console.log('Table Data: ')
    var i = 0, check = 0;
    var d = []
    //console.log(rows)
    rows.forEach(async (b) => {
      d[i] = new Bq({
        id: b.id,
        name: b.name,
        rating: b.rating,
        latitude: b.latitude,
        longitude: b.longitude,
        address: b.address,
        city: b.city,
        zip: b.zip,
        country: b.country,
        state: b.state
      });
      //console.log(d)
      /* var z = await d[i].save()
        .then(check = 1)
        .catch(err => {
          check = 0
          console.log(err)
        }) */
      i++;
    });
    console.log('Rows: ' + rows.length)
    if (check == 1) {
      console.log("All Big Query data of length " + rows.length + " saved to database");

    }
  }

  getData(projId, datasetId, tableId);
}
//const res = gc.bucket('items_bucket');
// const theFile = itemsBucket.file(data,"Items.csv")
//   theFile.save();

/*
exec('gsutil mv E:\Items.csv gs://items_bucket/Items.csv', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }
 
  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
*/




//const a = quickstart().catch(err => {console.log(err)})
async function quickstart(
  projectId = 'epaisa-323204', // Your Google Cloud Platform project ID
  topicName = 'topic_node', // Name for the new topic to create
  subscriptionName = 'sub_node' // Name for the new subscription to create
) {
  // Instantiates a client
  const pubsub = new PubSub({ keyFilename: path.join(__dirname, "ke.json"), projectId });
  const bq = new BigQuery({
    keyFilename: path.join(__dirname, "ke.json"),//"keyss.json"),
    projectId: "epaisa-323204"//"mlops-321912",
  });
  datasetId = 'dataset', tableId = 'pubSub';
  // Creates a new topic
  //const [topic] = await pubsub.topicName;
  // console.log(`Topic ${topic.name} created.`);
  const topic = pubsub.topic(topicName);

  // Creates a subscription on that new topic
  //const [subscription] = await topic.get(subscriptionName);
  const subscription = pubsub.subscription(subscriptionName);
  // Receive callbacks for new messages on the subscription
  subscription.on('message', message => {
    console.log('Received message:', message.data.toString());
    const d = message.data.toString()

    const messageHandler = message => {
      console.log(
        `Received message: id ${message.id}, data ${message.data
        }, attributes: ${JSON.stringify(message.attributes)}`
      );

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };
    subscription.removeListener('message', messageHandler);
    process.exit(0);
  });

  // Receive callbacks for errors on the subscription
  subscription.on('error', error => {
    console.error('Received error:', error);
    process.exit(1);
  });

  // Send a message to the topic
  //topic.publish(Buffer.from('** !'));


}






app.use(express.json());

const itemsRouter = require("./routes/item");
app.use("/items", itemsRouter);
const yelpsRouter = require("./routes/yelp");
app.use("/yelp", yelpsRouter);
const bqRouter = require("./routes/bq");
app.use("/bq", bqRouter);
const paymentRouter = require("./routes/payment");
app.use("/payment", paymentRouter);
const port = process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 3000;
app.listen(port, () => console.log("Server listening on port " + port));

