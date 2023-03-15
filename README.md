# TimeToGive

Welcome to the TimeToGive repo. 

This is a monorepo representing the entire codebase of TimeToGive. 

# What is TimeToGive?

TimeToGive is a micro-volunteering app and platform. It connects people with even a very small amount of spare time, with tasks that need doing in their local community, in real-time.

Tasks can be traditional volunteering opportunities (like helping hospices, community groups, or charities), or directly for individuals in need in the community (like the elderly, vulnerable, or those going through a tough time). Leveraging technology, doing this at scale on a global level, and doing this for free through a compelling mobile app is in itself a differentiator.

However, the idea around tasks also comes with a further "twist". Tasks don't have to be directly for good causes. Instead tasks can be for neighbours, businesses or other local groups, who need a hand with something. Instead of making a monetary payment, will do something good in return (e.g. buying the volunteer a coffee, making them dinner, making a pledge to charity, do something in return, volunteer to help someone else). Think of this as a "TaskRabbit" but for good not cash.

Tasks don't have to be physical, they might also be remote in nature - for example answering a question, or offering advice to your local community. And can therefore be done entirely through the app. Think of this as an ultra-local "Quora" but for local communities globally. 

# Tell me more about the tech

At the moment we're building an MVP. We have no idea (yet) if anyone will actually use the app, and what the product market fit actually is. Therefore, we're focussed on building a simple app, on top of a simple architecture that incurs as little cost as possible. If we eventually see usage we can redesign and refactor for scale.

The frontend of TimeToGive is a mobile app for iOS and Android. It is built using [React Native](https://reactnative.dev/). Mainly because the MVP requirements are pretty basic. We also have the skills to build in TypeScript (Objective-C, Swift, and Java would make things a little more painful) and we get a "twofer" a single codebase for both iOS and Android. The React Native app takes advantage of [Expo](https://expo.dev/). It's perhaps likely that if we get out of an MVP stage, we'd probably need to eject from Expo, but for the moment it's making dev pretty easy and of course it helps (or will help) us to manage build pipelines and app store / play store publishing.

The backend is built on top of [Supabase](https://supabase.com/) - it's kind of an open-source alternative to firebase all built on top of Postgres - yep pretty crazy. Oh yep, and it's also only in Beta release. But hey, it feels like a good choice for an MVP - as it gives us a lot out of the box - auth, authorisation, realtime notifications and comms, auto-generated backend APIs (kind of) and of course a database.

The marketing website is built on [NextJS](https://nextjs.org/). It's likely this same NextJS app will also be used to provide middleware APIs as where we need them (as NextJS serverless functions). Again another twofer on our MVP.

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

Ask @hoochani for the local development `.env`. Save this in the root directory of the repo.

Expo does not automatically pull in the variables from a `dotenv` so we must manually set the env vars.

For convenience there is a script that does this. 

Run the local expo service

```
yarn start
```

You can then photo the QR code to run on your own phone device, or trigger the simulator by following the expo menu options.

