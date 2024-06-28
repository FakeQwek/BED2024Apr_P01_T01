CREATE TABLE Users (
user_id INT NOT NULL,
username varchar(255) UNIQUE,
passwordHash varchar(255) NOT NULL,
role varchar(20),
CONSTRAINT PK_Users PRIMARY KEY (user_id),
CONSTRAINT CHK_Users_role CHECK (role IN ('member', 'librarian')));

CREATE TABLE Books (
book_id INT NOT NULL,
title varchar(255) NOT NULL,
author varchar(255) NOT NULL,
availability varchar(1) NOT NULL,
CONSTRAINT PK_Books PRIMARY KEY (book_id),
CONSTRAINT  CHK_Books_availability CHECK (availability IN ('Y', 'N')));