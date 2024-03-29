#!/usr/bin/env bash
echo "-----------------------------------------------------------------------"
echo "Building iOS app locally with dev-client-device profile" 
echo "You must have the expo-cli installed, and XCode setup and configured"
echo "Your device must be registered correctly with EAS"
echo "The build will generated a .ipa file, which you can install on your device"
echo "To add to your device drag and drop through Finder with the phone connected to your mac"
echo "Note you will need to trust the phone on your mac and your mac will need to trust the phone"
echo "DON'T FORGET to enable developer mode in privacy and settings on your phone"
echo "Because it's a dev client build, you will need to run the dev server - yarn start"
echo "-----------------------------------------------------------------------"
eas build --profile dev-client-device --platform ios --local