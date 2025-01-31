const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("mongobd conected"))



const userSchema =  new mongoose.Schema({
  name: {
    type: String,
    required: true
    
  },
  
})
//модель по схеме
const User = mongoose.model("user",userSchema)


    app.post('/api/users',(req,res) => {
      let pers = new User({name:req.body.username})
       pers.save().then(response => {
        res.json({
          username: response.name,
          _id: response._id
        })
       }).catch(err => console.log(err))
      
    })
    app.get("/api/users" ,(req,res) => {
     
      User.find({}).then(resp => console.log(resp.map((item) => {
        return {
          name: item.name,
          _id: item._id
        }
      })))
    })


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
