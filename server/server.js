var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    UserRegistration = require('./models/userRegistration'),
    bodyParser = require('body-parser');

const nodemailer = require('nodemailer'),
    fs = require('fs');
    //busboyBodyParser = require('busboy-body-parser');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
//app.use(busboyBodyParser({ limit: '10mb' }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


//Connect to mongoose
var databaseConnectivity = mongoose.connection;
var mongoDbUrl = 'mongodb://localhost/Catering';
mongoose.Promise = global.Promise;
var mongoConnectivity = mongoose.connect(mongoDbUrl, { useMongoClient: true ,})
    .then(() => {
        console.log(`MongoDB is connected to URL ${mongoDbUrl}`)
    }).catch((error) =>{
        throw error;
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
                if (request.body.action) {
                    var OTP = Math.floor(1000 + Math.random() * 9000);
                    databaseConnectivity.collection('UserRegistrations').findOneAndReplace({ email: request.body.email }, { $set: { oneTimePassword: OTP } }, { returnOriginal: false }, function (error, newResult) {
                        if (error) {
                            throw error;
                        } else {
                            // Preparing message object to be send in send mail function
                            let message = {
                                to: result[0].name + '<' + result[0].email + '>',
                                subject: 'One time password to reset account',
                                html:
                                    '<p>OTP for your login : ' + newResult.value.oneTimePassword + '. Please use this One time password to reset your password<br/></p>',
                            };
                            // send mail function is being called here to send mail with OTP for users to login
                            sendmail(message)
                            response.json({ "response": "success", data: "Email sent successfully" })
                        }
                    })
                } else {
                    databaseConnectivity.collection('UserRegistrations').find({ email: request.body.email }).toArray(function (error, OtpVerification) {
                        if (error) {
                            throw error;
                        } else {
                            if (OtpVerification[0].oneTimePassword == request.body.otp) {
                                response.json({ "response": "success", data: "OTP verified successfully." })
                                databaseConnectivity.collection('UserRegistrations').findOneAndReplace({ email: request.body.email }, { $set: { oneTimePassword: "" } }, { returnOriginal: false }, function (error, removedOtpResult) {
                                    if (error) {
                                        throw error;
                                    } else {
                                        console.log("Removed One time Password from Database since otp matched. Now user will go to reset Password page")
                                    }
                                })
                            } else {
                                response.json({ "response": "failure", data: "Incorrect OTP. Please enter correct otp" })
                            }
                        }
                    })
                }
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

app.post('/getCategoryList', function (request, response) {
    databaseConnectivity.collection('CategoryList').find().toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": result })
            } else {
                response.json({ "response": "failure", "data": "Please enter correct Username or Password" })
            }
        }
    })
})
app.listen(8080)
console.log("Running on port 8080")