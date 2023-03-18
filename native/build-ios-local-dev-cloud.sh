#!/usr/bin/env bash
echo "Building iOS app with local-dev profile in the cloud using EAS build service" 
echo "You must have the expo-cli installed"
echo "Once the build is complete, unzip the file and drag it on to the simulator to install the app"
eas build --profile local-dev --platform ios --local