const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  store: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
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
})

module.exports = mongoose.model('Item', itemSchema)