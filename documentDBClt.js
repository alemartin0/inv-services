const { DocDBClient, DescribeDBClustersCommand } = require("@aws-sdk/client-docdb");
const { createObjectCsvWriter } = require("csv-writer");

// Create a new DocumentDB client with your AWS credentials and region
const client = new DocDBClient({
  region: "us-east-1",
//   credentials: {
//     accessKeyId: "your-access-key",
//     secretAccessKey: "your-secret-key",
//   },
});

// Call the describeDBClusters method to retrieve details of all the clusters
async function describeDBClusters() {
  const command = new DescribeDBClustersCommand({});
  const response = await client.send(command);
  return response.DBClusters;
}

// Define the CSV output file and header fields
const csvOutput = "clustersicfes5.csv";
const csvFields = [
  { id: "ClusterIdentifier", title: "ClusterIdentifier" },
  { id: "Status", title: "Status" },
  { id: "Engine", title: "Engine" },
  { id: "EngineVersion", title: "EngineVersion" },
  { id: "MasterUsername", title: "MasterUsername" },
  { id: "Endpoint", title: "Endpoint.Address" },
  { id: "EndpointPort", title: "Endpoint.Port" },
];

// Create a CSV writer with the desired output file and header fields
const csvWriter = createObjectCsvWriter({
  path: csvOutput,
  header: csvFields,
});

// Write the cluster data to the CSV file
describeDBClusters()
  .then((clusters) => {
    csvWriter.writeRecords(
      clusters.map((cluster) => ({
        ClusterIdentifier: cluster.DBClusterIdentifier,
        Status: cluster.Status,
        Engine: cluster.Engine,
        EngineVersion: cluster.EngineVersion,
        MasterUsername: cluster.MasterUsername,
        Endpoint: cluster.Endpoint.Address,
        EndpointPort: cluster.Endpoint.Port,
      }))
    );
    console.log(`Successfully wrote ${clusters.length} clusters to ${csvOutput}`);
  })
  .catch((err) => {
    console.error(err);
  });
