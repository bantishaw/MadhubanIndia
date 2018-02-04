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
    console.log(Date.now())
    console.log(Math.random())
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

app.post('/newUserSignUp', function (request, response) {
    databaseConnectivity.collection('UserRegistrations').find({ email: request.body.email }).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                response.json({ "response": "failure", "data": result[0].name + " has already an account with us" })
            } else {
                databaseConnectivity.collection('UserRegistrations').insert(request.body, function (error, result) {
                    if (error) {
                        throw error;
                    } else {
                        response.json({ "response": "success", "data": "User added successfully" })
                    }
                })
            }
        }
    })
})

app.post('/forgotPassword', function (request,response) {
    databaseConnectivity.collection('UserRegistrations').find({email: request.body.email}).toArray(function (error,result) {
        if (error) {
          throw error;
        } else {
          if (result.length > 0) {
            //var currentTime = Date.now();
            var OTP = Math.floor(1000 + Math.random() * 9000);
            databaseConnectivity.collection('UserRegistrations').findOneAndUpdate(request.body, {$set : {oneTimePassword : OTP }}, function (error, result) {
                if(error){
                    throw error;
                }else{
                    response.json({"response" : "success",data : "Email sent successfully"})

                }
            })
          }else{
              response.json({ "response": "failure", "data": "E-Mail Id does not exist. Please enter correct E-mail Id" })
          }
          
        }

    })
})

app.listen(8080)
console.log("Running on port 8080")