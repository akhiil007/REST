const express = require('express')
const router = express.Router()
const Bq = require('../models/bq')
const { google } = require('googleapis');
const keys = require('../keys.json');
const {PubSub} = require('@google-cloud/pubsub');
const { BigQuery } = require("@google-cloud/bigquery");
const path = require("path")
const axios = require("axios");
const {TemplatesServiceClient} = require('@google-cloud/dataflow');
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



// Getting all
router.get('/', async (req, res) => {
  /* try {
  
        const yelps = await Yelp.findAll()
        res.json(yelps)
  } catch (err) {
    res.status(500).json({ message: err.message })
  } */
  const data = await Bq.find()
  //console.log(data)
  res.json(data)


})

// Getting One
router.get('/:id', getItem, (req, res) => {
  res.json(res.yelp)
})

// Creating one
router.post('/', async (req, res) => {
  const a = await quickstart().catch(err => {console.log(err.message)})
  async function quickstart(
    projectId = 'epaisa-323204', // Your Google Cloud Platform project ID
    topicName = 'topic_node', // Name for the new topic to create
    subscriptionName = 'sub_node' // Name for the new subscription to create
  ) {
    // Instantiates a client
    const pubsub = new PubSub({projectId});
    const bq = new BigQuery({
      keyFilename: path.join(__dirname, "ke.json"),//"keyss.json"),
      projectId: "epaisa-323204"//"mlops-321912",
    });
  
    // Creates a new topic
    const [topic] = await pubsub.createTopic(topicName);
    console.log(`Topic ${topic.name} created.`);
  
    // Creates a subscription on that new topic
    const [subscription] = await topic.createSubscription(subscriptionName);
  
    // Receive callbacks for new messages on the subscription
    subscription.on('message', message => {
      console.log('Received message:', message.data.toString());
      process.exit(0);
    });
  
    // Receive callbacks for errors on the subscription
    subscription.on('error', error => {
      console.error('Received error:', error);
      process.exit(1);
    });
  
    // Send a message to the topic
    topic.publish(Buffer.from('Test message!'));
  }

  /* const newdata = new Yelp({
    name: req.body.name,
    rating: req.body.rating,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    address: req.body.address,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    state: req.body.state,
  })
  try {
    const v = await newdata.save()
    res.status(201).json(res)
  } catch (err) {
    res.status(400).json({ message: err.message })
  } */
  res.status(201).json("Done "+ a)
})

// Updating One
router.post('/:id', getItem, async (req, res) => {
  if (req.body.store != null) {
    res.item.store = req.body.store
  }
  if (req.body.itemHandler != null) {
    res.item.itemHandler = req.body.itemHandler
  }
  if (req.body.itemDisplay != null) {
    res.item.itemDisplay = req.body.itemDisplay
  }
  if (req.body.itemDescription != null) {
    res.item.itemDescription = req.body.itemDescription
  }
  if (req.body.categories != null) {
    res.item.categories = req.body.categories
  }
  if (req.body.manufacturers != null) {
    res.item.manufacturers = req.body.manufacturers
  }
  if (req.body.distributors != null) {
    res.item.distributors = req.body.distributors
  }
  if (req.body.taxes != null) {
    res.item.taxes = req.body.taxes
  }
  if (req.body.hsnCode != null) {
    res.item.hsnCode = req.body.hsnCode
  }
  if (req.body.variantName != null) {
    res.item.variantName = req.body.variantName
  }
  if (req.body.sellingPrice != null) {
    res.item.sellingPrice = req.body.sellingPrice
  }
  if (req.body.sellingPrice != null) {
    res.item.sellingPrice = req.body.sellingPrice
  }
  if (req.body.buyingPrice != null) {
    res.item.buyingPrice = req.body.buyingPrice
  }
  if (req.body.mrp != null) {
    res.item.mrp = req.body.mrp
  }
  if (req.body.discount != null) {
    res.item.discount = req.body.discount
  }
  if (req.body.discountType != null) {
    res.item.discountType = req.body.discountType
  }
  if (req.body.sku != null) {
    res.item.sku = req.body.sku
  }
  if (req.body.upc != null) {
    res.item.upc = req.body.upc
  }
  if (req.body.currentQuantity != null) {
    res.item.currentQuantity = req.body.currentQuantity
  }
  if (req.body.newQuantity != null) {
    res.item.newQuantity = req.body.newQuantity
  }
  if (req.body.threshold != null) {
    res.item.threshold = req.body.threshold
  }
  if (req.body.unitType != null) {
    res.item.unitType = req.body.unitType
  }
  if (req.body.unit != null) {
    res.item.unit = req.body.unit
  }
  if (req.body.item != null) {
    res.item.item = req.body.item
  }
  if (req.body.brand != null) {
    res.item.brand = req.body.brand
  }
  if (req.body.category != null) {
    res.item.category = req.body.category
  }
  if (req.body.shade != null) {
    res.item.shade = req.body.shade
  }
  if (req.body.uom != null) {
    res.item.uom = req.body.uom
  }
  if (req.body.rackNo != null) {
    res.item.rackNo = req.body.rackNo
  }
  if (req.body.group != null) {
    res.item.group = req.body.group
  }
  try {
    const updatedItem = await res.yelp.save()
    res.json(updatedItem)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
//Delete All
router.delete('/', async (req, res) => {
  try {
    await Bq.deleteMany()
    res.json({ message: 'Deleted all Items' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Deleting One 
router.delete('/:id', getItem, async (req, res) => {
  try {

    await res.yelp.remove()
    res.json({ message: 'Deleted data' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getItem(req, res, next) {
  let item
  try {
    item = await Yelp.findById(req.params.id)
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.yelp = item
  next()
}


module.exports = router