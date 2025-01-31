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
  name: { type: String, required: true},
  description: { type: String }, 
  duration: { type: Number }, 
  date: { type:String}
  
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
     
        User.find({}).then(resp => {
            let arr = resp.map((item) => {
                return {
                    username: item.name,
                    _id: item._id.toHexString()
                }
            })
            console.log(arr)
            res.send(arr)
        }).catch(err => console.log(err))
    })


    app.post("/api/users/:_id/exercises",(req,res) => {
        let id = req.params._id
        let description = req.body.description
        let duration = req.body.duration
        let date ;
        if(new Date(req.body.date) instanceof Date && !isNaN(new Date(req.body.date))){

           date =  new Date(req.body.date)
        }else{
            date = new Date()
        }
        User.findByIdAndUpdate(
            {_id: id},
            {
                description: description,
                duration: duration,
                date: date,
            }, 
            { new: true,runValidators: true  }
        ).then((response) => {
            res.send(response)
        }).catch((err) => console.log(err))
      
    })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
