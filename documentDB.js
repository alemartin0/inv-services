const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const csvWriter = require('csv-write-stream');
const fs = require('fs');

// Set the region and credentials
const client = new DynamoDBClient({ region: 'us-east-1' });
const credentials = {
  accessKeyId: '',
  secretAccessKey: '',
};

// Create the DocumentClient instance
const docClient = new DynamoDBClient({ region: 'us-east-1', credentials });

// Set up a CSV writer to the output file
const writer = csvWriter();
writer.pipe(fs.createWriteStream('documentdb_data.csv'));

// Define the scan parameters
const params = {
  TableName: 'YOUR_TABLE_NAME',
};

// Call the scan() method to retrieve all data from the table
const scanAll = async () => {
  try {
    let lastEvaluatedKey = null;
    do {
      const result = await client.send(new ScanCommand({
        ...params,
        ExclusiveStartKey: lastEvaluatedKey,
      }));

      // Write each item to the output file as a CSV row
      result.Items.forEach((item) => {
        writer.write(item);
      });

      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    writer.end();
    console.log(`Wrote all items to documentdb_data.csv`);
  } catch (err) {
    console.error(err);
  }
}

scanAll();
