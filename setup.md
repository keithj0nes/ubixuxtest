# Set up

### Set up the database

Create a db and head over to server.js file and change 'config.psqlConnString' on line 16 with your db name.

Next, you'll need to run the SQL script in the schema.sql file - I'm using PostgreSQL.

### Creating your login

For the "organization" input, be sure to write "Ubix Labs" to work correctly with the test data you just put in. Use a fake email and fake password, as they are not hashed.

### Log in with the test data

Email - kjones@email.com
Password - pass123

# About the project

This is built with the AngularJS framework, NodeJS backend with Express, and PostgreSQL database. User logins are persistent using Express-Sessions, and db calls use Massive.

I learned the basics of and used Bootstrap to complete the styling.
