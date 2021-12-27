const mongoose = require('mongoose')

const { BigQuery } = require("@google-cloud/bigquery");
const { PubSub } = require('@google-cloud/pubsub');
const path = require("path");
// 
const INITIATED = 1
const IN_PROCESS = 2
const PENDING = 3
const APPROVED = 4
const DEPOSITED = 5
const FAILED = 6
const REFUNDED = 7
const VOIDED = 8
const SCHEDULED = 9
const CANCELLED = 10
const DEPOSIT_QUEUE = 11
const PARTIAL_REFUND = 12
const SPLIT_REFUNDED = 13
const VAS_PARTIAL_APPROVED = 14

const paymentSchema = new mongoose.Schema({
    paymentIntId: { type: Number },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: Number,
        enum: [
            INITIATED,
            IN_PROCESS,
            PENDING,
            APPROVED,
            DEPOSITED,
            FAILED,
            REFUNDED,
            VOIDED,
            SCHEDULED,
            CANCELLED,
            DEPOSIT_QUEUE,
            PARTIAL_REFUND,
            SPLIT_REFUNDED,
            VAS_PARTIAL_APPROVED
        ],
        required: true
    },
    currencyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    subtotal: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        default: 0
    },
    tips: {
        type: String,
        default: 0
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    checksum: {
        type: String
    },
    invoice: {
        type: String
    },
    isSplit: {
        type: Number,
        default: false
    },
    lat: {
        type: String,
        default: ''
    },
    lon: {
        type: String,
        default: ''
    },
    localId: {
        type: String
    },
    // read-only
    transactions: [
        {
            type: mongoose.Schema.Types.Mixed,
            ref: 'Transaction'
        }
    ]
},
    {
        timestamps: true
    }
)
//********************************************************************* */
let rows = [], row;

async function getBQ() {
    var projId = 'epaisa-323204', datasetId = 'dataset', tableId = 'payment'
    const bq = new BigQuery({
        keyFilename: path.join(__dirname, "ke.json"),//"keyss.json"),
        projectId: "epaisa-323204"//"mlops-321912",
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

async function nestedRepeatedSchema() {
    // Creates a new table named "my_table" in "my_dataset"
    // with nested and repeated columns in schema.

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const bq = new BigQuery({
        keyFilename: path.join(__dirname, "ke.json"),//"keyss.json"),
        projectId: "epaisa-323204"//"mlops-321912",
    });
    const datasetId = "dataset";
    const tableId = "payments";
    const schema = [
        { name: 'orderId', type: 'STRING', mode: 'NULLABLE' },
        { name: 'userId', type: 'STRING', mode: 'NULLABLE' },
        { name: 'storeId', type: 'STRING', mode: 'NULLABLE' },
        { name: 'companyId', type: 'STRING', mode: 'NULLABLE' },
        { name: 'merchantId', type: 'STRING', mode: 'NULLABLE' },
        { name: 'currencyId', type: 'STRING', mode: 'NULLABLE' },
        { name: 'customerId', type: 'STRING', mode: 'NULLABLE' },
        { name: 'subtotal', type: 'STRING', mode: 'NULLABLE' },
        { name: 'amount', type: 'STRING', mode: 'NULLABLE' },
        { name: 'discount', type: 'STRING', mode: 'NULLABLE' },
        { name: 'tips', type: 'STRING', mode: 'NULLABLE' },
        { name: 'isSplit', type: 'INTEGER', mode: 'NULLABLE' },
        { name: 'localId', type: 'STRING', mode: 'NULLABLE' },
        { name: 'status', type: 'STRING', mode: 'NULLABLE' },
        { name: 'lat', type: 'STRING', mode: 'NULLABLE' },
        { name: 'lon', type: 'STRING', mode: 'NULLABLE' },
        {
            name: 'transactions',
            type: 'RECORD',
            mode: 'REPEATED',
            fields: [
                { name: 'userId', type: 'STRING' },
                { name: 'storeId', type: 'STRING' },
                { name: 'companyId', type: 'STRING' },
                { name: 'merchantId', type: 'STRING' },
                { name: 'currencyId', type: 'STRING' },
                { name: 'status', type: 'STRING' },
                { name: 'amount', type: 'STRING' },
                { name: 'applicationId', type: 'STRING' },
                { name: 'localId', type: 'STRING' }
            ],
        }
    ];

    // For all options, see https://cloud.google.com/bigquery/docs/reference/v2/tables#resource
    const options = {
        schema: schema,
        location: 'US',
    };

    // Create a new table in the dataset
    const [table] = await bq
        .dataset(datasetId)
        .createTable(tableId, options);

    console.log(`Table ${table.id} created.`);
}

paymentSchema.post('save', async function (docs) {
    // await nestedRepeatedSchema();
    var check = 0;

    rows.forEach(async (b) => {

        if (docs._id == b._id) {
            check = 1;
            return check
        }
    })

    console.log(check)


    if (check == 0 || check == 1) {

        const pubsub = new PubSub({ keyFilename: path.join(__dirname, "ke.json"), projectId });
        try {

            var i = 0,
                projectId = 'epaisa-323204', topicName = 'topic1'
            // docs.forEach(async (d) => {

            var temp = JSON.stringify(docs)
            console.log(temp)
            let dataBuffer = Buffer.from(temp)
            const messageId = await pubsub.topic(topicName).publish(dataBuffer);

            console.log(`Message ${messageId} published.`);

            i++
            // })
        } catch (error) {
            console.error(`Received error while publishing: ${error.message}`);
            process.exitCode = 1;
        }

    }

    if (check == 1) {
        console.log('DATA is present in BQ with same ID')


        var projId = 'epaisa-323204', datasetId = 'dataset', tableId = 'payment'
        const bq = new BigQuery({
            keyFilename: path.join(__dirname, "ke.json"),//"keyss.json"),
            projectId: "epaisa-323204"//"mlops-321912",
        });

        const opt = {
            view: `SELECT agg.table.*
      FROM (SELECT _id,
      ARRAY_AGG(STRUCT(table)
      ORDER BY
      updatedAt DESC)[SAFE_OFFSET(0)] agg
      FROM \`${datasetId}.${tableId}\` table
      GROUP BY _id)`
        };

        // const myDataset = await bq.dataset(datasetId);
        // Create a new view in the dataset
        // const [view] = await myDataset.createTable("latest_view", opt);

        // console.log(`View ${view.id} created.`);
    }
})


module.exports = mongoose.model('Payment', paymentSchema)