const cdk = require('aws-cdk-lib');
const { MyStack } = require('./my-stack'); // Replace './my-stack' with the path to your stack file

const app = new cdk.App();
new MyStack(app, 'Lambda Functions'); // Replace 'MyStack' with the desired stack name

// Optionally, you can define additional stacks by instantiating them here
// Example: new OtherStack(app, 'OtherStack');

app.synth();
