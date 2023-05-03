# What?

This is a simple Node JS script written in TypeScript.

- runs in a loop
- pauses for 30 mins
- looks for notifications that need sending

In order to run continuously, we boot an Express JS server (so you can manually verify via a web page that is running) - and then the script loops in the background.

# How do I run this locally?

We use node version manager (nvm) to set the correct node version for the project (https://github.com/nvm-sh/nvm).

`nvm use`

We use yarn to manage the project dependencies (https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable).

To install the dependencies:

`yarn install`

Create an `env.local` file in the root directory with the following variables set correctly

```
```

To run the script:

`yarn start`

# How is it deployed?

It is deployed onto AWS Beanstalk using the CI on Gitlab.

If you wish to deploy this manually you can use the same commands used in the repo's `.gitlab-ci.yml` file. You will need to have the AWS CLI (https://aws.amazon.com/cli/) and the elastic beanstalk CLI (https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html) installed.

You will also need set the appropriate shell environment variables.

For historic reference, in order to make it work in the CI, we can do the same, however, the initial setup had to be done manually (effectively registering an EB application for dev, staging, and prod). This was done using the following commands (note this does not need to be done again - it's just here for reference).

- aws configure set aws_access_key_id $EB_DEPLOY_AWS_ACCESS_KEY_ID
- aws configure set aws_secret_access_key $EB_DEPLOY_AWS_SECRET_ACCESS_KEY
- aws configure set region eu-west-2
- eb init ttg-push-sender-dev --platform node.js --region eu-west-2

or 

- eb init ttg-push-sender-prod --platform node.js --region eu-west-2

Then I created a new application called expire-stripe-checkouts-dev in the web console (using a single instance node.js setup)

This application was then cloned for staging + prod
