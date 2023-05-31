const cdk = require('aws-cdk-lib');
const AWS = require('aws-sdk');
const lambda = require('aws-cdk-lib/aws-lambda');

class MyStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    async function getLambdaInformation() {
      const lambdaClient = new AWS.Lambda();
      const lambdas = await lambdaClient.listFunctions().promise();
      return lambdas.Functions;
    }

    // Retrieve Lambda information
    getLambdaInformation()
      .then((lambdaFunctions) => {
        // Process the Lambda information as needed
        console.log(lambdaFunctions);
      })
      .catch((error) => {
        console.error('Error retrieving Lambda information:', error);
      });

    /* // Add your other stack resources here
    const myLambda = new lambda.Function(this, 'MyLambda', {
      // Lambda configuration options
    }); */
  }
}

const app = new cdk.App();
new MyStack(app, 'LambdaFunctions');

// Build and deploy the stack
app.synth();
