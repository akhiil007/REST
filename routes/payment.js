const express = require('express')
const router = express.Router()
const Payment = require('../models/payment')
const { google } = require('googleapis');
const keys = require('../key.json');



// Getting all
router.get('/', async (req, res) => {
  try {

    const payments = await Payment.find().catch(err => { console.log(err.message) })
    res.json(payments)


  } catch (err) {
    res.status(500).json({ message: err })
  }
})

// Getting One
router.get('/:id', getPayment, (req, res) => {


  res.json(res.payment)
})

// Creating one
router.post('/', async (req, res) => {
  const payment = new Payment({
    orderId: req.body.orderId,
    userId: req.body.userId,
    storeId: req.body.storeId,
    companyId: req.body.companyId,
    merchantId: req.body.merchantId,
    currencyId: req.body.currencyId,
    customerId: req.body.customerId,
    subtotal: req.body.subtotal,
    amount: req.body.amount,
    discount: req.body.discount,
    tips: req.body.tips,
    isSplit: req.body.isSplit,
    localId: req.body.localId,
    status: req.body.status,
    lat: req.body.lat,
    lon: req.body.lon,
    createdAt: req.body.createdAt,
    updatedAt: req.body.updatedAt,
    paymentOrder: {
      deliveryCharges: req.body.deliveryCharges,
      generalDiscount: req.body.generalDiscount,
      generalDiscountType: req.body.generalDiscountType,
      generaldiscountEntered: req.body.generaldiscountEntered,
      roundOffAmount: req.body.roundOffAmount,
      salesreturnstatus: req.body.salesreturnstatus,
      serviceCharges: req.body.serviceCharges,
      subTotal: req.body.subTotal,
      totalDiscount: req.body.totalDiscount,
      totalPrice: req.body.totalPrice,
      totalTax: req.body.totalTax,
      calculatedTax: [
        {
        calculatedTaxValue: req.body.calculatedTaxValue,
        id: req.body.id,
        name: req.body.name,
        taxMode: req.body.taxMode,
        taxServiceIncluded: req.body.taxServiceIncluded,
        taxType: req.body.taxType,
        value: req.body.value
      }
      ],
      customItems: [
        {
          basePrice: req.body.basePrice,
          calculatedDiscount: req.body.calculatedDiscount,
          calculatedPrice: req.body.calculatedPrice,
          discount: req.body.discount,
          discountEntered: req.body.discountEntered,
          discountValue: req.body.discountValue,
          name: req.body.name,
          quantity: req.body.quantity,
          taxes: [
            {
              calculatedTaxValue: req.body.calculatedTaxValue,
              id: req.body.id,
              name: req.body.name,
              taxMode: req.body.taxMode,
              taxServiceIncluded: req.body.taxServiceIncluded,
              taxType: req.body.taxType,
              value: req.body.value
            }
          ]
        }
      ]
    },
    transactions: [
      {
          userId: req.body.userId,
          storeId: req.body.storeId,
          companyId: req.body.companyId,
          merchantId: req.body.merchantId,
          currencyId: req.body.currencyId,
          status: req.body.status,
          type: req.body.type,
          amount: req.body.amount,
          applicationId: req.body.applicationId,
          localId: req.body.localId,
          extraFields: req.body.extraFields,
          createdAt: req.body.createdAt,
          updatedAt: req.body.updatedAt,
      }
  ]

  })
  try {

    const newPayment = await payment.save()



    res.status(201).json(newPayment)

  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.post('/:id', getPayment, async (req, res) => {
  if (req.body.store != null) {
    res.payment.store = req.body.store
  }
  if (req.body.itemHandler != null) {
    res.payment.itemHandler = req.body.itemHandler
  }
  if (req.body.itemDisplay != null) {
    res.payment.itemDisplay = req.body.itemDisplay
  }
  if (req.body.itemDescription != null) {
    res.payment.itemDescription = req.body.itemDescription
  }
  if (req.body.categories != null) {
    res.payment.categories = req.body.categories
  }
  if (req.body.manufacturers != null) {
    res.payment.manufacturers = req.body.manufacturers
  }
  if (req.body.distributors != null) {
    res.payment.distributors = req.body.distributors
  }
  if (req.body.taxes != null) {
    res.payment.taxes = req.body.taxes
  }
  if (req.body.hsnCode != null) {
    res.payment.hsnCode = req.body.hsnCode
  }
  if (req.body.variantName != null) {
    res.payment.variantName = req.body.variantName
  }
  if (req.body.sellingPrice != null) {
    res.payment.sellingPrice = req.body.sellingPrice
  }
  if (req.body.sellingPrice != null) {
    res.payment.sellingPrice = req.body.sellingPrice
  }
  if (req.body.buyingPrice != null) {
    res.payment.buyingPrice = req.body.buyingPrice
  }
  if (req.body.mrp != null) {
    res.payment.mrp = req.body.mrp
  }
  if (req.body.discount != null) {
    res.payment.discount = req.body.discount
  }
  if (req.body.discountType != null) {
    res.payment.discountType = req.body.discountType
  }
  if (req.body.sku != null) {
    res.payment.sku = req.body.sku
  }
  if (req.body.upc != null) {
    res.payment.upc = req.body.upc
  }
  if (req.body.currentQuantity != null) {
    res.payment.currentQuantity = req.body.currentQuantity
  }
  if (req.body.newQuantity != null) {
    res.payment.newQuantity = req.body.newQuantity
  }
  if (req.body.threshold != null) {
    res.payment.threshold = req.body.threshold
  }
  if (req.body.unitType != null) {
    res.payment.unitType = req.body.unitType
  }
  if (req.body.unit != null) {
    res.payment.unit = req.body.unit
  }
  if (req.body.unit != null) {
    res.payment.unit = req.body.unit
  }
  if (req.body.brand != null) {
    res.payment.brand = req.body.brand
  }
  if (req.body.category != null) {
    res.payment.category = req.body.category
  }
  if (req.body.shade != null) {
    res.payment.shade = req.body.shade
  }
  if (req.body.uom != null) {
    res.payment.uom = req.body.uom
  }
  if (req.body.rackNo != null) {
    res.payment.rackNo = req.body.rackNo
  }
  if (req.body.group != null) {
    res.payment.group = req.body.group
  }
  try {
    const updatedPayment = await res.payment.save()
    res.json(updatedPayment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
//Delete All
router.delete('/', async (req, res) => {
  try {
    await Payment.deleteMany()
    res.json({ message: 'Deleted all Items' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Deleting One 
router.delete('/:id', getPayment, async (req, res) => {
  try {
    await res.payment.remove()
    res.json({ message: 'Deleted Payment' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getPayment(req, res, next) {
  let payment
  try {
    payment = await Payment.findById(req.params.id)
    if (payment == null) {
      return res.status(404).json({ message: 'Cannot find payment' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.payment = payment
  next()
}


module.exports = router