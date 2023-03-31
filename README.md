# TimeToGive

Welcome to the TimeToGive repo. 

This is a monorepo representing the entire codebase of TimeToGive. 

# What is TimeToGive?

TimeToGive is a micro volunteering app and platform. It connects people with even a very small amount of spare time, with tasks that need doing in their local community, in real-time.

Tasks can be traditional volunteering opportunities (like helping hospices, community groups, or charities), or directly for individuals in need in the community (like the elderly, vulnerable, or those going through a tough time). Leveraging technology, doing this at scale on a global level, and doing this for free through a compelling mobile app is in itself a differentiator.

However, the idea around tasks also comes with a further "twist". Tasks don't have to be directly for good causes. Instead tasks can be for neighbours, businesses or other local groups, who need a hand with something. Instead of making a monetary payment, will do something good in return (e.g. buying the volunteer a coffee, making them dinner, making a pledge to charity, do something in return, volunteer to help someone else).

Tasks don't have to be physical, they might also be remote in nature - for example answering a question, or offering advice to your local community. And can therefore be done entirely through the app.

# Origin

TimeToGive was started by James Allchin ([hoochani](https://github.com/hoochani)) and this repo is currently maintained by James. It's hoped that the open source community can contribute to future direction if the TimeToGive platform and service gains traction.

# License

TimeToGive is [GPLv3 licensed](/LICENSE). You may use, distribute and copy code under the license terms.

# Tell me more about the tech

At the moment we're trying to get a public beta ready. Currently we don't know how well the app will be adopted and what the product market fit actually is. Therefore, we're focussed on building a simple app, on top of a simple, scalable architecture that incurs low cost (James Allchin, the founder of the project, is currently footing the bill).

The frontend of TimeToGive is a mobile app for iOS and Android. It is built using [React Native](https://reactnative.dev/). We also have the skills to build in TypeScript (Objective-C, Swift, and Java would make things a little more painful) and we get a "twofer" a single codebase for both iOS and Android. The React Native app takes advantage of [Expo](https://expo.dev/). It's really helping us with the build and submission process and making the app a little easier to develop.

The backend is built on top of [Supabase](https://supabase.com/) - it's an open-source alternative to firebase all built on top of Postgres which is pretty cool. Most features are now GA but some are still in Alpha or Beta. But it's got a good community using it and the supabase team are responsive and doing some cool stuff. It feels like a good choice for the initial Beta release - as it gives us a lot out of the box - auth, authorisation, realtime notifications and comms, auto-generated backend APIs (kind of) and of course a database.

The marketing website is built on [NextJS](https://nextjs.org/). It's likely this same NextJS app will also be used to provide middleware APIs as where we need them (as NextJS serverless functions). Again another twofer our Beta releases. It will be hosted on [Vercel](https://vercel.com/).

# Folder structure

- native - the react native app
- supabase - setup of the supabase postgres schemas + code
- website - the marketing website (and in the future serverless backend APIs)

# Getting started 

Clone the repo

## Running the native app

Install iOS simulators and / or Android simulators - or just use your own phone

- iOS simulator - on Mac install XCode. On Windows, frankly no idea.
- Android simulator - on Windows and Mac seems to be a whole bunch - or just install Android Studio and do it properly.

For the native app we use `yarn` (rather than `npm` or `pnpm`). So make sure `yarn` is globally installed.

```
cd native
```

Install the dependencies

```
yarn install
```

Running the app locally relies on environment variables for holding secrets and connection details. This is not held in the repo.

Ask @hoochani for the local development `.env`. Save this in in the `native` subfolder.

However, Expo does not automatically pull in the variables from a `dotenv` so we must manually set the env vars.

For convenience, you can run

```
source envs.sh 
```

Run the local expo service

```
yarn start
```

You can then photo the QR code to run on your own phone device, or trigger the simulator by following the expo menu options.

## Running the supabase backend

For the local dev, the supabase environment is already running in the cloud. You "can" run supabase locally but can't see the point for what we're trying to do.

For your own experiments, you could also spin up your own supabase cloud instance on your own supabase account really quickly. All you need to do is to install the supabase setup scripts contained in the repo.

For the beta release we're relying quite heavily on Postgres SQL (psql) functions which are then exposed as RPC web service functions to the frontend.

In order to apply code + schema changes to the dev supabase environment. You can use the scripts in the database directory.

```
cd supabase/setup-scripts
```

Again connection strings are controlled via environment variables. 

Ask @hoochani for the local development `.env`. Save this in in the `supabase/setup-scripts` subfolder.

To deploy code and schema changes run

```
./index.sh
```

Note we need to get a lot more sophisticated with how we manage, build, and deploy db code changes. This will come.

## Running the marketing website

Simples!

```
cd website
```

Install dependencies

```
yarn install
```

Run it

```
yarn dev
```

View it in your browser. 





