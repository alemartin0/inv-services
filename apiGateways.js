const { APIGatewayClient, GetRestApisCommand } = require("@aws-sdk/client-api-gateway");
const { Writable } = require('stream');
const csvWriter = require('csv-write-stream');
const fs = require('fs');
// Set up AWS credentials and region
const client = new APIGatewayClient({ region: "us-east-1" });

// Create a writable stream to the CSV file
const writable = new Writable({
  write(chunk, encoding, callback) {
    fs.appendFile('api_gateway_datatest.csv', chunk.toString(), callback);
  }
});

// Create a CSV writer
const writer = csvWriter({ headers: ['Name', 'ID', 'Description', 'Created Date', 'Version', 'Endpoint'] });

// Send the API Gateway request and write the data to the CSV file
(async function() {
  writer.pipe(writable);

  const command = new GetRestApisCommand({});
  const response = await client.send(command);

  const apis = response.items;

  // Write each API Gateway resource to the CSV file
  apis.forEach(api => {
    writer.write({
      Name: api.name,
      ID: api.id,
      Description: api.description,
      'Created Date': api.createdDate,
      Version: api.version,
      Endpoint: api.endpointConfiguration.types[0]
    });
  });

  writer.end();
  console.log('API Gateway data exported to CSV file');
})();
