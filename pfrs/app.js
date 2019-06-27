// Modules
var express = require("express");
var mongoose = require("mongoose");
// var bodyparser = require("body-parser");
var cors = require("cors");

// core modules
var path = require("path");

/*................................*/
const app = express();
const shared = require("./routes/shared");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/shared", shared);

mongoose.connect('mongodb://localhost:27017/pfrs', { useNewUrlParser: true });

//check connection
mongoose.connection.on('connected',() =>{
    console.log("Connected to Database");
});

mongoose.connection.on('error',(err) =>{
    if(err){
        console.log("Error in Database connection :" + err);
    }
});


app.listen(3000, ()=>{
    console.log("server started test");
})
