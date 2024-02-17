import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { Capture, Template } from 'aws-cdk-lib/assertions';

import { HitCounter }  from '../lib/hitcounter';

test('DynamoDB Table Created', () => {
  const stack = new cdk.Stack();
  // WHEN
  new HitCounter(stack, 'MyTestConstruct', {
    downstream:  new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'hello.handler',
      code: lambda.Code.fromAsset('lambdas')
    })
  });
  // THEN

  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::DynamoDB::Table", 1);
});

test('Lambda Has Environment Variables', () => {
    const stack = new cdk.Stack();
    // WHEN
    const test = new HitCounter(stack, 'MyTestConstruct', {
      downstream:  new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'hello.handler',
        code: lambda.Code.fromAsset('lambdas')
      })
    });
    // THEN
    const template = Template.fromStack(stack);
    const envCapture = new Capture();
    template.hasResourceProperties("AWS::Lambda::Function", {
      Environment: envCapture,
    });

    console.log(test.handler.node.id)
  
    expect(envCapture.asObject()).toEqual(
      {
        Variables: {
          DOWNSTREAM_FUNCTION_NAME: {
            Ref: "TestFunction22AD90FC",
          },
          HITS_TABLE_NAME: {
            Ref: "MyTestConstructHits24A357F0",
          },
        },
      }
    );
  });