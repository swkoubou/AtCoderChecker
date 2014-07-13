drop database atcoder_checker_db;
create database atcoder_checker_db;
use atcoder_checker_db;

create table user (
	user_id varchar( 64 ) primary key,
	name varchar( 16 ) not null,
	enrollment_year int not null
) engine = InnoDB;

create table contest (
	contest_id int primary key auto_increment,
	url varchar( 64 ) not null unique,
	name varchar( 64 ) not null,
	updated_at timestamp not null default current_timestamp on update current_timestamp
) engine = InnoDB;

create table problem (
	problem_id int primary key auto_increment,
	contest_id int not null,
	assignment varchar( 8 ) not null,
	screen_name varchar( 64 ) not null,
	name varchar( 128 ) not null,

	foreign key ( contest_id ) references contest( contest_id )
) engine = InnoDB;

create table submission (
	submission_id int primary key,
	problem_id int not null,
	user_id varchar( 64 ) not null,
	score int,
	status varchar( 32 ) not null,
	language varchar( 64 ) not null,

	foreign key ( problem_id ) references problem( problem_id ),
	foreign key ( user_id ) references user( user_id )
) engine = InnoDB;
