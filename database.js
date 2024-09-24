const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const port = 341

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://127.0.0.1:27017/students')
const db = mongoose.connection
db.once('open', () =>{
    console.log("Mongodb connection successfull")
})

const userSchema = new mongoose.Schema({
    fname: String, lname: String,
    email: String, ID: Number, phone:Number, password:String
  })

  const Users = mongoose.model("data", userSchema)


app.get('/', (req, res) => {
    
    res.sendFile(path.join(__dirname,'form.html'))
})

app.post('/post', async (req, res) => {
    const {fname, lname, email, ID, phone,password} = req.body
    const user = new Users ({
        fname,
        lname,
        email,
        ID,
        phone,
        password
    })

    await user.save()
    console.log(user)
    res.send("Form submitted successfully")
})

app.listen(port, () =>{

    console.log("Server started")
})