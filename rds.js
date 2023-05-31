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

// Call the listTables() method to retrieve all table names
const listTables = async () => {
  try {
    const result = await client.listTables({});

    // Extract data from each table and write to the output file as a CSV row
    for (let i = 0; i < result.TableNames.length; i++) {
      const tableName = result.TableNames[i];
      console.log(`Scanning table ${tableName}`);

      let lastEvaluatedKey = null;
      do {
        const scanResult = await client.send(new ScanCommand({
          TableName: tableName,
          ExclusiveStartKey: lastEvaluatedKey,
        }));

        scanResult.Items.forEach((item) => {
          writer.write(item);
        });

        lastEvaluatedKey = scanResult.LastEvaluatedKey;
      } while (lastEvaluatedKey);
    }

    writer.end();
    console.log(`Wrote all items to documentdb_data.csv`);
  } catch (err) {
    console.error(err);
  }
};

listTables();
