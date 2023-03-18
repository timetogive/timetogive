#!/usr/bin/env bash
echo "Building iOS app locally with local-dev profile" 
echo "You must have the expo-cli installed, and XCode setup and configured"
echo "Once the build is complete, unzip the file and drag it on to the simulator to install the app"
echo "Because it's a dev client build, you will need to run 'yarn expo start --dev-client'"
eas build --profile local-dev --platform ios --local