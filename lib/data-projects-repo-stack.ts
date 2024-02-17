import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as lambda from 'aws-cdk-lib/aws-lambda'

import  { DataPlaygroundPipeline } from '../lib/pipeline-stack'
import { HitCounter } from './hitcounter';

// import { Construct } from 'constructs';

export class DataProjectsRepoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // defines an AWS Lambda Resource 
    const hello =  new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,    
      code: lambda.Code.fromAsset('lambdas'),  
      handler: 'hello.handler'                
    })

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

     // defines a API gatewy Rest API resource backed by our "Hello" Function. 
     new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler 
    })

  }
}
