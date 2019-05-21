let addStatic = require('./add-static-proxy')

/**
 * visit arc.static and merge in AWS::Serverless resources
 */
module.exports = function statics(arc, template) {
  
  // ensure cf standard sections exist
  if (!template.Resources)
    template.Resources = {}

  if (!template.Outputs) 
    template.Outputs = {}

  // we leave the bucket name generation up to cloudfront
  template.Resources.StaticBucket = {
    Type: 'AWS::S3::Bucket',
    //DeletionPolicy: 'Retain',
    Properties: {
      AccessControl: 'PublicRead',
      WebsiteConfiguration: {
        IndexDocument: 'index.html',
        ErrorDocument: '404.html'
      }
    }
  }

  // which means we need to share it here
  template.Outputs.BucketURL = {
    Description: 'Bucket URL',
    Value: { 
      'Fn::Sub': [ 
        'http://${bukkit}.s3.${AWS::Region}.amazonaws.com', 
        {bukkit: {'Ref': 'StaticBucket'}} 
      ]
    }
  }

  // if an api is defined then add _static
  if (arc.http)
    template = addStatic(arc, template)
  
  return template
}
