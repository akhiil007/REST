const mongoose = require('mongoose')
// 
const bqSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  },
  id: {
    type:String
  },
  name: {
    type: String
  },
  rating: {
    type: Number
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  zip: {
    type: String
  },
  country: {
    type: String
  },
  state: {
    type: String
  }
  
})

module.exports = mongoose.model('Bq', bqSchema)

// const YelpModel = mongoose.model('Yelp', yelpSchema)

// export { YelpModel }