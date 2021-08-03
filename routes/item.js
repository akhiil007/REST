const express = require('express')
const router = express.Router()
const Item = require('../models/item')

const { google } = require('googleapis');
const keys = require('../keys.json');

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

async function updateDB(cl) {
  const gsapi = google.sheets({ version: 'v4', auth: cl })

  const opt = {
    spreadsheetId: '172Z3FmO6L_w7ukezxoJED129XtRWrq4zRceG_te9Y5I',
    range: 'Items!A2:AD',
  };
  let res = await gsapi.spreadsheets.values.get(opt);
  //console.log(res.data.values);

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
      id: res.data.values[i][29]
    };

  }
  return items;
  //console.log(items);
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

async function updateNewId(id) {
  const gsapi = google.sheets({ version: 'v4', auth: client })

  const updateOptions = {
    spreadsheetId: '172Z3FmO6L_w7ukezxoJED129XtRWrq4zRceG_te9Y5I',
    range: 'Items!AD2',
    valueInputOption: 'USER_ENTERED',
    resource: { values: id }
  };
  let res = await gsapi.spreadsheets.values.update(updateOptions)
  //console.log(updateOptions.params)
}

// Getting all
router.get('/', async (req, res) => {
  try {
    var shData = await updateDB(client);
    var idArr = [];
    for (var i = 0; i < shData.length; i++) {
      //console.log(shData[i].id)
      if (shData.id == undefined || shData.id == "") {
        let temp = new Item(shData[i]);
        delete temp.id;
        const newItem = await temp.save();
        idArr[i] = [newItem._id]
      }

    }
    updateNewId(idArr);

    const items = await Item.find()
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getItem, (req, res) => {
  res.json(res)
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
    id: req.body.itemId,
  })
  try {
    // if (req.body.itemId) {
    //     const updatedProduct = await Item.findByIdAndUpdate(req.body.itemId, req.body)
    //     res.status(201).json(updatedProduct)
    // } else {
    const newItem = await item.save()
    //console.log(newItem)
    const data = [[
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
    ]]

    updateSheet(data);

    res.status(201).json(newItem)
    //}
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getItem, async (req, res) => {
  if (req.body.name != null) {
    res.item.name = req.body.name
  }
  if (req.body.subscribedToChannel != null) {
    res.item.subscribedToChannel = req.body.subscribedToChannel
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
    await Item.remove()
    res.json({ message: 'Deleted all Items' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Deleting One 
router.delete('/:id', getItem, async (req, res) => {
  try {
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