
-- Copy and paste this script in postgres to create test data in database


-- DROP existing TABLES, to clean out the database	=	=	=	=	=
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS todo CASCADE;


-- CREATE TABLES	=	=	=	=	=	=	=	=	=	=	=	=	=
CREATE TABLE organization (
  id SERIAL PRIMARY KEY,
  org_name TEXT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name_first TEXT,
  name_last TEXT,
  email TEXT,
  password TEXT,
  password_salt TEXT,
  org_id INTEGER REFERENCES organization(id)
);

CREATE TABLE todo (
  id SERIAL PRIMARY KEY,
  name TEXT,
  completed BOOLEAN,
  archived BOOLEAN,
  datecompleted TIMESTAMP,
  user_id INTEGER REFERENCES users(id)
);

-- INSERT TEST DATA	=	=	=	=	=	=	=	=	=	=	=	=	=

INSERT INTO organization (org_name) VALUES ('Ubix Labs');

INSERT INTO users (name_first, name_last, email, password, password_salt, org_id) VALUES ('Keith', 'Jones', 'kjones@email.com', 'pass123', null, 1);
INSERT INTO users (name_first, name_last, email, password, password_salt, org_id) VALUES ('Matt', 'Ellis', 'mellis@email.com', 'pass123', null, 1);
INSERT INTO users (name_first, name_last, email, password, password_salt, org_id) VALUES ('Becky', 'Anderson', 'banderson@email.com', 'pass123', null, 1);

INSERT INTO todo (name, completed, archived, datecompleted, user_id) VALUES ('Get this project finished', true, true, timenow(), 1);
INSERT INTO todo (name, completed, archived, datecompleted, user_id) VALUES ('Play hockey', false, false, null, 1);
INSERT INTO todo (name, completed, archived, datecompleted, user_id) VALUES ('Travel the world', false, false, null, 1);
INSERT INTO todo (name, completed, archived, datecompleted, user_id) VALUES ('Get groceries', false, false, null, 1);
INSERT INTO todo (name, completed, archived, datecompleted, user_id) VALUES ('Have more fun', false, false, null, 1);
