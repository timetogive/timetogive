#!/usr/bin/env bash
echo "-----------------------------------------------------------------------"
echo "Building iOS app locally with dev-client-simulator profile" 
echo "You must have the expo-cli installed, and XCode setup and configured"
echo "Once the build is complete, unzip the file and drag it on to the simulator to install the app"
echo "Because it's a dev client build, you will need to run the dev server - yarn start"
echo "-----------------------------------------------------------------------"
eas build --profile dev-client-simulator --platform ios --local