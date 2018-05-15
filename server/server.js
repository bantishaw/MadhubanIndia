var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    UserRegistration = require('./models/userRegistration'),
    bodyParser = require('body-parser'),
    dateFormat = require('dateformat'),
    generator = require('generate-serial-number');

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
                response.json({ "response": "failure", "data": "An account already exists with this Email ID" })
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
                        user: 'freshPoolIndia@gmail.com',
                        pass: 'Aug@2017'
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
app.post('/getHomePageServiceMenu', function (request, response) {
    var homeArray = [];
    geocoder.reverse({ lat: request.body.latitude, lon: request.body.longitude }, function (error, geoResponse) {
       databaseConnectivity.collection('HomePageServiceMenu').find().toArray(function (error, result) {
            if (error) {
                console.log(error)
                response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
            } else {
                if (result.length > 0) {
                    result[0].HomeMenuService.map(function (individualObject) {
                      individualObject.collectionName.map(function (individualItem) {
                        if (individualItem.city === geoResponse[0].city) {
                          var collectionNameToShow = {
                            "img_path": individualObject.img_path,
                            "service_name": individualObject.service_name,
                            "collectionName": individualItem.collection
                          }
                          homeArray.push(collectionNameToShow)
                        }
                      })
                    })
                    response.json({ "response": "success", "data": homeArray })
                } else {
                    response.json({ "response": "failure", "data": "Database is inaccessable. Please try later" })
                }
            }
        })
    });
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

// Function Called when user clicks on Place order
app.post('/getAddtoCartData', function (request, response) {
    databaseConnectivity.collection('addToCart').find({ reference_email: request.body.reference_email }).toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length > 0) {
                var order = [];
                var product = {};
                result[0].order_descriptiion.map((object) => {
                    let product = {
                        "order_id": "#" + generator.generate(15),
                        "date_of_order_received": "",
                        "date_of_order_placing": dateFormat(request.body.timeStamp, " dS mmmm, yyyy"),
                        "product": object.product,
                        "description": object.description,
                        "rate": object.rate,
                        "quantity": object.quantity,
                        "particularProductPrice": object.rate * object.quantity,
                        "productPic": object.productPic,
                        "payment_mode": request.body.payment_mode,
                        "itemStatus": "Pending",
                        "UserAddress": request.body.UserAddress,
                        "payment_status": "Unpaid"
                    }
                    order.push(product)
                })
                let myCartObject = {
                    "uniqueKey" : generator.generate(20),
                    "date_of_order_placing": dateFormat(request.body.timeStamp, " dS mmmm, yyyy"),
                    "total_amount": result[0].total_amount,
                    "order_descriptiion": order
                };
                var adminObject = {
                    "reference_email": request.body.reference_email,
                    "customerName": request.body.customerName,
                    "date_of_order_placing": myCartObject.date_of_order_placing,
                    "total_amount": myCartObject.total_amount,
                    "UserAddress": request.body.UserAddress,
                    "userPhoneNumber": request.body.userPhoneNumber,
                    "uniqueKey": myCartObject.uniqueKey,
                    "order_descriptiion": order,
                }
                databaseConnectivity.collection('UserOrders').find({ reference_email: request.body.reference_email }).toArray(function (error, userOrderResult) {
                    if (error) {
                        throw error;
                    } else {
                        if (userOrderResult.length > 0) {
                            // Add to existing document
                            let filter = {
                                $push: {
                                    myOrders: {
                                        $each: [myCartObject]
                                    }
                                }
                            }
                            databaseConnectivity.collection('UserOrders').findOneAndReplace({ reference_email: request.body.reference_email }, filter, { returnOriginal: false }, function (error, result) {
                                if (error) {
                                    throw error;
                                } else {
                                    databaseConnectivity.collection('addToCart').remove({ reference_email: request.body.reference_email }, function (error, deleteUserCart) {
                                        if (error) {
                                            throw error;
                                        } else {
                                            //Deleted document from Add to Cart Collection
                                            console.log("Deleted document from Add to Cart Collection")

                                            var replacements = {
                                                customerName : userOrderResult[0].customerName,
                                                email : userOrderResult[0].reference_email,
                                                userAddress : myCartObject.order_descriptiion[0].UserAddress,
                                                dataOfOrder : myCartObject.date_of_order_placing,
                                                totalOrder : JSON.stringify(myCartObject.order_descriptiion),
                                                totalAmount : myCartObject.total_amount
                                            };
                                            var content = myCartObject.order_descriptiion.reduce(function(a, b) {
                                                return  a + '<tr><td>' + b.order_id + '</a></td><td>' + b.product + '</td><td>' + b.description + '</td><td>' + b.quantity + '</td><td>' + b.rate + '</td><td>' + b.particularProductPrice + '</td></tr>'; 
                                            
                                              }, '');
                                            let message = {
                                                to:  userOrderResult[0].reference_email,
                                                subject: 'Received Your Order – FreshPool',
                                                html: `<!DOCTYPE html>
                                                <html lang="en">
                                                
                                                <head>
                                                  <style>
                                                    @font-face {
                                                      font-family: SourceSansPro;
                                                      src: url(SourceSansPro-Regular.ttf);
                                                    }
                                                
                                                    .clearfix:after {
                                                      content: "";
                                                      display: table;
                                                      clear: both;
                                                    }
                                                
                                                    a {
                                                      color: #0087C3;
                                                      text-decoration: none;
                                                    }
                                                
                                                    body {
                                                      position: relative;
                                                      width: 21cm;
                                                      height: 29.7cm;
                                                      margin: 0 auto;
                                                      color: #555555;
                                                      background: #FFFFFF;
                                                      font-family: Arial, sans-serif;
                                                      font-size: 14px;
                                                      font-family: SourceSansPro;
                                                    }
                                                
                                                    header {
                                                      padding: 10px 0;
                                                      margin-bottom: 20px;
                                                      border-bottom: 1px solid #AAAAAA;
                                                    }
                                                
                                                    #logo {
                                                      float: left;
                                                      margin-top: 8px;
                                                      margin-left: -25px;
                                                    }
                                                
                                                    #logo img {
                                                      height: 70px;
                                                    }
                                                
                                                    #company {
                                                      float: right;
                                                      text-align: right;
                                                    }
                                                
                                                
                                                    #details {
                                                      margin-bottom: 50px;
                                                    }
                                                
                                                    #client {
                                                      padding-left: 6px;
                                                      border-left: 6px solid #0087C3;
                                                      float: left;
                                                    }
                                                
                                                    #client .to {
                                                      color: #777777;
                                                    }
                                                
                                                    h2.name {
                                                      font-size: 1.4em;
                                                      font-weight: normal;
                                                      margin: 0;
                                                    }
                                                
                                                    #invoice {
                                                      float: right;
                                                      text-align: right;
                                                    }
                                                
                                                    #invoice h1 {
                                                      color: #0087C3;
                                                      font-size: 2.4em;
                                                      line-height: 1em;
                                                      font-weight: normal;
                                                      margin: 0 0 10px 0;
                                                    }
                                                
                                                    #invoice .date {
                                                      font-size: 1.1em;
                                                      color: #777777;
                                                    }
                                                
                                                    table {
                                                      width: 100%;
                                                      border-collapse: collapse;
                                                      border-spacing: 0;
                                                      margin-bottom: 20px;
                                                    }
                                                
                                                    table th,
                                                    table td {
                                                      padding: 20px;
                                                      background: #EEEEEE;
                                                      text-align: center;
                                                      border-bottom: 1px solid #FFFFFF;
                                                    }
                                                
                                                    table th {
                                                      white-space: nowrap;
                                                      font-weight: normal;
                                                    }
                                                
                                                    table td {
                                                      text-align: right;
                                                    }
                                                
                                                    table td h3 {
                                                      color: #57B223;
                                                      font-size: 1.2em;
                                                      font-weight: normal;
                                                      margin: 0 0 0.2em 0;
                                                    }
                                                
                                                    table .no {
                                                      color: #FFFFFF;
                                                      background: #57B223;
                                                    }
                                                
                                                    table .desc {
                                                      text-align: left;
                                                    }
                                                
                                                    table .unit {
                                                      background: #DDDDDD;
                                                    }
                                                
                                                    table .qty {}
                                                
                                                    table .product {
                                                      background: #DDDDDD;
                                                    }
                                                
                                                    table .total {
                                                      background: #57B223;
                                                      color: #FFFFFF;
                                                    }
                                                
                                                    table td.unit,
                                                    table td.qty,
                                                    table td.total {
                                                      font-size: 1.2em;
                                                    }
                                                
                                                    table tbody tr:last-child td {
                                                      border: none;
                                                    }
                                                
                                                    table tfoot td {
                                                      padding: 10px 20px;
                                                      background: #FFFFFF;
                                                      border-bottom: none;
                                                      font-size: 1.2em;
                                                      white-space: nowrap;
                                                      border-top: 1px solid #AAAAAA;
                                                    }
                                                
                                                    table tfoot tr:first-child td {
                                                      border-top: none;
                                                    }
                                                
                                                    table tfoot tr:last-child td {
                                                      color: #57B223;
                                                      font-size: 1.4em;
                                                      border-top: 1px solid #57B223;
                                                
                                                    }
                                                
                                                    table tfoot tr td:first-child {
                                                      border: none;
                                                    }
                                                
                                                    #thanks {
                                                      font-size: 2em;
                                                      margin-bottom: 50px;
                                                    }
                                                
                                                    #notices {
                                                      padding-left: 6px;
                                                      border-left: 6px solid #0087C3;
                                                    }
                                                
                                                    #notices .notice {
                                                      font-size: 1.2em;
                                                    }
                                                
                                                    footer {
                                                      color: #777777;
                                                      width: 100%;
                                                      height: 30px;
                                                      position: absolute;
                                                      bottom: 0;
                                                      border-top: 1px solid #AAAAAA;
                                                      padding: 8px 0;
                                                      text-align: center;
                                                    }
                                                  </style>
                                                  <meta charset="utf-8">
                                                  <link rel="stylesheet" href="style.css" media="all" />
                                                </head>
                                                
                                                <body>
                                                  <header class="clearfix">
                                                    <div id="company">
                                                      <h2 class="name">FreshPool India</h2>
                                                      <div>No 44 KIADB LAYOUT, PARK ROAD, Electronic City Phase 2, Bangalore - 560100</div>
                                                      <div>+91 8961323449/ +91 9082450264</div>
                                                      <div>
                                                        <a href="mailto:freshPoolIndia@gmail.com">freshPoolIndia@gmail.com</a>
                                                      </div>
                                                    </div>
                                                    </div>
                                                  </header>
                                                  <main>
                                                    <div id="details" class="clearfix">
                                                      <div id="client">
                                                        <div class="to">INVOICE TO:</div>
                                                        <h2 class="name">`+ replacements.customerName + `</h2>
                                                        <div class="address">`+ replacements.userAddress + `</div>
                                                        <div class="email">
                                                          <a href="mailto:`+ replacements.email + `">` + replacements.email + `</a>
                                                        </div>
                                                      </div>
                                                      <div id="invoice">
                                                        <div class="date">Date of Order:`+ replacements.dataOfOrder + `</div>
                                                      </div>
                                                    </div>
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                      <thead>
                                                        <tr>
                                                          <th class="no">ORDER ID</th>
                                                          <th class="product">PRODUCT</th>
                                                          <th class="desc">DESCRIPTION</th>
                                                          <th class="unit">UNIT QUANTITY</th>
                                                          <th class="qty">RATE</th>
                                                          <th class="total">TOTAL</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>`+ content +
                                                    `
                                                      </tbody><tfoot>
                                                        <tr>
                                                          <td colspan="3"></td>
                                                          <td colspan="2">Subtotal</td>
                                                          <td>₹`+ replacements.totalAmount + `</td>
                                                        </tr>
                                                        <tr>
                                                          <td colspan="3"></td>
                                                          <td colspan="2">Delivery Charge</td>
                                                          <td>₹0</td>
                                                        </tr>
                                                        <tr>
                                                          <td colspan="3"></td>
                                                          <td colspan="2" style="text-transform : capitialize">Grand Total</td>
                                                          <td>₹`+ replacements.totalAmount + `</td>
                                                        </tr>
                                                      </tfoot>
                                                    </table>
                                                    <div id="thanks">Thank you!</div>
                                                    <div id="notices">
                                                      <div>NOTICE:</div>
                                                      <div class="notice">There will be no delivery charge for first 100 orders per user</div>
                                                    </div>
                                                  </main>
                                                  <footer>
                                                    Invoice was created on a computer and is valid without the signature and seal.
                                                  </footer>
                                                </body>
                                                
                                                </html>`
                                            };
                                            insertIntoAdminCollection(adminObject)
                                            sendmail(message);
                                            response.json({ "response": "success", "data": "Your order is successfully placed" })
                                        }
                                    })
                                }
                            })
                        } else {
                            // Create a new document
                            let insertObject = {
                                "reference_email": request.body.reference_email,
                                "customerName" : request.body.customerName,
                                "myOrders": [myCartObject]
                            }
                            databaseConnectivity.collection('UserOrders').insert(insertObject, function (error, newResult) {
                                if (error) {
                                    throw error
                                } else {
                                    databaseConnectivity.collection('addToCart').remove({ reference_email: request.body.reference_email }, function (error, deleteUserCart) {
                                        if (error) {
                                            throw error;
                                        } else {
                                            //Deleted document from Add to Cart Collection
                                            console.log("Deleted document from Add to Cart Collection")
                                            var replacements = {
                                                customerName : request.body.customerName,
                                                email : request.body.reference_email,
                                                userAddress : myCartObject.order_descriptiion[0].UserAddress,
                                                dataOfOrder : myCartObject.date_of_order_placing,
                                                totalOrder : JSON.stringify(myCartObject.order_descriptiion),
                                                totalAmount : myCartObject.total_amount
                                            };
                                            var content = myCartObject.order_descriptiion.reduce(function(a, b) {
                                                return  a + '<tr><td>' + b.order_id + '</a></td><td>' + b.product + '</td><td>' + b.description + '</td><td>' + b.quantity + '</td><td>' + b.rate + '</td><td>' + b.particularProductPrice + '</td></tr>'; 
                                            
                                              }, '');
                                            let message = {
                                                to: request.body.reference_email,
                                                subject: 'Received Your Order – FreshPool',
                                                html: `<!DOCTYPE html>
                                                <html lang="en">
                                                
                                                <head>
                                                  <style>
                                                    @font-face {
                                                      font-family: SourceSansPro;
                                                      src: url(SourceSansPro-Regular.ttf);
                                                    }
                                                
                                                    .clearfix:after {
                                                      content: "";
                                                      display: table;
                                                      clear: both;
                                                    }
                                                
                                                    a {
                                                      color: #0087C3;
                                                      text-decoration: none;
                                                    }
                                                
                                                    body {
                                                      position: relative;
                                                      width: 21cm;
                                                      height: 29.7cm;
                                                      margin: 0 auto;
                                                      color: #555555;
                                                      background: #FFFFFF;
                                                      font-family: Arial, sans-serif;
                                                      font-size: 14px;
                                                      font-family: SourceSansPro;
                                                    }
                                                
                                                    header {
                                                      padding: 10px 0;
                                                      margin-bottom: 20px;
                                                      border-bottom: 1px solid #AAAAAA;
                                                    }
                                                
                                                    #logo {
                                                      float: left;
                                                      margin-top: 8px;
                                                      margin-left: -25px;
                                                    }
                                                
                                                    #logo img {
                                                      height: 70px;
                                                    }
                                                
                                                    #company {
                                                      float: right;
                                                      text-align: right;
                                                    }
                                                
                                                
                                                    #details {
                                                      margin-bottom: 50px;
                                                    }
                                                
                                                    #client {
                                                      padding-left: 6px;
                                                      border-left: 6px solid #0087C3;
                                                      float: left;
                                                    }
                                                
                                                    #client .to {
                                                      color: #777777;
                                                    }
                                                
                                                    h2.name {
                                                      font-size: 1.4em;
                                                      font-weight: normal;
                                                      margin: 0;
                                                    }
                                                
                                                    #invoice {
                                                      float: right;
                                                      text-align: right;
                                                    }
                                                
                                                    #invoice h1 {
                                                      color: #0087C3;
                                                      font-size: 2.4em;
                                                      line-height: 1em;
                                                      font-weight: normal;
                                                      margin: 0 0 10px 0;
                                                    }
                                                
                                                    #invoice .date {
                                                      font-size: 1.1em;
                                                      color: #777777;
                                                    }
                                                
                                                    table {
                                                      width: 100%;
                                                      border-collapse: collapse;
                                                      border-spacing: 0;
                                                      margin-bottom: 20px;
                                                    }
                                                
                                                    table th,
                                                    table td {
                                                      padding: 20px;
                                                      background: #EEEEEE;
                                                      text-align: center;
                                                      border-bottom: 1px solid #FFFFFF;
                                                    }
                                                
                                                    table th {
                                                      white-space: nowrap;
                                                      font-weight: normal;
                                                    }
                                                
                                                    table td {
                                                      text-align: right;
                                                    }
                                                
                                                    table td h3 {
                                                      color: #57B223;
                                                      font-size: 1.2em;
                                                      font-weight: normal;
                                                      margin: 0 0 0.2em 0;
                                                    }
                                                
                                                    table .no {
                                                      color: #FFFFFF;
                                                      background: #57B223;
                                                    }
                                                
                                                    table .desc {
                                                      text-align: left;
                                                    }
                                                
                                                    table .unit {
                                                      background: #DDDDDD;
                                                    }
                                                
                                                    table .qty {}
                                                
                                                    table .product {
                                                      background: #DDDDDD;
                                                    }
                                                
                                                    table .total {
                                                      background: #57B223;
                                                      color: #FFFFFF;
                                                    }
                                                
                                                    table td.unit,
                                                    table td.qty,
                                                    table td.total {
                                                      font-size: 1.2em;
                                                    }
                                                
                                                    table tbody tr:last-child td {
                                                      border: none;
                                                    }
                                                
                                                    table tfoot td {
                                                      padding: 10px 20px;
                                                      background: #FFFFFF;
                                                      border-bottom: none;
                                                      font-size: 1.2em;
                                                      white-space: nowrap;
                                                      border-top: 1px solid #AAAAAA;
                                                    }
                                                
                                                    table tfoot tr:first-child td {
                                                      border-top: none;
                                                    }
                                                
                                                    table tfoot tr:last-child td {
                                                      color: #57B223;
                                                      font-size: 1.4em;
                                                      border-top: 1px solid #57B223;
                                                
                                                    }
                                                
                                                    table tfoot tr td:first-child {
                                                      border: none;
                                                    }
                                                
                                                    #thanks {
                                                      font-size: 2em;
                                                      margin-bottom: 50px;
                                                    }
                                                
                                                    #notices {
                                                      padding-left: 6px;
                                                      border-left: 6px solid #0087C3;
                                                    }
                                                
                                                    #notices .notice {
                                                      font-size: 1.2em;
                                                    }
                                                
                                                    footer {
                                                      color: #777777;
                                                      width: 100%;
                                                      height: 30px;
                                                      position: absolute;
                                                      bottom: 0;
                                                      border-top: 1px solid #AAAAAA;
                                                      padding: 8px 0;
                                                      text-align: center;
                                                    }
                                                  </style>
                                                  <meta charset="utf-8">
                                                  <link rel="stylesheet" href="style.css" media="all" />
                                                </head>
                                                
                                                <body>
                                                  <header class="clearfix">
                                                    <div id="company">
                                                      <h2 class="name">FreshPool India</h2>
                                                      <div>No 44 KIADB LAYOUT, PARK ROAD, Electronic City Phase 2, Bangalore - 560100</div>
                                                      <div>+91 8961323449/ +91 9082450264</div>
                                                      <div>
                                                        <a href="mailto:freshPoolIndia@gmail.com">freshPoolIndia@gmail.com</a>
                                                      </div>
                                                    </div>
                                                    </div>
                                                  </header>
                                                  <main>
                                                    <div id="details" class="clearfix">
                                                      <div id="client">
                                                        <div class="to">INVOICE TO:</div>
                                                        <h2 class="name">`+ replacements.customerName + `</h2>
                                                        <div class="address">`+ replacements.userAddress + `</div>
                                                        <div class="email">
                                                          <a href="mailto:`+ replacements.email + `">` + replacements.email + `</a>
                                                        </div>
                                                      </div>
                                                      <div id="invoice">
                                                        <div class="date">Date of Order:`+ replacements.dataOfOrder + `</div>
                                                      </div>
                                                    </div>
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                      <thead>
                                                        <tr>
                                                          <th class="no">ORDER ID</th>
                                                          <th class="product">PRODUCT</th>
                                                          <th class="desc">DESCRIPTION</th>
                                                          <th class="unit">UNIT QUANTITY</th>
                                                          <th class="qty">RATE</th>
                                                          <th class="total">TOTAL</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>`+ content +
                                                    `
                                                      </tbody><tfoot>
                                                        <tr>
                                                          <td colspan="3"></td>
                                                          <td colspan="2">Subtotal</td>
                                                          <td>₹`+ replacements.totalAmount + `</td>
                                                        </tr>
                                                        <tr>
                                                          <td colspan="3"></td>
                                                          <td colspan="2">Delivery Charge</td>
                                                          <td>₹0</td>
                                                        </tr>
                                                        <tr>
                                                          <td colspan="3"></td>
                                                          <td colspan="2" style="text-transform : capitialize">Grand Total</td>
                                                          <td>₹`+ replacements.totalAmount + `</td>
                                                        </tr>
                                                      </tfoot>
                                                    </table>
                                                    <div id="thanks">Thank you!</div>
                                                    <div id="notices">
                                                      <div>NOTICE:</div>
                                                      <div class="notice">There will be no delivery charge for first 100 orders per user</div>
                                                    </div>
                                                  </main>
                                                  <footer>
                                                    Invoice was created on a computer and is valid without the signature and seal.
                                                  </footer>
                                                </body>
                                                
                                                </html>`
                                            };
                                            insertIntoAdminCollection(adminObject)
                                            sendmail(message);
                                            response.json({ "response": "success", "data": "Your order is successfully placed" })
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            } else {
                response.json({ "response": "failure", "data": "Your Shopping cart is empty" })
            }
        }
    })
})

var insertIntoAdminCollection = function(adminObject){
    databaseConnectivity.collection('adminCollection').insert(adminObject, function (error, newResult) {
        if(error){
            throw error;
        }else{
            console.log({ "response": "success", "data": "Order sucessfully sent to Admin" })
        }
    })
}
// Function to deactivate the User account
app.post('/deactivateUserAccount', function (request, response) {
    databaseConnectivity.collection('UserRegistrations').remove( request.body, function (error, deleteUserAccount) {
        if (error) {
            throw error;
        } else {
            console.log("User Account is deleted")
            response.json({ "response": "success", "data": "Your Account is successfully deactivated. Please wait while you are getting redirected..." })
        }
    })
})

//Cancel paticular order on basis of its email , Order Id (date of order placing::not using now in logic)
app.post('/cancelOrder', function (request, response) {
    let filter = { "myOrders": { $elemMatch: { "uniqueKey": request.body.uniqueKey } } }
    databaseConnectivity.collection('UserOrders').find({ "reference_email": request.body.reference_email }, filter).toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length > 0) {
                var checkProduct = result[0].myOrders[0].order_descriptiion.map(function (item) { return item.order_id; }).indexOf(request.body.order_id)
                if (checkProduct !== -1) {
                    result[0].myOrders[0].order_descriptiion[checkProduct].itemStatus = request.body.itemStatus
                    result[0].myOrders[0].order_descriptiion[checkProduct].date_of_order_received = dateFormat(request.body.timeStamp, " dS mmmm, yyyy")
                    var newUpdatedObject = {
                        "uniqueKey": request.body.uniqueKey,
                        "date_of_order_placing": result[0].myOrders[0].date_of_order_placing,
                        "total_amount": result[0].myOrders[0].total_amount - request.body.particularProductPrice,
                        "order_descriptiion": result[0].myOrders[0].order_descriptiion
                    }
                    databaseConnectivity.collection('UserOrders').find({ "reference_email": request.body.reference_email }).toArray(function (error, findResult) {
                        if (error) {
                            throw error;
                        } else {
                            var newMyOrderArray = [];
                            var newCheckProduct = findResult[0].myOrders.map(function (item) { return item.uniqueKey; }).indexOf(request.body.uniqueKey)
                            findResult[0].myOrders[newCheckProduct] = newUpdatedObject
                            newMyOrderArray = findResult[0].myOrders
                            databaseConnectivity.collection('UserOrders').findOneAndReplace({ "reference_email": request.body.reference_email }, { $set: { myOrders: newMyOrderArray } }, { returnOriginal: false }, function (error, updateResult) {
                                if (error) {
                                    throw error
                                } else {
                                    databaseConnectivity.collection('adminCollection').find({ "uniqueKey": request.body.uniqueKey }).toArray(function (error, adminResult) {
                                        if (error) {
                                            console.log(error)
                                            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
                                        } else {
                                            if (adminResult.length > 0) {
                                                var updateAdminOrderPointer = adminResult[0].order_descriptiion.map(function (item) { return item.order_id; }).indexOf(request.body.order_id)
                                                adminResult[0].order_descriptiion[updateAdminOrderPointer].itemStatus = request.body.itemStatus
                                                adminResult[0].total_amount = adminResult[0].total_amount - request.body.particularProductPrice
                                                adminResult[0].order_descriptiion[updateAdminOrderPointer].date_of_order_received = dateFormat(request.body.timeStamp, " dS mmmm, yyyy")
                                                databaseConnectivity.collection('adminCollection').findOneAndReplace({ "uniqueKey": request.body.uniqueKey }, { $set: { total_amount: adminResult[0].total_amount, order_descriptiion: adminResult[0].order_descriptiion } }, { returnOriginal: false }, function (error, updateAdminResult) {
                                                    if (error) {
                                                        console.log(error)
                                                        response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
                                                    } else {
                                                        response.json({ "response": "success", "data": "Your Order has been cancelled", "timeofCancel": dateFormat(request.body.timeStamp, " dS mmmm, yyyy") })
                                                    }
                                                })
                                            } else {
                                                response.json({ "response": "failure", "data": "Your order is processed for cancellation" })
                                            }
                                        }
                                    })                           
                                }
                            })
                        }
                    })
                }
            } else {
                response.json({ "response": "failure", "data": "User Not found" })
            }
        }
    })
})

// Function to get newly orders placed to admin page 
app.get('/getAdminNewOrders', function (request, response) {
    databaseConnectivity.collection('adminCollection').find().toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": result })
            } else {
                response.json({ "response": "failure", "data": "Welcome Admin. No Orders placed yet" })
            }
        }
    })
})

// Function to manage the order from Admin Account
app.post('/updateUserOrder', function (request, response) {
    let filter = { "myOrders": { $elemMatch: { "uniqueKey": request.body.uniqueKey } } }
    databaseConnectivity.collection('UserOrders').find({ "reference_email": request.body.emailToBeSearched }, filter).toArray(function (error, result) {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                var checkProduct = result[0].myOrders[0].order_descriptiion.map(function (item) { return item.order_id; }).indexOf(request.body.orderID)
                if (checkProduct !== -1) {
                    result[0].myOrders[0].order_descriptiion[checkProduct].itemStatus = request.body.statusToBeUpdated
                    if (request.body.statusToBeUpdated !== 'Cancelled' && request.body.statusToBeUpdated !== 'Delivered') {
                        var newUpdatedObject = {
                            "uniqueKey": request.body.uniqueKey,
                            "date_of_order_placing": result[0].myOrders[0].date_of_order_placing,
                            "total_amount": result[0].myOrders[0].total_amount,
                            "order_descriptiion": result[0].myOrders[0].order_descriptiion
                        }
                    } else if (request.body.statusToBeUpdated === 'Cancelled') {
                        result[0].myOrders[0].order_descriptiion[checkProduct].date_of_order_received = dateFormat(request.body.timeStamp, " dS mmmm, yyyy")
                        var newUpdatedObject = {
                            "uniqueKey": request.body.uniqueKey,
                            "date_of_order_placing": result[0].myOrders[0].date_of_order_placing,
                            "total_amount": result[0].myOrders[0].total_amount - request.body.particularProductPrice,
                            "order_descriptiion": result[0].myOrders[0].order_descriptiion
                        }
                    } else if (request.body.statusToBeUpdated === 'Delivered') {
                        result[0].myOrders[0].order_descriptiion[checkProduct].date_of_order_received = dateFormat(request.body.timeStamp, " dS mmmm, yyyy")
                        var newUpdatedObject = {
                            "uniqueKey": request.body.uniqueKey,
                            "date_of_order_placing": result[0].myOrders[0].date_of_order_placing,
                            "total_amount": result[0].myOrders[0].total_amount,
                            "order_descriptiion": result[0].myOrders[0].order_descriptiion
                        }
                    }
                    databaseConnectivity.collection('UserOrders').find({ "reference_email": request.body.emailToBeSearched }).toArray(function (error, findResult) {
                        if (error) {
                            throw error;
                        } else {
                            var newMyOrderArray = [];
                            var newCheckProduct = findResult[0].myOrders.map(function (item) { return item.uniqueKey; }).indexOf(request.body.uniqueKey)
                            findResult[0].myOrders[newCheckProduct] = newUpdatedObject
                            newMyOrderArray = findResult[0].myOrders
                            databaseConnectivity.collection('UserOrders').findOneAndReplace({ "reference_email": request.body.emailToBeSearched }, { $set: { myOrders: newMyOrderArray } }, { returnOriginal: false }, function (error, updateResult) {
                                if (error) {
                                    throw error
                                } else {
                                    databaseConnectivity.collection('adminCollection').find({ "uniqueKey": request.body.uniqueKey }).toArray(function (error, result) {
                                        if (error) {
                                            console.log(error)
                                            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
                                        } else {
                                            if (result.length > 0) {
                                                var updateAdminOrderPointer = result[0].order_descriptiion.map(function (item) { return item.order_id; }).indexOf(request.body.orderID)
                                                if (request.body.statusToBeUpdated !== 'Cancelled' && request.body.statusToBeUpdated !== 'Delivered') {
                                                    result[0].order_descriptiion[updateAdminOrderPointer].itemStatus = request.body.statusToBeUpdated
                                                } else {
                                                    result[0].order_descriptiion[updateAdminOrderPointer].itemStatus = request.body.statusToBeUpdated
                                                    result[0].total_amount = result[0].total_amount - request.body.particularProductPrice
                                                    result[0].order_descriptiion[updateAdminOrderPointer].date_of_order_received = dateFormat(request.body.timeStamp, " dS mmmm, yyyy")
                                                }
                                                databaseConnectivity.collection('adminCollection').findOneAndReplace({ "uniqueKey": request.body.uniqueKey }, { $set: { total_amount: result[0].total_amount, order_descriptiion: result[0].order_descriptiion } }, { returnOriginal: false }, function (error, updateAdminResult) {
                                                    if (error) {
                                                        console.log(error)
                                                        response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
                                                    } else {
                                                        response.json({ "response": "success", "data": `Order is ${request.body.statusToBeUpdated}`, "dataTobeShown": updateAdminResult.value })
                                                    }
                                                })
                                            } else {
                                                response.json({ "response": "failure", "data": "Welcome Admin. No Orders placed yet" })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    response.json({ "response": "failure", "data": "Order Not found" })
                }
            } else {
                response.json({ "response": "failure", "data": "User Not found" })
            }
        }
    })
})

// Function to display the Feedback from user
app.get('/getFeedBack', function (request, response) {
    databaseConnectivity.collection('Feedback').find().toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": result })
            } else {
                response.json({ "response": "failure", "data": "Welcome Admin. No Orders placed yet" })
            }
        }
    })
})

// Function to display contact us from user
app.get('/getUserListToWhomeWeHavetoContact', function (request, response) {
    databaseConnectivity.collection('contactCustomerForQuery').find().toArray(function (error, result) {
        if (error) {
            console.log(error)
            response.json({ "response": "failure", "data": "Please check your Interent connection and try again" })
        } else {
            if (result.length > 0) {
                response.json({ "response": "success", "data": result })
            } else {
                response.json({ "response": "failure", "data": "Welcome Admin. No Orders placed yet" })
            }
        }
    })
})

app.listen(8080)
console.log("Running on port 8080") 