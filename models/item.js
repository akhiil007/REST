const mongoose = require('mongoose')

const { BigQuery } = require("@google-cloud/bigquery");
const { PubSub } = require('@google-cloud/pubsub');
const path = require("path");
// 
const itemSchema = new mongoose.Schema({
  store: {
    type: String
  },
  itemHandler: {
    type: String
  },
  itemDisplay: {
    type: String
  },
  itemDescription: {
    type: String
  },
  categories: {
    type: String
  },
  manufacturers: {
    type: String
  },
  distributors: {
    type: String
  },
  taxes: {
    type: String
  },
  hsnCode: {
    type: String
  },
  variantName: {
    type: String
  },
  sellingPrice: {
    type: String
  },
  buyingPrice: {
    type: String
  },
  mrp: {
    type: String
  },
  discount: {
    type: String
  },
  discountType: {
    type: String
  },
  sku: {
    type: String
  },
  upc: {
    type: String
  },
  currentQuantity: {
    type: String
  },
  newQuantity: {
    type: String
  },
  threshold: {
    type: String
  },
  unitType: {
    type: String
  },
  unit: {
    type: String
  },
  item: {
    type: String
  },
  brand: {
    type: String
  },
  category: {
    type: String
  },
  shade: {
    type: String
  },
  uom: {
    type: String
  },
  rackNo: {
    type: String
  },
  group: {
    type: String
  },
  merchantId: {
    type: String,
    required: true
  }
},
  {
    timestamps: true
  }
)
//********************************************************************* */
let rows = [], row;

async function getBQ() {
  var projId = 'epaisa-332411', datasetId = 'dataset', tableId = 'items'
  const bq = new BigQuery({
    keyFilename: path.join(__dirname, "k.json"),//"keyss.json"),
    projectId: "epaisa-332411"//"mlops-321912",
  });
  const query = ` SELECT _id from \`${projId}.${datasetId}.${tableId}\``;
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
  [rows] = await job.getQueryResults().catch((err) => {
    console.log(err)
  });
}


itemSchema.post('save', async function (docs) {
  // await getBQ();
  var check = 0;
  
  if (check == 0 || check == 1) {

    projectId = 'epaisa-332411', topicName = 'topic'
    const pubsub = new PubSub({ keyFilename: path.join(__dirname, "k.json"), projectId });
    try {

      var i = 0,
      // docs.forEach(async (d) => {

       temp = JSON.stringify(docs)
      console.log(projectId)
      let dataBuffer = Buffer.from(temp)
      const messageId = await pubsub.topic(topicName).publish(dataBuffer);

      console.log(`Message ${messageId} published.`);

      i++
      await updateViewQuery(docs.merchantId)
      // })
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      process.exitCode = 1;
    }

  }
})


// Update View Query
 async function updateViewQuery(merchantId) {
  // Updates a view named "my_existing_view" in "my_dataset".

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const datasetId = "dataset"
  const tableId = "items_latest"
  // console.log(merchantId)
  const bq = new BigQuery({
    keyFilename: path.join(__dirname, "ke.json"),//"keyss.json"),
    projectId: "epaisa-323204"//"mlops-321912",
  });
  const dataset = await bq.dataset(datasetId);
  
  // This example updates a view into the USA names dataset to include state.
  const newViewQuery = `select * from (
    SELECT agg.table.*
        FROM (
          SELECT
          _id,
          ARRAY_AGG(STRUCT(table)
          ORDER BY
          updatedAt DESC)[SAFE_OFFSET(0)] agg
          FROM \`dataset.items\` table
          where merchantId = '${merchantId}'
          GROUP BY
          _id)
    ) where __v!=1  `;
  

  // Retrieve existing view
  const [view] = await dataset.table(tableId).get();

  // Retrieve existing view metadata
  const [metadata] = await view.getMetadata();

  // Update view query
  metadata.view = newViewQuery;

  // Set metadata
  await view.setMetadata(metadata);

  console.log(`View ${tableId} updated.`);
  console.log("Success")
}

module.exports = mongoose.model('Item', itemSchema)