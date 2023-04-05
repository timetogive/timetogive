This folder contains the React Native project for TimeToGive

We use local `.env` files to deal with environment and configuration differences between builds when running locally

When running builds on Expo's EAST hosted build service, the env vars are held as secrets on the Expo service

In the eas.json, there are 4 different builds (this will be expanded on the future). 

There is:

- dev-client-simulator - this uses expo dev client (similar to expo go) for local development when running on simulatora
- dev-client-device - this uses expo dev client (similar to expo go) for local development when running on real devices
- dev - the official dev build (which will eventually be triggered off the dev branch of the repo)
- prod - the official prod build (which will eventually be triggered off the prod branch of the repo)

We leverage Expo updates - so that we can update the JS part of the native apps on the fly without having to go through app store release processes

