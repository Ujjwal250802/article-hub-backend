CREATE TABLE appuser(
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250),
    email VARCHAR(50),
    password VARCHAR(250),
    status VARCHAR(20),
    isDeletable VARCHAR(20),
    UNIQUE(email)
);
INSERT into appuser(name,email,password,status,isDeletable) VALUES('admin','admin@email.com','admin','true','false');

create table category(
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
);

CREATE TABLE article(
    id int PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOTNULL,
    categoryID INTEGER NOT NULL,
    publication_date DATE,
    status VARCHAR(20)
);