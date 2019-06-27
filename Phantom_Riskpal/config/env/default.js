'use strict';

module.exports = {
    db: {
        host: "127.0.0.1",
        port: 27017,
        protocol: "mongodb",
        user: "",
        password: "",
        database: "riskpal_dev",
        connectionLimit: 100,
        authSource: ''
    },
    app: {
        title: 'RiskPal',
        description: 'Travel Risk Assessment',
    },
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'http://0.0.0.0',
    // Session Cookie settings
    sessionCookie: {
        // session expiration is set by default to 24 hours
        maxAge: 24 * (60 * 60 * 1000),
        // httpOnly flag makes sure the cookie is only accessed
        // through the HTTP protocol and not JS/browser
        httpOnly: true,
        // secure cookie should be turned to true to provide additional
        // layer of security so that the cookie is set only when working
        // in HTTPS mode.
        secure: false
    },
    // sessionSecret should be changed for security measures and concerns
    sessionSecret: process.env.SESSION_SECRET || '@riskpal',
    // sessionKey is set to the generic sessionId key used by PHP applications
    // for obsecurity reasons
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',
    logo: '',
    favicon: '',
    uploads: {
        profileUpload: {
            dest: '', // Profile upload destination path
            limits: {
                fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
            }
        }
    }
};
