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
const nodemailer = require('nodemailer');

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

app.post('/newUserSignUp', function (request, response) {
    databaseConnectivity.collection('UserRegistrations').find({ email: request.body.email }).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                response.json({ "response": "failure", "data": result[0].name + " has already an account with us" })
            } else {
                databaseConnectivity.collection('UserRegistrations').insert(request.body, function (error, newResult) {
                    if (error) {
                        throw error;
                    } else {
                        // prepearing message object to be send in send mail function
                        let message = {
                            to: request.body.name + '<' + request.body.email + '>',
                            subject: 'Welcome to AB Catering India',
                             html:
                                 '<p>We are looking forward to assist you to find the best Catering. To avail our best services , Please login now with your credentials. <br/></p>',
                        };
                        // Activating send mail function to send mail to new users
                        sendmail(message);
                        response.json({ "response": "success", "data": "User added successfully" })
                    }
                })
            }
        }
    })
})

app.post('/forgotPassword', function (request, response) {
    databaseConnectivity.collection('UserRegistrations').find({ email: request.body.email }).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                //var currentTime = Date.now();
                var OTP = Math.floor(1000 + Math.random() * 9000);
                databaseConnectivity.collection('UserRegistrations').findOneAndUpdate(request.body, { $set: { oneTimePassword: OTP } }, function (error, newResult) {
                    if (error) {
                        throw error;
                    } else {
                        // Preparing message object to be send in send mail function
                        let message = {
                            to: result[0].name + '<bantishaw8@live.com>',
                            subject: 'One time password to reset account',
                             html:
                                 '<p>OTP for your login : ' + result[0].oneTimePassword + '. Please use this One time password to reset your password<br/></p>',
                        };
                        // send mail function is being called here to send mail with OTP for users to login
                        console.log("message",message)
                        sendmail(message)
                        response.json({ "response": "success", data: "Email sent successfully" })
                    }
                })
            } else {
                response.json({ "response": "failure", "data": "E-Mail Id does not exist. Please enter correct E-mail Id" })
            }
        }
    })
})

var sendmail = function (message) {
    // using Promises to make sure all asynchronous call should run properly
    return new Promise(function (resolve, reject) {
        nodemailer.createTestAccount((err, account) => {
            if (err) {
                console.error('Failed to create account');
                console.error(err);
                reject(err)
                return process.exit(1);
            }
            console.log('Credentials obtained, sending message...');
            let transporter = nodemailer.createTransport(
                {
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'bantitheforce@gmail.com',
                        pass: 'Mylockbox@123'
                    },
                    logger: false,
                    debug: false // include SMTP traffic in the logs
                },
                {
                    from: 'AB Catering India <no-reply@CateringIndia.com>',
                }
            );
            transporter.sendMail(message, (error, info) => {
                if (error) {
                    console.log('Error occurred');
                    console.log(error.message);
                    reject(error)
                    return process.exit(1);
                }
                console.log('Message sent successfully!');
                resolve("success")
                transporter.close();
            });
        });
    })
}
app.listen(8080)
console.log("Running on port 8080")