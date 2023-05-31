const AWS = require('aws-sdk');
const fs = require('fs');
const csvWriter = require('csv-write-stream');

// Set up AWS credentials and region
//const credentials = new AWS.SharedIniFileCredentials({profile: 'YOUR_AWS_PROFILE_NAME'});
//AWS.config.credentials = credentials;
AWS.config.region = 'us-east-1';

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Set up a CSV writer to the output file
const writer = csvWriter();
writer.pipe(fs.createWriteStream('s3_data.csv'));

// Set up a recursive function to download all S3 objects in a bucket
async function downloadAllObjects(bucketName, continuationToken) {
  const params = { Bucket: bucketName };
  if (continuationToken) {
    params.ContinuationToken = continuationToken;
  }

  const response = await s3.listObjectsV2(params).promise();

  // Download each object and write its content to the output file as a CSV row
  for (const object of response.Contents) {
    const objectResponse = await s3.getObject({ Bucket: bucketName, Key: object.Key }).promise();
    writer.write({ Key: object.Key, Content: objectResponse.Body.toString('utf-8') });
  }

  // Recursively download more objects if there are more to download
  if (response.IsTruncated) {
    await downloadAllObjects(bucketName, response.NextContinuationToken);
  }
}

// Call the recursive function to download all objects in a bucket
downloadAllObjects('YOUR_BUCKET_NAME').then(() => {
  console.log('S3 data exported to CSV file');
  writer.end();
});
