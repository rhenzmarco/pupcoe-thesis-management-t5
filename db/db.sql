CREATE TABLE users (
	id SERIAL PRIMARY KEY, 
	username varchar(30) UNIQUE,
	email varchar(50) UNIQUE,
	password varchar(255), 
	prefix varchar(30),
	first_name varchar(50),
	middle_name varchar(50),
	last_name varchar(50),
	suffix varchar(30),
	student_id varchar(30) UNIQUE,
	phone_number varchar(30),
	user_type varchar(30),
	is_admin boolean DEFAULT false,
	created_date DATE DEFAULT current_date);

CREATE TABLE class (
	id SERIAL PRIMARY KEY,
	batch varchar(30),
	section int,
	advisor_id int
);