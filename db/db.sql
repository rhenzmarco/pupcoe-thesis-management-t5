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
	is_deleted boolean DEFAULT false,
);
 CREATE TABLE class_cluster (
	id SERIAL PRIMARY KEY,
	student_id int,
	class_id int
	);
 CREATE TABLE groups (
	id SERIAL PRIMARY KEY,
	group_number varchar(50),
	class_id int
);

CREATE TABLE group_cluster (
	id SERIAL PRIMARY KEY,
	group_id int,
	member_id int
);
CREATE TABLE thesis (
	id SERIAL PRIMARY KEY,
	group_id int,
	title varchar(100) NOT NULL,
	abstract varchar(500) NOT NULL,
	status varchar(50) NOT NULL,
	comment varchar(255),
	date_created date DEFAULT current_date,
	date_updated date,
	is_main boolean DEFAULT false,
	is_approved boolean DEFAULT false
);