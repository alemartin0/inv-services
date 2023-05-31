const { SecretsManagerClient, ListSecretsCommand, GetSecretValueCommand, DescribeSecretCommand } = require('@aws-sdk/client-secrets-manager');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

// Set up AWS SDK client
const client = new SecretsManagerClient({ region: 'us-east-1' });

// Set up CSV writer to the output file
const csvWriter = createCsvWriter({
  path: 'secrets2018.csv',
  header: [
    { id: 'name', title: 'Name' },
    { id: 'description', title: 'Description' },
    { id: 'value', title: 'Value' },
    { id: 'application', title: 'Application' },
    { id: 'environment', title: 'Environment' },
    { id: 'integration', title: 'Integration' },
    { id: 'aws_region', title: 'AWS Region' },
    { id: 'name_tag', title: 'Name Tag' },
    { id: 'region_tag', title: 'Region Tag' }
  ]
});

// Retrieve all secrets created within a specific time range
// ...

// ...

// Retrieve secrets within a specific time range
const getSecretsByTimeRange = async (startTime, endTime) => {
  try {
    let secrets = [];
    let nextToken;

    // Use the SecretsManager client to paginate through all secrets
    do {
      const result = await client.send(new ListSecretsCommand({ NextToken: nextToken }));
      secrets = secrets.concat(result.SecretList);
      nextToken = result.NextToken;
    } while (nextToken);

    const records = []; // Array to store the secret records

    // Use the SecretsManager client to retrieve each secret value and tags
    for (const secret of secrets) {
      const secretMetadata = await client.send(new DescribeSecretCommand({ SecretId: secret.ARN }));

      // Retrieve specific tag values
      let application = '';
      let environment = '';
      let integration = '';
      let awsRegion = '';
      let nameTag = '';
      let regionTag = '';

      if (secretMetadata.Tags) {
        for (const tag of secretMetadata.Tags) {
          if (tag.Key === 'application') {
            application = tag.Value;
          } else if (tag.Key === 'environment') {
            environment = tag.Value;
          } else if (tag.Key === 'integration') {
            integration = tag.Value;
          } else if (tag.Key === 'aws_region') {
            awsRegion = tag.Value;
          } else if (tag.Key === 'name') {
            nameTag = tag.Value;
          } else if (tag.Key === 'region') {
            regionTag = tag.Value;
          }
        }
      }

      // Check if secret creation date is within the specified time range
      const creationDate = new Date(secretMetadata.CreatedDate).getTime();
      if (creationDate >= startTime.getTime() && creationDate <= endTime.getTime()) {
        const data = await client.send(new GetSecretValueCommand({ SecretId: secret.ARN }));

        // Create a secret record object
        const record = {
          name: secret.Name,
          description: secret.Description,
          value: data.SecretString,
          application: application,
          environment: environment,
          integration: integration,
          aws_region: awsRegion,
          name_tag: nameTag,
          region_tag: regionTag
        };

        records.push(record); // Add the record to the array
      }
    }

    // Write the records to the CSV file
    await csvWriter.writeRecords(records);

    console.log('Secrets exported to secretsus.csv');
  } catch (err) {
    console.error(err);
  }
};

// Define the start and end time range for filtering secrets
const startTime = new Date('2019-01-01'); // Replace with your desired start time
const endTime = new Date('2023-05-15'); // Replace with your desired end time

getSecretsByTimeRange(startTime, endTime);
