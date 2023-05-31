# alms-sumadi-apollo-inventoryAWS
AWS Asset Inventory Generation in SUMADI

The following repository is used to extract the metadata of the used AWS services.

It currently fetches data from the following services:
ApiGateways
DocumentDB - Clusters
DynamoDB
Lambdas
RDS
S3
Secret Manager

To obtain them from each one you must change the amazon credentials depending on the environment you want to extract the metadata in the following path: C:\Users "userId"\.aws

After adding the credentials, you must change the region between North America (us-east-1) and Ireland (eu-west-1), or where the aws servers have. and change the name of the file where the CSV containing the service metadata will be generated, for example: api_gateway_data.csv if possible add an acronym of the environment where this is being extracted to distinguish the changes between regions. (This at the level of the code of each tab).

and in the terminal run the command node "tab name", for example node documentdbClt.js and enter, it will show a message that the CSV has been generated successfully, and it will be displayed in the project folder. 



