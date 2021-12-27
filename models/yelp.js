const mongoose = require('mongoose')
// 
const yelpSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  },
  name: {
    type:String
  },
  id: {
    type:String
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

module.exports = mongoose.model('Yelp', yelpSchema)

// const YelpModel = mongoose.model('Yelp', yelpSchema)

// export { YelpModel }