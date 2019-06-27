/**
 * Express Server Handler
 * app.js
 */

var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport');
var jwt_config = require('./config/jwt_secret.js');
var jwt = require('jsonwebtoken');
const helmet = require('helmet');
const expressValidator = require('express-validator');
var cors = require('cors');

var config = require('./config/config');
var app = express();

var dbURI = config.db.dbUri;
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// app.use(logger('common', {
//     stream: fs.createWriteStream('./logs/output.log', {flags: 'a'})
// }));
// app.use(logger('dev'));
/**
 * 
 * Server Routes defination Files including a directory. Using fs.readFile for including all directory at once
 */
/*var normalizedPath = require("path").join(__dirname, "routes");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    console.log("file",file);
    require("./routes/" + file);
});*/
var RateLimit = require('express-rate-limit');
var MongoStoreLimit = require('rate-limit-mongo');
 
var limiter = new RateLimit({
  store: new MongoStoreLimit({
    // see Configuration
    uri: dbURI,
    collectionName: 'rateLimit'
  }),
  max: 1500,
  windowMs: 15 * 60 * 1000 // 15 mint
});
 

var admin = require("./routes/admin"); // for including routes
var basic_admin = require("./routes/basic_admin"); // for including routes
var traveller = require("./routes/traveller");
var approving_manager = require("./routes/approving_manager");
var super_admin = require("./routes/super_admin");

/**
 * Comman Configurations Files required
 */

app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.featurePolicy({
    features: {
        vibrate: ["'none'"],
        geolocation: ["'none'"]
    }
  }));
  app.use(helmet.contentSecurityPolicy({
      directives:{
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'http://cdn.ckeditor.com'],
        styleSrc: ["'self'", "'unsafe-inline'", "https://maxcdn.bootstrapcdn.com", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.googleapis.com', 'data:', 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'http://res.cloudinary.com/dvbuhh0bl/image/upload/v1495279723/flags_boi3c5.png', 'https://riskapl-images.s3.eu-west-2.amazonaws.com', 'data:'],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        connectSrc: ["'self'"],
        
    }
}));
app.use(helmet());

app.use(expressValidator());
/**
 * Express Configurations System generated
 */
var useragent = require('express-useragent');
app.use(useragent.express());


/**
 * HTML View Engine setup
 *
 */
app.engine('html', function (path, opt, fn) {
    fs.readFile(path, 'utf-8', function (err, str) {
        if (err)
            return str;
        return fn(null, str);
    })
});

/**
 * Express Server-side configurations
 *
 */
app.use(logger('dev'));

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

/**
 * Riskpal Frontend Path setup
 *
 */
// app.use(cookieParser());
var csrf = require('csurf');
// app.use(cookieParser('secretPassword'));

app.use('/clientPortal/pdf',express.static(path.join(__dirname, 'clientPortal/pdf')));
// app.use(lessMiddleware(path.join(__dirname, './riskpal-client'))); //Call this Middleware first before express static path
app.use(express.static(path.join(__dirname, './public/dist')));

/**
 * API CORS & Access Control setup
 *
 */

/**
 *
 */
var whitelist = ['http://localhost:4200', 'https://dev.riskpal.co.uk', 'https://staging.riskpal.co.uk', 
    'https://riskpal.co.uk'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

// Then pass them to cors:
// app.use(cors(corsOptions));
app.use(cors({credentials: true}));
app.set('trust proxy', 1)
// app.use(express.cookieParser());
app.use(session({
    secret: config.secret,
    HttpOnly: true,
    maxAge: 24 * 3600,
    cookie: { secure: true,maxAge: 24 * 3600 * 1000, httpOnly: true },
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: new MongoStore({
        url: dbURI,
        touchAfter: 24 * 3600,
        options:{
            autoReconnect: true
            }
    })
}));
// app.all('/*', function (req, res, next) {
//     // CORS headers
//     // res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
//     res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
//     res.header('Access-Control-Allow-Origin', 'https://dev.riskpal.co.uk');
//     res.header('Access-Control-Allow-Origin', 'https://staging.riskpal.co.uk');
//     res.header('Access-Control-Allow-Origin', 'https://riskpal.co.uk');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     // Set custom headers for CORS
//     res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization,xsrf-token');
//     if (req.method == 'OPTIONS') {
//         res.status(200).end();
//     } else {
//         next();
//     }
// });

//  apply to all requests
app.use(limiter);
// Code for System Logs starts here
app.use(function (req, res, next) {
    var allowAPI = {
        "/api/menu/update": "Menu Update"
    };
    var action = req.url;
    if (action in allowAPI) {
        var _json = res.json; // override logic
        res.json = function (result) {
            var dataIn = JSON.stringify(req.body);
            //var dataOut = JSON.stringify(result.data);
            var logData = {};
            var browser = "-";
            var version = "-";
            x
            var os = "-";
            var platform = "-";
            var eventTypes = "-";
            var ipAddress = "-";
            var device = "-";
            var userId = "-";
            eventTypes = allowAPI[action];
            if (req.user) {
                userId = req.user.id;
            }
            if (req.headers["mobile-agent"]) { //req.headers["Mobile-Agent"] = "IOS|IOS 9.0|iphone 6S|127.10.1.151"
                var mobileAgent = req.headers["mobile-agent"].split("|");
                os = mobileAgent[1];
                platform = mobileAgent[0];
                device = mobileAgent[2];
                ipAddress = mobileAgent[3];
                var dataOutUseragent = req.headers["mobile-agent"];
                browser = "-";
                version = "-";
            } else {
                //console.log('nops not found........');
                ipAddress = (req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || '').split(',')[0] || req.client.remoteAddress;
                if (req.useragent.isDesktop) {
                    device = "desktop";
                } else if (req.useragent.isMobile) {
                    device = "mobile";
                } else if (req.useragent.isTablet || req.useragent.isiPad || req.useragent.isiPod) {
                    device = "tablet";
                } else {
                    device = "other";
                }
                browser = req.useragent.browser;
                version = req.useragent.version;
                os = req.useragent.os;
                platform = 'Web';
                var dataOutUseragent = JSON.stringify(req.useragent);
            }

            var logData = {
                'action': req.originalUrl,
                'eventTypes': eventTypes,
                'userId': userId,
                'method': req.method,
                'message': result.message,
                'code': result.code,
                'dataIn': dataIn,
                'dataOut': dataOutUseragent,
                'browser': browser,
                'version': version,
                'os': os,
                //'platform': req.useragent.platform,
                'platform': platform,
                'device': device,
                'ipAddress': ipAddress
            };

            var systemlog = new SystemLogModal(logData);
            systemlog.save(function (err) {
                if (err) {
                    _json.call(this, err);
                } else {
                    //_json.call(this, result);
                }
            });

            _json.call(this, result);
        }
    }
    next();
});

// app.use(csrf({ cookie: true }));
// app.use(function (req, res, next) {
//     res.cookie('csrf-token', req.csrfToken());
//     next();
//   });

app.use(passport.initialize());
require('./config/passport/passport')(passport);

// We are going to protect /api routes with JWT(Using Bearer Tokens)
app.use('/api', passport.authenticate('bearer', {
    session: false
}));

// app.get('/riskpal-server/06.jpg',function(req,res,nex){
//     console.log("called");
// })

// admin api authentication
var cron = require('node-cron');
var user = require('./modules/user/user');

// '0 0 * * SAT'
var task = cron.schedule('0 */5 * * * *', user.updateAccessEmergencyInfoStatus,{
    scheduled: false
  });
  task.start();

app.use('/admin/*', function (req, res, next) {
    var freeAuthPath = [
        '/admin/sms',
        '/admin/voice',
        '/admin/verify',
        '/admin/onetouch',
        '/admin/start',
        '/admin/checkonetouchstatus',
        '/admin/verify',
        '/admin/verifyOtp',
        '/admin/adminLogin',
        '/admin/adminRegister',
        '/admin/adminForgetPass',
        '/admin/checkLogin',
        '/admin/adminResetPass',
        '/admin/adminActiveAccount'
    ];
    var available = false;
    for (var i = 0; i < freeAuthPath.length; i++) {
        if (freeAuthPath[i] == req.baseUrl) {
            available = true;
            break;
        }
    }
    if (!available) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken, jwt_config.secret, function (err, decoded) {
                req.user = decoded;
                if (err) {
                    return res.send({
                        code: jwt_config.forbidden,
                        err: 'Invalid Token!'
                    });
                } else {
                    if ( process.env.NODE_ENV == 'test' ) {
                        console.log('hiiiisssssss');
                        next();
                        return;
                    }
                    if ( req.session.userData ) {
                        next();
                    } else {
                        return res.send({
                            code: config.forbidden,
                            err: 'Invalid Token!!'
                        });
                    }
                }
            });
        } else {
            // res.sendFile(path.join(__dirname + '/./riskpal-client/admin/404.html'));
             return res.send({ code: jwt_config.error, err: 'Please provide valid Authentication Token!' });
        }
    } else {
        next();
    }

})

app.use('/basic_admin/*', function (req, res, next) {
    var freeAuthPath = [
        '/basic_admin/sms',
        '/basic_admin/voice',
        '/basic_admin/verify',
        '/basic_admin/onetouch',
        '/basic_admin/start',
        '/basic_admin/checkonetouchstatus',
        '/basic_admin/verify',
        '/basic_admin/verifyOtp',
        '/basic_admin/basicAdminLogin',
        '/basic_admin/basicAdminForgetPass',
        '/basic_admin/checkLogin',
        '/basic_admin/basicAdminResetPass',
        '/basic_admin/basicAdminActiveAccount'
    ];
    var available = false;
    for (var i = 0; i < freeAuthPath.length; i++) {
        if (freeAuthPath[i] == req.baseUrl) {
            available = true;
            break;
        }
    }
    if (!available) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken, jwt_config.secret, function (err, decoded) {
                req.user = decoded;
                if (err) {
                    return res.send({
                        code: jwt_config.forbidden,
                        err: 'Invalid Token!'
                    });
                } else {
                    if ( process.env.NODE_ENV == 'development' ) {
                        next();
                    }
                    if ( req.session.userData ) {
                        next();
                    } else {
                        return res.send({
                            code: config.forbidden,
                            err: 'Invalid Token!!'
                        });
                    }
                }
            });
        } else {
            // res.sendFile(path.join(__dirname + '/./riskpal-client/basic_admin/404.html'));
             return res.send({ code: jwt_config.forbidden, err: 'Please provide valid Authentication Token!' });
        }
    } else {
        next();
    }

})
// traveller api authentication
app.use('/traveller/*', function (req, res, next) {
    var freeAuthPath = [
        '/traveller/sms',
        '/traveller/voice',
        '/traveller/verify',
        '/traveller/onetouch',
        '/traveller/start',
        '/traveller/checkonetouchstatus',
        '/traveller/verify',
        '/traveller/verifyOtp',
        '/traveller/travellerLogin',
        '/traveller/travellerRegister',
        '/traveller/travellerForgetPass',
        '/traveller/checkLogin',
        '/traveller/travellerActiveAccount',
        '/traveller/travellerResetPass',
        // '/traveller/getCountryThreatMatrixCron'
    ];
    var available = false;
    for (var i = 0; i < freeAuthPath.length; i++) {
        if (freeAuthPath[i] == req.baseUrl) {
            available = true;
            break;
        }
    }
    if (!available) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken, jwt_config.secret, function (err, decoded) {
                req.user = decoded;
                if (err) {
                    return res.send({
                        code: jwt_config.forbidden,
                        err: 'Invalid Token!'
                    });
                } else {
                    if ( process.env.NODE_ENV == 'test' ) {
                        console.log('hiiiisssssss');
                        next();
                        return;
                    }
                    if ( req.session.userData ) {
                        next();
                    } else {
                        return res.send({
                            code: config.forbidden,
                            err: 'Invalid Token!!'
                        });
                    }
                }
            });
        } else {
            return res.send({
                code: jwt_config.forbidden,
                err: 'Please provide valid Authentication Token!'
            });
        }
    } else {
        next();
    }

})




// approving manager api authentication
app.use('/approving_manager/*', function (req, res, next) {
    var freeAuthPath = [
        '/approving_manager/sms',
        '/approving_manager/voice',
        '/approving_manager/verify',
        '/approving_manager/onetouch',
        '/approving_manager/start',
        '/approving_manager/checkonetouchstatus',
        '/approving_manager/verify',
        '/approving_manager/verifyOtp',
        '/approving_manager/approvingManagerLogin',
        '/approving_manager/checkLogin',
        '/approving_manager/approvingManagerForgetPass',
        '/approving_manager/approvingManagerResetPass'
    ];
    var available = false;
    for (var i = 0; i < freeAuthPath.length; i++) {
        if (freeAuthPath[i] == req.baseUrl) {
            available = true;
            break;
        }
    }
    if (!available) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(bearerToken, jwt_config.secret, function (err, decoded) {
                req.user = decoded;
                if (err) {
                    return res.send({
                        code: jwt_config.forbidden,
                        err: 'Invalid Token!'
                    });
                } else {
                    if ( process.env.NODE_ENV == 'test' ) {
                        next();
                        return;
                    }
                    if ( req.session.userData ) {
                        next();
                    } else {
                        return res.send({
                            code: config.forbidden,
                            err: 'Invalid Token!!'
                        });
                    }
                }
            });
        } else {
            return res.send({
                code: jwt_config.forbidden,
                err: 'Please provide valid Authentication Token!'
            });
        }
    } else {
        next();
    }

})


// super admin api authentication
app.use('/super_admin/*', function (req, res, next) {
    var freeAuthPath = [
        '/super_admin/superAdminLogin',
        '/super_admin/superAdminForgetPass',
        '/super_admin/accessEmergencyInfoApprovalStatus',
        '/super_admin/superAdminResetPass',
        '/super_admin/userActivate',
        '/super_admin/checkUserstatus',
        '/super_admin/healthCheck'

    ];
    var available = false;
    for (var i = 0; i < freeAuthPath.length; i++) {
        if (freeAuthPath[i] == req.baseUrl) {
            available = true;
            break;
        }
    }
    if (!available) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            console.log('req.sessionreq.session', req.session.userData);
            jwt.verify(bearerToken, jwt_config.secret, function (err, decoded) {
                req.user = decoded;
                if (err) {
                    return res.send({
                        code: config.forbidden,
                        err: 'Invalid Token!'
                    });
                } else {
                    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
                    if ( process.env.NODE_ENV == 'test' ) {
                        console.log('hiiiisssssss');
                        next();
                        return;
                    }
                    if ( req.session.userData ) {
                        next();
                    } else {
                        console.log('hiiii');
                        return res.send({
                            code: config.forbidden,
                            err: 'Invalid Token!!'
                        });
                    }
                    
                }
            });
        } else {
            // res.sendFile(path.join(__dirname + '/./riskpal-client/admin/404.html'));
             return res.send({ code: jwt_config.forbidden, err: 'Please provide valid Authentication Token!' });
        }
    } else {
        next();
    }

})



// Loading routes as per api*
app.use('/admin', admin); // added for admin routes
app.use('/traveller', traveller); // added for traveler routes
app.use('/basic_admin', basic_admin); // added for basic_admin routes
app.use('/approving_manager', approving_manager); // added for approving manager routes
app.use('/super_admin', super_admin); // added for super admin routes

/*app.use('/admin', passport.authenticate('bearer', {
    session: false
}));*/

app.get('*', function (req, res, next) {
    if ( process.env.NODE_ENV != 'phantom_dev') {
        res.sendFile(path.join(__dirname + '/./public/dist/index.html'));
    } else {
        res.sendFile(path.join(__dirname + '/./clientPortal/index.html'));
    }
    
});


process.on('unhandledRejection', error => {
    // Won't execute
    console.log('unhandledRejection', error);
    // res.status(500).send('Unknown Error');
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Error handlers, development error handler, will print stacktrace
 *
 */

if (app.get('env') === 'development' || app.get('env') === 'test') {
    app.use(function (err, req, res, next) {
        console.log("error", err);
        err.error = true;
        res.status(err.status || 500);
        res.send(err);
        // res.sendFile(path.join(__dirname + '/./public/dist'));
    });
}

/**
 * Production error handler, No stacktraces leaked to user
 *
 */
app.use(function (err, req, res, next) {
    // if (err.code !== 'EBADCSRFTOKEN') return next(err)
    // handle CSRF token errors here
    // res.status(403).json({message: 'Session Expired.'});
    if ( err.status == 500 ) {
        res.status(500).json({error: true, message: 'There is some error, please try again later.'});
    }
    res.status(err.status || 500).json({error: err.err, errorCode: err.code, message: err.err, err: err.err});
    // res.sendFile(path.join(__dirname + '/./public/dist'));
    //res.sendFile(path.join(__dirname + '/./riskpal-client/admin/404.html'));
});
//comment
module.exports = app;
