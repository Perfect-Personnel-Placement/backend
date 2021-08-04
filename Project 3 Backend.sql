--**************************************************************************
--**************************************************************************
-- project 3 tables
--**************************************************************************
--**************************************************************************


--//////////////////////////////////////////////////////////////////////////
-- creating regular tables
--//////////////////////////////////////////////////////////////////////////

DROP TABLE skills CASCADE;

-- creating table skills
CREATE Table skills (
	skillid serial NOT null primary key,
	skillname varchar NOT NULL);

DROP TABLE curriculum CASCADE;

-- creating a table for curriculum
CREATE Table curriculum (
	curriculumid serial PRIMARY KEY,
	createdby varchar NOT NULL,
	createdon date NOT null default CURRENT_DATE,
	lastmodified date NOT null default CURRENT_DATE,
	lastmodifiedby varchar,
	curriculumname varchar NOT null
);

DROP TABLE trainer CASCADE;

-- create table for trainer
CREATE Table trainer(
	trainerid serial not null primary key,
	email varchar UNIQUE not null,
	trainerfirst varchar not null,
	trainerlast varchar not null
);

DROP TABLE client CASCADE;

-- creating table client
CREATE Table client (
	clientid serial not null primary key,
	clientname varchar not null);

DROP TABLE batch CASCADE;

-- creating table for batch
CREATE Table batch ( 
	batchid serial PRIMARY KEY NOT NULL,
	batchsize int NOT NULL,
	enddate varchar NOT NULL,
	startdate varchar NOT NULL,
	trainerid int NOT NULL,
	clientid int NOT NULL,
	confirmed boolean default false, 
	curriculumid int NOT NULL,
	constraint batch_curriculum_fk1 foreign key (curriculumid) references curriculum(curriculumid),
	constraint batch_trainer_fk1 foreign key (trainerid) references trainer(trainerid),
	constraint batch_client_fk1 foreign key (clientid) references client(clientid)
 );

DROP TABLE clientdemand CASCADE;

-- creating a table for client demand
CREATE Table clientdemand (
	clientdemandid serial not null primary key,
	clientid int not null,
	curriculumid int not null,
	needby date not null,
	quantitydemanded int not null,
	constraint clientdemand_client_fk1 foreign key (clientid) references client(clientid),
	constraint clientdemand_curriculum_fk1 foreign key (curriculumid) references curriculum(curriculumid)
	);

--//////////////////////////////////////////////////////////////////////////
-- creating join tables
--//////////////////////////////////////////////////////////////////////////

DROP TABLE curriculum_skills CASCADE;

-- creating a table for curriculum_skills
CREATE Table curriculum_skills (
	skillid int NOT NULL,
	curriculumid int NOT NULL,
	CONSTRAINT skill_fk FOREIGN KEY (skillid) REFERENCES skills(skillid),
	CONSTRAINT curriculum_fk FOREIGN KEY (curriculumid) REFERENCES curriculum(curriculumid)
);

DROP TABLE trainer_skills CASCADE;

-- creating a table for trainer_skills
CREATE Table trainer_skills (
	trainerid int not null,
	skillid int not null,
	CONSTRAINT trainer_fk FOREIGN KEY (trainerid) REFERENCES trainer(trainerid),
	CONSTRAINT skills_fk FOREIGN KEY (skillid) REFERENCES skills(skillid)
);

DROP TABLE trainer_curriculum CASCADE;

-- creating a table for trainer_curriculum
CREATE Table trainer_curriculum (
	trainerid int not null,
	curriculumid int NOT NULL,
	CONSTRAINT trainer_fk FOREIGN KEY (trainerid) REFERENCES trainer(trainerid),
	CONSTRAINT curriculum_fk FOREIGN KEY (curriculumid) REFERENCES curriculum(curriculumid)
);

--**************************************************************************
--**************************************************************************
-- project 3 data to be inserted
--**************************************************************************r
--**************************************************************************

-- Example insert 
-- INSERT INTO customer_information (first_name, last_name, member_id) VALUES('Smith', 'James','esokullu@hotmail.com');

--//////////////////////////////////////////////////////////////////////////
-- creating regular table data
--//////////////////////////////////////////////////////////////////////////


-- creating table skills
INSERT INTO skills(skillid, skillname) values(357, 'React-Native');
INSERT INTO skills(skillid, skillname) values(246, 'Java-SpringBoot');
INSERT INTO skills(skillid, skillname) values(975, 'Python-DevOps');
INSERT INTO skills(skillid, skillname) values(405, 'Angular-AWS');
INSERT INTO skills(skillid, skillname) values(111, 'R-MATLAB');


-- creating a table for curriculum
INSERT INTO curriculum(curriculumid, createdby, lastmodifiedby, curriculumname) values(1, 'Jack', 'Liz', 'React/AWS');
INSERT INTO curriculum(curriculumid, createdby, lastmodifiedby, curriculumname) values(2, 'Noah', 'Lisa', 'Python/DevOps');
INSERT INTO curriculum(curriculumid, createdby, lastmodifiedby, curriculumname) values(3, 'Joe', 'James', 'React/React-Native');
INSERT INTO curriculum(curriculumid, createdby, lastmodifiedby, curriculumname) values(4, 'Les', 'Sergio', 'React/AWS');
INSERT INTO curriculum(curriculumid, createdby, lastmodifiedby, curriculumname) values(5, 'Elle', 'Sergio', 'Python/DevOps');
INSERT INTO curriculum(curriculumid, createdby, lastmodifiedby, curriculumname) values(6, 'Luke', 'Lisa', 'React/React-Native');


-- creating a table for trainer
insert into trainer (trainerid, email, trainerfirst, trainerlast) values (123, 'testemail@gmail.com', 'myfirstname' , 'mylastname');
insert into trainer (trainerid, email, trainerfirst, trainerlast) values (124, 'hotmail@gmail.com', 'myname' , 'myothername');
insert into trainer (trainerid, email, trainerfirst, trainerlast) values (125, 'spamemail@gmail.com', 'Gibs' , 'Mr gibs');
insert into trainer (trainerid, email, trainerfirst, trainerlast) values (126, '??????????@gmail.com', 'greg' , 'gregs last name');
insert into trainer (trainerid, email, trainerfirst, trainerlast) values (127, 'cashformoney@gmail.com', 'rick' , 'morty');
insert into trainer (trainerid, email, trainerfirst, trainerlast) values (128, 'dudewhatsmyemail@gmail.com', 'bart' , 'simpson');


-- creating table client
insert into client (clientid, clientname) values (1234, 'big pharma');
insert into client (clientid, clientname) values (1235, 'small pharma');
insert into client (clientid, clientname) values (1236, 'other pharma');
insert into client (clientid, clientname) values (1237, 'big pharmacy');
insert into client (clientid, clientname) values (1238, 'big drug dealer');
insert into client (clientid, clientname) values (1239, 'huge vaccine');


-- creating table for batch
INSERT INTO batch (batchid, batchsize, curriculumid, enddate, startdate, trainerid, clientid, confirmed) VALUES (123, 25, 1, '5/1/2021', '3/1/2021', 123, 1234, false);
INSERT INTO batch (batchid, batchsize, curriculumid, enddate, startdate, trainerid, clientid, confirmed) VALUES (456, 23, 1, '7/1/2021', '5/1/2021', 124, 1235, false);
INSERT INTO batch (batchid, batchsize, curriculumid, enddate, startdate, trainerid, clientid, confirmed) VALUES (789, 23, 2, '3/15/2021', '1/15/2021', 125, 1236, false);
INSERT INTO batch (batchid, batchsize, curriculumid, enddate, startdate, trainerid, clientid, confirmed) VALUES (101, 22, 3, '6/21/2021', '4/21/2021', 125, 1237, false);
INSERT INTO batch (batchid, batchsize, curriculumid, enddate, startdate, trainerid, clientid, confirmed) VALUES (516, 15, 4, '9/12/2021', '7/12/2021', 124, 1235, false);
INSERT INTO batch (batchid, batchsize, curriculumid, enddate, startdate, trainerid, clientid, confirmed) VALUES (940, 28, 6, '4/13/2021', '2/13/2021', 126, 1234, false);


-- creating a table for client demand
INSERT INTO clientdemand (clientid, clientdemandid, curriculumid, needby, quantitydemanded) VALUES (1234, 1111, 1, '7/1/21', 10);
INSERT INTO clientdemand (clientid, clientdemandid, curriculumid, needby, quantitydemanded) VALUES (1235, 1121, 2, '9/1/21', 18);
INSERT INTO clientdemand (clientid, clientdemandid, curriculumid, needby, quantitydemanded) VALUES (1236, 1113, 3, '4/1/21', 23);
INSERT INTO clientdemand (clientid, clientdemandid, curriculumid, needby, quantitydemanded) VALUES (1234, 1131, 4, '5/1/21', 25);
INSERT INTO clientdemand (clientid, clientdemandid, curriculumid, needby, quantitydemanded) VALUES (1237, 1114, 5, '6/1/21', 30);
INSERT INTO clientdemand (clientid, clientdemandid, curriculumid, needby, quantitydemanded) VALUES (1236, 1141, 6, '7/1/21', 12);


--//////////////////////////////////////////////////////////////////////////
-- creating join table data
--//////////////////////////////////////////////////////////////////////////

-- create data for curriculum_skills
INSERT INTO curriculum_skills(curriculumid, skillid) values(1, 357);
INSERT INTO curriculum_skills(curriculumid, skillid) values(2, 246);
INSERT INTO curriculum_skills(curriculumid, skillid) values(3, 975);
INSERT INTO curriculum_skills(curriculumid, skillid) values(4, 405);
INSERT INTO curriculum_skills(curriculumid, skillid) values(5, 111);

     
-- create data for trainer_skill
INSERT INTO trainer_skills (trainerid, skillid) VALUES (123, 357);
INSERT INTO trainer_skills (trainerid, skillid) VALUES (124, 246);
INSERT INTO trainer_skills (trainerid, skillid) VALUES (125, 975);
INSERT INTO trainer_skills (trainerid, skillid) VALUES (126, 405);

-- create data for trainer_curriculum
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(123, 1);
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(124, 2);
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(125, 3);
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(126, 4);
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(127, 5);
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(128, 6);






