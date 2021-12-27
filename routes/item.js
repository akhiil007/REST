const express = require('express')
const router = express.Router()
const Item = require('../models/item')
const { google } = require('googleapis');
const keys = require('../key.json');
const { BigQuery } = require("@google-cloud/bigquery");
const { PubSub } = require('@google-cloud/pubsub');
const path = require("path");

const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Connected to googlesheets");
    //gsrun(client);
  }
});

async function updateDB() {
  const gsapi = google.sheets({ version: 'v4', auth: client })

  const opt = {
    spreadsheetId: '172Z3FmO6L_w7ukezxoJED129XtRWrq4zRceG_te9Y5I',
    range: 'Items!A2:AD',
  };
  let res = await gsapi.spreadsheets.values.get(opt).catch(err => { console.log(err.message) });
  //console.log(res.data.values.length);

  var items = [];
  for (let i = 0; i < res.data.values.length; i++) {
    items[i] = {
      store: res.data.values[i][0],
      itemHandler: res.data.values[i][1],
      itemDisplay: res.data.values[i][2],
      itemDescription: res.data.values[i][3],
      categories: res.data.values[i][4],
      manufacturers: res.data.values[i][5],
      distributors: res.data.values[i][6],
      taxes: res.data.values[i][7],
      hsnCode: res.data.values[i][8],
      variantName: res.data.values[i][9],
      sellingPrice: res.data.values[i][10],
      buyingPrice: res.data.values[i][11],
      mrp: res.data.values[i][12],
      discount: res.data.values[i][13],
      discountType: res.data.values[i][14],
      sku: res.data.values[i][15],
      upc: res.data.values[i][16],
      currentQuantity: res.data.values[i][17],
      newQuantity: res.data.values[i][18],
      threshold: res.data.values[i][19],
      unitType: res.data.values[i][20],
      unit: res.data.values[i][21],
      item: res.data.values[i][22],
      brand: res.data.values[i][23],
      category: res.data.values[i][24],
      shade: res.data.values[i][25],
      uom: res.data.values[i][26],
      rackNo: res.data.values[i][27],
      group: res.data.values[i][28],
      merchantId: res.data.values[i][29],
    };

  }
  //console.log(JSON.stringify(items));
  return items;

}


async function updateSheet(array) {
  const gsapi = google.sheets({ version: 'v4', auth: client })

  const updateOptions = {
    spreadsheetId: '172Z3FmO6L_w7ukezxoJED129XtRWrq4zRceG_te9Y5I',
    range: 'Items!A2',
    valueInputOption: 'USER_ENTERED',
    resource: { values: array }
  };
  let res = await gsapi.spreadsheets.values.append(updateOptions);
  //console.log(res)
}

async function updateNewId(idArr) {
  const gsapi = google.sheets({ version: 'v4', auth: client })

  const updateOptions = {
    spreadsheetId: '172Z3FmO6L_w7ukezxoJED129XtRWrq4zRceG_te9Y5I',
    range: 'Items!AE2',
    valueInputOption: 'USER_ENTERED',
    resource: { values: idArr }
  };
  let res = await gsapi.spreadsheets.values.update(updateOptions)
  //console.log(updateOptions.params)
}
/* function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
} */
// Getting all
router.get('/', async (req, res) => {
  try {
    var shData = await updateDB().catch(err=>{console.log(err.message)});
    var idArr = [];
    console.log("shData: "+shData.length)
    for (var i = 0; i < shData.length; i++) {
      //console.log(shData[i].id)
      if (shData[i].id == undefined || shData[i].id == "") {
        let temp = new Item(shData[i]);
        // sleep(200)
        // const newItem = await temp.save().catch(err=>{console.log(err.message)});
        idArr[i] = [newItem._id]
        // setTimeout(() => {  console.log("Waitinng..!"); }, 2000);
      }
    }
    var projId = 'epaisa-332411', datasetId = 'dataset', tableId = 'items_latest'
    const bq = new BigQuery({
      keyFilename: path.join(__dirname, "k.json"),//"keyss.json"),
      projectId: "epaisa-332411"//"mlops-321912",
    });

    const query = ` SELECT * from \`${projId}.${datasetId}.${tableId}\``;
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
    // console.log(rows)
    console.log('Records in BQ: ' + rows.length+' row(s) found... !')
    //****************************************************** */
    const items = await Item.find().catch(err => { console.log(err) })
    res.json(res.items)
    console.log('DB Records: '+items.length+' record(s) found... !')



    updateNewId(idArr);



  } catch (err) {
    res.status(500).json({ message: err })
  }
})

// Getting One
router.get('/:id', getItem, (req, res) => {

  //const items = await Item.findById(req.body.id)
  res.json(item)
})

// Creating one
router.post('/', async (req, res) => {
  const item = new Item({
    store: req.body.store,
    itemHandler: req.body.itemHandler,
    itemDisplay: req.body.itemDisplay,
    itemDescription: req.body.itemDescription,
    categories: req.body.categories,
    manufacturers: req.body.manufacturers,
    distributors: req.body.distributors,
    taxes: req.body.taxes,
    hsnCode: req.body.hsnCode,
    variantName: req.body.variantName,
    sellingPrice: req.body.sellingPrice,
    buyingPrice: req.body.buyingPrice,
    mrp: req.body.mrp,
    discount: req.body.discount,
    discountType: req.body.discountType,
    sku: req.body.sku,
    upc: req.body.upc,
    currentQuantity: req.body.currentQuantity,
    newQuantity: req.body.newQuantity,
    threshold: req.body.threshold,
    unitType: req.body.unitType,
    unit: req.body.unit,
    item: req.body.item,
    brand: req.body.brand,
    category: req.body.category,
    shade: req.body.shade,
    uom: req.body.uom,
    rackNo: req.body.rackNo,
    group: req.body.group,
    merchantId: req.body.merchantId,
    id: req.body.itemId,
  })
  try {
    // if (req.body.itemId) {
    //     const updatedProduct = await Item.findByIdAndUpdate(req.body.itemId, req.body)
    //     res.status(201).json(updatedProduct)
    // } else {
    //console.log(item.updatedAt)
    const newItem = await item.save()
    //console.log(newItem)
    /* const data = [[
      newItem.store,
      newItem.itemHandler,
      newItem.itemDisplay,
      newItem.itemDescription,
      newItem.categories,
      newItem.manufacturers,
      newItem.distributors,
      newItem.taxes,
      newItem.hsnCode,
      newItem.variantName,
      newItem.sellingPrice,
      newItem.buyingPrice,
      newItem.mrp,
      newItem.discount,
      newItem.discountType,
      newItem.sku,
      newItem.upc,
      newItem.currentQuantity,
      newItem.newQuantity,
      newItem.threshold,
      newItem.unitType,
      newItem.unit,
      newItem.item,
      newItem.brand,
      newItem.category,
      newItem.shade,
      newItem.uom,
      newItem.rackNo,
      newItem.group,
      newItem._id
    ]] */

    //updateSheet(data);
    //console.log(newItem)
    res.status(201).json(newItem)
    //}
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.post('/:id', getItem, async (req, res) => {
  if (req.body.store != null) {
    res.item.store = req.body.store
  }
  if (req.body.merchantId != null) {
    res.item.merchantId = req.body.merchantId
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
    const updatedItem = await res.item.save()
    res.json(updatedItem)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
//Delete All
router.delete('/', async (req, res) => {
  try {
    await Item.deleteMany()
    res.json({ message: 'Deleted all Items' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Deleting One 
router.delete('/:id', getItem, async (req, res) => {
  try {

    const pubsub = new PubSub({ keyFilename: path.join(__dirname, "ke.json"), projectId });
    try {

      var i = 0,
        projectId = 'epaisa-323204', topicName = 'topic'
      // docs.forEach(async (d) => {
      let item = await res.item
      item.__v = 1
      item.updatedAt = new Date()
      //console.log(item.updatedAt)
      var temp = JSON.stringify(item)
      //console.log(temp)
      let dataBuffer = Buffer.from(temp)
      const messageId = await pubsub.topic(topicName).publish(dataBuffer);

      console.log(`Message ${messageId} published.`);

      i++
      // })
    } catch (error) {
      console.error(`Received error while publishing in delete API: ${error.message}`);
      process.exitCode = 1;
    }
    // res.json({ message: 'Deleting Item.... '+res.item.itemDisplay })
    await res.item.remove()
    res.json({ message: 'Deleted Item' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getItem(req, res, next) {
  let item
  try {
    item = await Item.findById(req.params.id)
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.item = item
  next()
}


module.exports = router