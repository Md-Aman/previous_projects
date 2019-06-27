
var userObject = require('./../models/user.js');
var testObject = require('./../models/test.js');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shikder0033@gmail.com',
        pass: 'heavenforbid55'
    }
});


exports.createNewUser = function (req, res) {
    let newUser = new userObject({
        first_name: req.body.FirstName,
        last_name: req.body.LastName,
        age: req.body.Age,
        email: req.body.Email
    });
    var password = Math.random().toString(36).slice(-8);
    newUser['password'] = password;

    newUser.save((err, result) => {
        if (err) {
            res.json({
                'code': 400,
                'message': 'Failed to sign up',
            });
        } else {
            var mailOptions = {
                from: 'foodhub@gmail.com',
                to: req.body.Email,
                subject: 'Foodhub - Signed up successful',
                html: '<p> Dear ' + req.body.FirstName + ',</p>' +
                    '<p> Your account has been created successfully. Please click <a href= "http://localhost:4200/login">here</a> here to continue.' +
                    '<p> Your password to access to the platforam is: ' + password +
                    '<p></p> <p></p>' +
                    '<p>Thank you,</p>' +
                    '<p>Foodhub Team</p>'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("email err", error);
                    res.json({
                        'code': 400,
                        'message': 'Failed to sign up',
                    });
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.json({
                        'code': 200,
                        'message': 'Signed up successfully. Please check your email to access to the platfoarm.',
                    });
                }
            });
        }
    })
};

exports.test = function (req, res) {
    // const post = new testObject({ first_name: "apple", last_name: "apple" });

    // post.save(function(err) {
    //   console.log(post.first_name); // some text (only the message field was set to be encrypted via options)
    //   console.log(post.last_name); // a9ad74603a91a2e97a803a367ab4e04d:93c64bf4c279d282deeaf738fabebe89
    //   console.log(post.__enc_first_name); // true
    // });

    // const name = "ubar";
    // const messageToSearchWith = new testObject({ name });
    // messageToSearchWith.encryptFieldsSync();
    // testObject.find({name: messageToSearchWith.name}, function(err, results){
    //     console.log("res :", results);
    //     res.json({
    //         "code": 200,
    //         'data': results
    //     })
    // });

 
    // var data = { title: "jkgjhkgkj", name : "s100" };


    // const messageToSave = new testObject(data);
    // messageToSave.save(
    //     function (err, result) {
    //         res.json({
    //             'code': 200,
    //             'data': result
    //         })
    //     }
    // );

    // const messageToSearchWith = new testObject({ name : req.body.title });
    // messageToSearchWith.encryptFieldsSync();
    // var query = {};
    // query.name = {
    //     $regex: messageToSearchWith.name,
    //     $options: "$i"
    // };

    // `messageToSearchWith.name` contains the encrypted string text
    // {name: messageToSearchWith.name}
    testObject.find().limit(10).skip(0).exec(function (err, data) {
        console.log("da :", data);
        res.json({
            'code': 200,
            'data': data
        })
    });


}

exports.login = function (req, res) {
    console.log("body :", req.body);
    if (req.body) {
        userObject.findOne({
            email: req.body.Email
        }, function (err, data) {
            if (err) {
                res.json({
                    'code': 400,
                    'message': "Something happend wrong. Please try again later."
                });
            } else {
                if (data) {
                    if (data.password == req.body.Password) {
                        res.json({
                            'code': 200,
                            'message': "Login successful",
                            'data': data
                        });
                    } else {
                        res.json({
                            'code': 400,
                            'message': "Password is incorrect.",
                            'data': data
                        });
                    }
                } else {
                    res.json({
                        'code': 400,
                        'message': "Email does not exist.",
                    });
                }
            }
        })
    }
};

exports.delete = function (req, res) {
    res.send("it is absolutely DELETE");
};
