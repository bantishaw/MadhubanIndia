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
var mongoDbUrl = 'mongodb://freshpoolIndia:Richman123@cluster0-shard-00-00-ahbez.mongodb.net:27017,cluster0-shard-00-01-ahbez.mongodb.net:27017,cluster0-shard-00-02-ahbez.mongodb.net:27017/freshPool?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
mongoose.Promise = global.Promise;
var mongoConnectivity = mongoose.connect(mongoDbUrl, { useMongoClient: true, })
    .then(() => {
        console.log(`MongoDB is connected to URL ${mongoDbUrl}`)
    }).catch((error) => {
        throw error;
    });

    
//Google API settings to get realtime User Address
var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyD_HZNpovLkkJ5ZBuo55hWkQhSw97TSb8Q', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);

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

//method to check the login details of a user
app.post('/getLogin', function (request, response) {
    databaseConnectivity.collection('UserRegistrations').find({ email: request.body.email, password: request.body.password }).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": "User is authenticated", "settingsInformation": result })
            } else {
                response.json({ "response": "failure", "data": "Please enter correct Username or Password" })
            }
        }
    })
})

// method to store user details on first sign up
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
                            subject: 'Welcome to FreshPool India',
                            html:
                                '<p>We are looking forward to assist you to find the best Catering. To avail our best services , Please login now with your credentials. <br/></p>',
                        };
                        // Activating send mail function to send mail to new users
                        sendmail(message);
                        response.json({ "response": "success", "data": "User added successfully", "settingsInformation": [request.body] })
                    }
                })
            }
        }
    })
})


//method for forgot password page
app.post('/forgotPassword', function (request, response) {
    databaseConnectivity.collection('UserRegistrations').find({ email: request.body.email }).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                if (request.body.action === 1) {
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
                } else if (request.body.action === 2) {
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
                } else {
                    databaseConnectivity.collection('UserRegistrations').find({ email: request.body.email }).toArray(function (error, changePasswordResult) {
                        if (error) {
                            throw error;
                        } else {
                            databaseConnectivity.collection('UserRegistrations').findOneAndReplace({ email: request.body.email }, { $set: { password: request.body.password } }, { returnOriginal: false }, function (error, removedOtpResult) {
                                if (error) {
                                    throw error;
                                } else {
                                    response.json({ "response": "success", "data": "Password is changed successfully" })
                                }
                            })
                        }
                    })
                }
            } else {
                response.json({ "response": "failure", "data": "E-Mail Id does not exist. Please enter correct E-mail Id" })
            }
        }
    })
})


//function to activate send mail function
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
                    from: 'FreshPool India <no-reply@CateringIndia.com>',
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


//method to change the password of a user
app.post('/saveNewSettingsPassword', function (request, response) {
    databaseConnectivity.collection('UserRegistrations').findOneAndReplace({ email: request.body.email }, { $set: { password: request.body.password } }, { returnOriginal: false }, function (error, result) {
        if (error) {
            throw error;
        } else {
            response.json({ "response": "success", "data": "New Password is changed successfully" })
        }
    })
})

// method to store the feedback in the Feedback collection
app.post('/submitFeedback', function (request, response) {
    databaseConnectivity.collection('Feedback').insert(request.body, function (error, newResult) {
        if (error) {
            response.json({ "response": "failure", "data": "Database is unreachable , Please try again by refreshing" })
            throw error;
        } else {
            response.json({ "response": "success", "data": "Thank you for sending your feedback" })
        }
    })
})

//get the contact us collection for the user to fill in
app.post('/contactUs', function (request, response) {
    databaseConnectivity.collection('contactCustomerForQuery').insert(request.body, function (error, newResult) {
        if (error) {
            response.json({ "response": "failure", "data": "Database is unreachable , Please try again by refreshing" })
            throw error;
        } else {
            response.json({ "response": "success", "data": "Thanks you for contacting us. Our executive will get back to you within 24 hours" })
        }
    })
})


//get all the orders of a partcular user
app.post('/getMyOrders', function (request, response) {
    databaseConnectivity.collection('UserOrders').find(request.body).toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": result })
            } else {
                response.json({ "response": "failure", "data": "No orders placed yet" })
            }
        }
    })
})


// get Details of About Us page
app.get('/getAboutUsMethod', function (request, response) {
    databaseConnectivity.collection('AboutUsPage').find().toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": result })
            } else {
                response.json({ "response": "failure", "data": "Not able to access this page. Please try later" })
            }
        }
    })
})

//get Menu service list of Home page
app.get('/getHomePageServiceMenu', function (request, response) {
    databaseConnectivity.collection('HomePageServiceMenu').find().toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": result })
            } else {
                response.json({ "response": "failure", "data": "Database is inaccessable. Please try later" })
            }
        }
    })
})

//get path of images stored in mongoDB
app.get('/getHomePageSlidingImages', function (request, response) {
    databaseConnectivity.collection('HomePageSlidingImages').find().toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": result })
            } else {
                response.json({ "response": "failure", "data": "Database is inaccessable. Please try later" })
            }
        }
    })
})

//method to get the Fruits data from FruitsCollecton
app.post('/getSubMenuCollection', function (request, response) {
    databaseConnectivity.collection(request.body.collectionName).find().toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": result })
            } else {
                response.json({ "response": "failure", "data": "This service is not started yet" })
            }
        }
    })
})

app.post('/addToCart', function (request, response) {
    databaseConnectivity.collection('addToCart').find({ reference_email: request.body.reference_email }).toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length) {
                // updating the exisitng object
                // Making the new order_description array
                let orderArray = [];
                orderArray = result[0].order_descriptiion;
                if (orderArray.length !== 0) {
                    var checkProduct = orderArray.map(function (item) { return item.product; }).indexOf(request.body.order_descriptiion[0].product)
                    if (checkProduct !== -1) {
                        orderArray[checkProduct].quantity = parseInt(orderArray[checkProduct].quantity) + request.body.order_descriptiion[0].quantity
                    } else {
                        orderArray.push(request.body.order_descriptiion[0])
                    }
                } else {
                    orderArray.push(request.body.order_descriptiion[0])
                }
                let newAmount = result[0].total_amount + request.body.total_amount
                // making the new Object to be pushed in Database
                var addToExistingObject = {
                    "reference_email": request.body.reference_email,
                    "order_descriptiion": orderArray,
                    "total_amount": newAmount
                }
                databaseConnectivity.collection('addToCart').findOneAndReplace({ reference_email: request.body.reference_email }, addToExistingObject, { returnOriginal: false }, function (error, updatedResult) {
                    if (error) {
                        throw error;
                    } else {
                        response.json({ "response": "success", "data": "Items added to cart" })
                    }
                })
            } else {
                console.log("add to cart is empty")
                databaseConnectivity.collection('addToCart').insert(request.body, function (error, newResult) {
                    if (error) {
                        console.log(error)
                        response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
                    } else {
                        response.json({ "response": "success", "data": "Items added to cart" })
                    }
                })
            }

        }

    })
})

app.post('/queryCartLength', function (request, response) {
    databaseConnectivity.collection('addToCart').find({ reference_email: request.body.reference_email }).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length) {
                response.json({
                    "response": "success", "length": result[0].order_descriptiion.length,
                    "data": result
                })
            } else {
                response.json({ "response": "failure", "message": "Your Shopping Cart is empty" })
            }
        }
    })
})

app.post('/removeItemFromCart', function (request, response) {
    databaseConnectivity.collection('addToCart').find({ reference_email: request.body.reference_email }).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length) {
                let removeIndex = result[0].order_descriptiion.map(function (item) { return item.product; }).indexOf(request.body.order_descriptiion.product);
                result[0].order_descriptiion.splice(removeIndex, 1);
                let updatedAmount = result[0].total_amount - (request.body.order_descriptiion.quantity * request.body.order_descriptiion.rate);
                let updateCartObject = {
                    "reference_email": request.body.reference_email,
                    "order_descriptiion": result[0].order_descriptiion,
                    "total_amount": updatedAmount
                }
                databaseConnectivity.collection('addToCart').findOneAndReplace({ reference_email: request.body.reference_email }, updateCartObject, { returnOriginal: false }, function (error, updatedResult) {
                    if (error) {
                        throw error;
                    } else {
                        response.json({ "response": "success", "data": [updatedResult.value], "status": `Successfully removed ${request.body.order_descriptiion.product} from your cart` })
                    }
                })
            }
        }
    })
})

app.post('/changeQuantityItemCart', function (request, response) {
    databaseConnectivity.collection('addToCart').find({ reference_email: request.body.reference_email }).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length) {
                let getPosition = result[0].order_descriptiion.map(function (item) { return item.product; }).indexOf(request.body.order_descriptiion.product);
                let OldItemAmount = (result[0].order_descriptiion[getPosition].quantity * result[0].order_descriptiion[getPosition].rate)
                let OldTotalAmount = result[0].total_amount - OldItemAmount;

                // Replacing the old item with the new one from request
                result[0].order_descriptiion[getPosition] = request.body.order_descriptiion
                let newItemAmount = (request.body.order_descriptiion.quantity * request.body.order_descriptiion.rate)
                let updatedAmount = OldTotalAmount + newItemAmount
                let updateCartObject = {
                    "reference_email": request.body.reference_email,
                    "order_descriptiion": result[0].order_descriptiion,
                    "total_amount": updatedAmount
                }
                databaseConnectivity.collection('addToCart').findOneAndReplace({ reference_email: request.body.reference_email }, updateCartObject, { returnOriginal: false }, function (error, updatedResult) {
                    if (error) {
                        throw error;
                    } else {
                        response.json({ "response": "success", "data": [updatedResult.value], "status": `You've changed ${request.body.order_descriptiion.product} quantity to ${request.body.order_descriptiion.quantity}` })
                    }
                })
            }
        }
    })
})


app.post('/getRealTimeUserAddress', function (request, response) {
    geocoder.reverse({ lat: request.body.latitude, lon: request.body.longitude }, function (error, result) {
        response.json({ "response": "success", "googleResponse": result })
    });
})

app.post('/updateAddress', function (request, response) {
    console.log(request.body)
    databaseConnectivity.collection('UserRegistrations').find({ email: request.body.email }).toArray(function (error, seeUserResult) {
        if (error) {
            throw error;
        } else {
            if (seeUserResult.length > 0) {
                databaseConnectivity.collection('UserRegistrations').findOneAndReplace({ email: request.body.email }, { $set: { address: request.body.address } }, { returnOriginal: false }, function (error, updatedAddressResult) {
                    if (error) {
                        throw error;
                    } else {
                        response.json({ "response": "success", "data": updatedAddressResult.value })
                    }
                })
            }
        }
    })
})

app.post('/reteiveaddressfromDatabase', function (request, response) {
    databaseConnectivity.collection('UserRegistrations').find({ email: request.body.email }).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": result })
            } else {
                response.json({ "response": "failure", "data": "No user exits with this email" })
            }
        }
    })
})

app.listen(8080)
console.log("Running on port 8080") 