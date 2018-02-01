var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var UserRegistration = require('./models/userRegistration')

//Connect to mongoose
var databaseConnectivity = mongoose.connection;
var mongoConnectivity = mongoose.connect('mongodb://localhost/Catering', function(error){
    if(error) console.log(error);

        console.log("MongoDB Connection is Successful");
});

app.get("/", function(request, response){
    response.send('Hello User. come back later');
})

app.get('/userRegistration', function (request, response) {
    UserRegistration.getUserRegistration(function (error, users) {
        if (error) {
            throw error;
        } else {
            response.json(users)
        }
    })
})
app.listen(8080)
console.log("Running on port 8080")