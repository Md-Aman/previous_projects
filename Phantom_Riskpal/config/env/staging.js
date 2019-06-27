'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    host: 'ec2-35-176-204-178.eu-west-2.compute.amazonaws.com',
    dbUri: 'mongodb://super_riskaplStaging:lApX9JWWKy5S1e6E@cluster0-shard-00-00-qyuek.mongodb.net:27017,cluster0-shard-00-01-qyuek.mongodb.net:27017,cluster0-shard-00-02-qyuek.mongodb.net:27017/riskpal_staging?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
    port: '',
    protocol: 'mongodb',
    user: 'super_riskaplStaging',
    password: 'lApX9JWWKy5S1e6E',
    database: 'riskpal_staging_new',
    authSource: '?authSource=admin',
    connectionLimit: 100
  },
  port: process.env.PORT || 3000,
  host: 'https://staging.riskpal.co.uk',
  secret: '076ee61d63aa10a125ea872411e433b9',
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  twillio:{
  'SID' :'ACb342e5f46a8b35dc47b03f01fa44554a',
  'AUTHTOKEN':'37ca638791092eab3307418f5aa3c36e'
  },
  AWS:{
    'REGION' : 'eu-west-2',
    'AWS_BUCKET_NAME': 'riskapl-images/staging/profile',
    S3: {
      AWS_S3_IAM_USER_KEY: 'AKIAJ52WX54TJGGJWNSA',
      AWS_S3_IAM_USER_SECRET: '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',
    },
		'ENDPOINT' : 'http://dynamodb.us-west-2.amazonaws.com'
	},
  S3:{
    'apiVersion': '2006-03-01',
    'endpoint' : 'http://s3-us-west-2.amazonaws.com',
    'bucket':'taecout'
  },
  SES:{
    'apiVersion': '2010-12-01',
    'region':'us-west-2',
    'endpoint': 'https://email.us-west-2.amazonaws.com',
    'from': 'bhushanc@smartdatainc.net'
  },
	privateKey : '@taecoutApp',
  google: {
      'clientID'      : '745411580596-cq2lq1duaff5moct9cqad6vudo8hbbhb.apps.googleusercontent.com',
      'clientSecret'  : 'XCYeWw-EeMAgRD_F6Bz7PpyP',
      'accessTokenUrl': 'https://accounts.google.com/o/oauth2/token',
      'peopleApiUrl': 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'
  },
  twitter: {
      'consumer_key'	  : 'xFxVX162HHttGxVZpwawWzW4K', // localhost
      'consumer_secret' : 'fVbq0H4pYm1pNOdkHTeNjRJSDjgAigslTWLkJHpqFr9eKL0uSq', // localhost
      'requestTokenUrl' : 'https://api.twitter.com/oauth/request_token',
      'accessTokenUrl'  : 'https://api.twitter.com/oauth/access_token',
      'profileUrl' 	  : 'https://api.twitter.com/1.1/users/show.json?screen_name='
  },
  linkedin: {
      client_secret : 'ps12kSk5YRjLHC9B',
      access_token_url : 'https://www.linkedin.com/uas/oauth2/accessToken',
      people_api_url : 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)'
  },
  facebook: {
      client_secret : '534ecaecf8f8237f67f412822b04d16f',
      graphApiUrl : 'https://graph.facebook.com/v2.5/me?fields=',
      accessTokenUrl : 'https://graph.facebook.com/v2.5/oauth/access_token'
  },
  // facebook: {
  //   clientID: process.env.FACEBOOK_ID || 'APP_ID',
  //   clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
  //   callbackURL: '/api/auth/facebook/callback'
  // },
  // twitter: {
  //   clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
  //   clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
  //   callbackURL: '/api/auth/twitter/callback'
  // },
  // google: {
  //   clientID: process.env.GOOGLE_ID || 'APP_ID',
  //   clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
  //   callbackURL: '/api/auth/google/callback'
  // },
  // linkedin: {
  //   clientID: process.env.LINKEDIN_ID || 'APP_ID',
  //   clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
  //   callbackURL: '/api/auth/linkedin/callback'
  // },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
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
  }
};
