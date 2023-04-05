This folder contains the React Native project for TimeToGive

We use local `.env` files to deal with environment and configuration differences between builds when running locally.

An example for dev is below:

```
APP_ENV=
DEV_SUPABASE_URL=
DEV_SUPABASE_ANON_KEY=
DEV_SUPABASE_PROJECT_ID=
MULTIAVATAR_API_URL=
MULTIAVATAR_API_KEY=
MAPBOX_API_KEY=
EAS_EXPO_PROJECT_ID=
EAS_EXPO_UPDATES_URL=
SUPABASE_ACCESS_TOKEN=
```

When running builds on Expo's EAST hosted build service, the env vars are held as secrets on the Expo service. 

The flow for the native app picking up the environment variables is:

1. Shell env vars (on build server or locally)
2. `eas.json` is specifically sets the `APP_ENV` variable
3. `app.config.js` looks at the `APP_ENV` variable and subsequently chooses the environment variables to pull in
4. the env vars are exposed to the application code via the `consts.ts` file

In the eas.json, there are 4 different builds (this will be expanded on the future). 

There is:

- dev-client-simulator - this uses expo dev client (similar to expo go) for local development when running on simulatora
- dev-client-device - this uses expo dev client (similar to expo go) for local development when running on real devices
- dev-internal - the official dev build for known set of provisioned devices (internal distribution)
- prod-internal - the official prod build for known set of provisioned devices (internal distribution)
- prod - the one that will be used for production submission to app stores

For running these builds locally (without having to use the EAS cloud servers), there are some shell files for convenience. 

- build-dev-client-simulator.sh
- build-dev-client-device.sh
- build-dev-internal.sh
- build-prod-internal.sh

We leverage Expo updates - so that we can update the JS part of the native apps on the fly without having to go through app store release processes

This is done through associating expo branches to expo releases.

# Other useful random stuff with EAS

Use EAS to add new internal build devices:

`eas device:create`

Create a branch on EAS (we have one for dev and prod already)

`eas branch:create prod`

Create a channel on EAS (we have one for dev and prod already)

`eas channel:create prod`

The above will automatically associate the branch with the same name with the channel. However, you can edit this.

`eas channel:edit prod --branch prod`

Publish an update build on the relevant channel with an update message

`eas update --channel prod --message "New release on Weds 5th Apr 2023"`

Convenience command for uploading all env variables as secrets into EAS build servers

`eas secret:push --scope project --env-file ./.env.prod`

# Submitting to Apple App Store



