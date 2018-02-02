var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors')
var UserRegistration = require('./models/userRegistration')
var bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Connect to mongoose
var databaseConnectivity = mongoose.connection;
var mongoConnectivity = mongoose.connect('mongodb://localhost/Catering', function (error) {
    if (error) console.log(error);

    console.log("MongoDB Connection is Successful");
});

app.get("/", function (request, response) {
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

app.post('/getLogin', function (request, response) {
    databaseConnectivity.collection('UserRegistrations').find({ email: request.body.email, password: request.body.password }).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": "User is authenticated" })
            } else {
                response.json({ "response": "failure", "data": "Please enter correct Username or Password" })
            }
        }
    })
})
app.listen(8080)
console.log("Running on port 8080")