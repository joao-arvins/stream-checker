# Stream Checker API

Rest API to validate streams consumption by user. 
It exposes a POST endpoint that once called with a valid payload (containing the id of the user consuming the stream and the stream id)
checks the number of streams consumed by the user at the moment. If this number is lower than the maximum number of concurrent streams
then a stream record will be added to the database meaning that the request to start watching a new stream is valid.

The API is deployed: https://ds5so3hsma.execute-api.eu-west-2.amazonaws.com/dev/stream-record

To use it trigger a POST request using a body with the following structure:

```
{
    "userId": STRING,
    "streamId": STRING
}
```

# Testing
To test the code run:

```
npm test
```
NOTE: The integration tests are using the deployed Dynamo DB so before running them the first time a deployment is needed. In order to do that run:

```
npm run deploy
```

# Scalability Strategy

The API is built using a combination of API Gateway + AWS Lambda therefore it auto scales based on the number of requests/traffic.
There are however certain aspects that can improve the lambda performance:
- Currently to check the number of active streams for a given user a SCAN is made in the dynamo db table. This will eventually become a liability since it scans the entire table. Using a query instead of scan (with the creation of secondary indexes) would prevent this.
- Update the read/write capacity mode of the dynamo DB table to On-demand so that it can auto-scale based on traffic
- Bundle the lambda code using a tool such as serverless-webpack to optime the code and reduce the package size
- With scalabiltiy the logs become more and more important. Some improvements could be made such as exporting them to a more user friendly log system (using for instance the ELK stack)
- Analyze the impact of cold starts in the API based on the incoming request and react to them if necessary (by creating a cron job that would ping the API every x amount of time)

