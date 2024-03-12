create database db_excel_appointment;

use db_excel_appointment;

create table subsidiaries(
id_subsidiary int auto_increment not null,
subsidiary varchar(50) not null,
created_at datetime not null,
updated_at datetime,
deleted_at datetime,
primary key(id_subsidiary)
);

create table users(
id_user int auto_increment not null,
lastname varchar(50) not null,
firstname varchar(50) not null,
user varchar(50) not null,
pass varchar(255) not null,
id_type_user int not null,
id_subsidiary int not null,
created_at datetime not null,
updated_at datetime,
deleted_at datetime,
foreign key(id_subsidiary) references subsidiaries(id_subsidiary),
primary key(id_user)
);

create table appointments(
id_appointment int auto_increment not null,
date_programing date not null,
nro_documento varchar(15) not null,
last_name varchar(60) not null,
first_name varchar(60) not null,
company varchar(60) not null,
subcontract varchar(60),
protocol varchar(60),
examen_type varchar(60),
area varchar(60),
job_position varchar(60),
in_excel_programing tinyint(1) not null,
id_subsidiary int not null,
created_at datetime not null,
updated_at datetime not null,
deleted_at datetime,
foreign key(id_subsidiary) references subsidiaries(id_subsidiary),
primary key(id_appointment)
);

insert into db_excel_appointment.subsidiaries values
(1,'AREQUIPA',now(),null,null),
(2,'CHORRILLOS',now(),null,null),
(3,'COMANDANTE ESPINAR',now(),null,null),
(4,'ENCALADA',now(),null,null),
(5,'FAUCETT',now(),null,null),
(6,'HUANCAYO',now(),null,null),
(7,'MOQUEGUA',now(),null,null),
(8,'SAN BORJA',now(),null,null),
(9,'TALARA',now(),null,null);
(10,'OTROS',now(),null,null);

insert into db_excel_appointment.users values
(null,'SISTEMAS','ADMIN','admin','$2a$08$SFkT5CXUfMVVD56q.d26xOCO2dLS1b2dcQXWO8/FAaE9p2A0U2nk6',1,1,now(),null,null); /*admin.pulso*/

alter table appointments
add column project varchar(60) after job_position,
add column cost_center varchar(25) after project,
add column person_programmed varchar(60) after cost_center,
add column observation varchar(200) after person_programmed,
add column ticket_time_init time after observation,
add column ticket_time_finish time after ticket_time_init,
add column ticket_generate datetime after ticket_time_finish;

alter table subsidiaries
add column ticket_limit int after subsidiary;
