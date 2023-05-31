 /* // Load the AWS SDK
const AWS = require('aws-sdk');
const csv = require('fast-csv');
const fs = require('fs');

//Config AWS region
AWS.config.update({
    region: 'eu-west-1'
});
const tableresult = async (params , csvStream) => {
  const dynamodb = new AWS.DynamoDB();

  dynamodb.describeTable(params, function(err, data)
      { if (err) console.log(err, err.stack);
          else 
            tableObject1 = {
              "tableName":data.Table.TableName,
              "tableStatus":data.Table.TableStatus,
              "tableARN":data.Table.TableArn,
              "partitionKey":data.Table.KeySchema[0].AttributeName,
              "sortKey":data.Table.KeySchema[1],
              "itemCount":data.Table.ItemCount
            }
          
            csvStream.write(tableObject1);
            return tableObject1;
      });
}
//Extract CSV conf
const tablesList = async () => {
  const dynamodb = new AWS.DynamoDB();
  const csvStream = csv.format({ headers: true });
  const writableStream = fs.createWriteStream('my-dataeu.csv');
  dynamodb.listTables(async (err, data) => {
      if (err) {
      console.error('Error listing tables:', err);
      } 
      else {
      console.log('Tables:', data.TableNames.length);
      for (let i = 0; i < data.TableNames.length; i++) 
      { 
        var params = {  TableName: data.TableNames[i] };
        await tableresult(params, csvStream); 
      }
      csvStream.pipe(writableStream);
      console.log('Data exported to my-data.csv');
      return "jola";
    }
  });
}

const docClient = new AWS.DynamoDB.DocumentClient();
const  dynamodbSDK = async () => {

  AWS.config.apiVersions = { dynamodb: '2012-08-10', };
    return tablesList();
}

const exportCSV = async (finalObject) => {
  const csvStream = csv.format({ headers: true });
const writableStream = fs.createWriteStream('my-data.csv');


  console.log (finalObject);
    finalObject.forEach((TableNames) => {
      csvStream.write(TableNames);
    });
    csvStream.pipe(writableStream);
    console.log('Data exported to my-data.csv');
    return true;
}

async function dynamoExport() {
   const output = await dynamodbSDK ();
  }

  dynamoExport (); */ 

  const { DynamoDBClient, ListTablesCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
  const { unmarshall } = require("@aws-sdk/util-dynamodb");
  const { createObjectCsvWriter } = require('csv-writer');
  const fs = require('fs');
  
  const region = "eu-west-1";
  const client = new DynamoDBClient({ region });
  
  async function getAllTableMetadata() {
    const tables = await client.send(new ListTablesCommand({}));
    const tableMetadata = [];
    for (const tableName of tables.TableNames) {
      const description = await client.send(new DescribeTableCommand({ TableName: tableName }));
      const metadata = description.Table;
      const keys = metadata.KeySchema;
      const partitionKey = keys.find(key => key.KeyType === "HASH").AttributeName;
      const sortKey = keys.find(key => key.KeyType === "RANGE")?.AttributeName;
      tableMetadata.push({
        Name: metadata.TableName,
        Status: metadata.TableStatus,
        ARN: metadata.TableArn,
        ItemCount: metadata.ItemCount,
        PartitionKey: partitionKey,
        SortKey: sortKey
      });
    }
    return tableMetadata;
  }
  
  async function exportTableMetadataToCSV() {
    const metadata = await getAllTableMetadata();
    const csvWriter = createObjectCsvWriter({
      path: 'table_metadatatest.csv',
      header: [
        { id: 'Name', title: 'Table Name' },
        { id: 'Status', title: 'Table Status' },
        { id: 'ARN', title: 'Table ARN' },
        { id: 'ItemCount', title: 'Item Count' },
        { id: 'PartitionKey', title: 'Partition Key' },
        { id: 'SortKey', title: 'Sort Key' }
      ]
    });
    await csvWriter.writeRecords(metadata);
    console.log('Table metadata exported to table_metadata.csv');
  }
  
  exportTableMetadataToCSV();
  