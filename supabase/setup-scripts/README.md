This folder contains the scripts for setting up supabase backend

# DB prereq setup

There are certain things that need to be done manually via the supabase dashboard as pre-preparation for the setup

The following extensions should be enabled in the database:

- POSTGIS
- PG_NET

# DB Scripts

To configure connection details you'll need to create a local `.env` file - this should contain a connection URI:

```
POSTGRES_CONNECTION_STRING=postgresql://postgres:[PASSWORDHERE].[SERVERNAMEHERE].supabase.co:5432/postgres
```

For convenience of adding these into the shell you can use `source envs.sh` to pull in the env vars from the file

To run the scripts you can execute:

`./index.sh`

# Authentication - Email Setup

We have a custom email template for "Confirm Signup" - this can be changed in the dashboard on supabase

Subject:

```
Confirm your sign-up for TimeToGive
```

Email template:

```
<h1>TimeToGive</h1>

<p>Thanks for signing up.</p>
<p>Please head back to the app and enter the following code to complete the sign up process.</p>

<h3>{{ .Token }}</h3>
```

# Authentication - Social Provider Setup

Next we'll enable the Google authentication provider. 

Authentication > Providers

Enable Google

At this point, follow the instructions on Supabase guides around Google Auth




