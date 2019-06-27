'use strict';

module.exports = {
  db: {
    host: 'ec2-35-176-204-178.eu-west-2.compute.amazonaws.com',
    dbUri: 'mongodb://super_riskpal:A6SAGsQAbmvUBHGJ@cluster0-shard-00-00-qyuek.mongodb.net:27017,cluster0-shard-00-01-qyuek.mongodb.net:27017,cluster0-shard-00-02-qyuek.mongodb.net:27017/riskpal_prod?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
    port: '',
    protocol: 'mongodb',
    user: 'super_riskpal',
    password: 'super_riskpal7645',
    database: 'riskpal_prod',
    authSource: '?authSource=admin',
    connectionLimit: 100
  },
  secure: {
    ssl: true,
    privateKey: '',
    certificate: ''
  },
  port: process.env.PORT || 3000,
  // Binding to 127.0.0.1 is safer in production.
  host: 'https://www.riskpal.co.uk',
  secret: '076ee61d63aa10a125ea872411e433b9',
  AWS:{
    'REGION' : 'eu-west-2',
    'AWS_BUCKET_NAME': 'riskapl-images/production/profile',
    S3: {
      AWS_S3_IAM_USER_KEY: 'AKIAJ52WX54TJGGJWNSA',
      AWS_S3_IAM_USER_SECRET: '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',
    },
		'ENDPOINT' : 'http://dynamodb.us-west-2.amazonaws.com'
	},
	privateKey : '@taecoutApp',
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
};
