const express = require('express')
const router = express.Router()
const Item = require('../models/item')

// Getting all
router.get('/', async (req, res) => {
  try {
    const items = await Item.find()
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getItem, (req, res) => {
  res.json(res.item)
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
  })  
  try {
    const newItem = await item.save()
    res.status(201).json(newItem)
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