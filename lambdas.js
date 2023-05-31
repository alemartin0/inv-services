const { LambdaClient, ListFunctionsCommand } = require('@aws-sdk/client-lambda'); //install @aws-sdk function
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const lambda = new LambdaClient({ region: 'us-east-1' }); // Replace with region

const csvWriter = createCsvWriter({
  path: 'lambda-functions-stg.csv', // Replace Name
  header: [
    { id: 'name', title: 'Name' },
    { id: 'description', title: 'Description' },
    { id: 'runtime', title: 'Runtime' },
    { id: 'memorySize', title: 'Memory (MB)' },
    { id: 'timeout', title: 'Timeout (sec)' },
    { id: 'lastModified', title: 'Last Modified' },
    { id: 'version', title: 'Version' }
  ]
});

lambda.send(new ListFunctionsCommand({}))
  .then((data) => {
    const functions = data.Functions.map((f) => ({
      name: f.FunctionName,
      description: f.Description,
      runtime: f.Runtime,
      memorySize: f.MemorySize,
      timeout: f.Timeout,
      lastModified: f.LastModified,
      version: f.Version
    }));

    csvWriter.writeRecords(functions)
      .then(() => console.log('The CSV file was written successfully!'));
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    lambda.destroy();
  });
