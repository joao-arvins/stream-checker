const AWS = require('aws-sdk');

//Setup AWS to point to correct region
AWS.config.update({
    region: 'eu-west-2'
});

//Load environment variables from .env file
require('dotenv').config();