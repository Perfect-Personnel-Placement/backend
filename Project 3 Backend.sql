--**************************************************************************
--**************************************************************************
-- project 3 tables
--**************************************************************************
--**************************************************************************


--//////////////////////////////////////////////////////////////////////////
-- creating regular tables
--//////////////////////////////////////////////////////////////////////////

--drop table skills;
--drop table curriculum;
--drop table client;
--drop table batch;
--drop table trainer;
--drop table clientdemand;
--drop table curriculum-skills;
--drop table trainer-skills;
--drop table trainer-curriculum;

-- creating table skills
CREATE Table skills (
	skillid serial NOT null primary key,
	skillname varchar NOT NULL);

-- creating a table for curriculum
CREATE Table curriculum (
	curriculumid serial PRIMARY KEY,
	createdby varchar NOT NULL,
	createdon date NOT null default CURRENT_DATE,
	lastmodified date NOT null default CURRENT_DATE,
	lastmodifiedby varchar,
	curriculumname varchar NOT null
);

-- creating a table for trainer
CREATE Table trainer(
	trainerid serial not null primary key,
	email varchar UNIQUE not null,
	trainerfirst varchar not null,
	trainerlast varchar not null
);

-- creating table client
CREATE Table client (
	clientid serial not null primary key,
	clientname varchar not null);

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

CREATE Table curriculum_skills (
	skillid int NOT NULL,
	curriculumid int NOT NULL,
	CONSTRAINT skill_fk FOREIGN KEY (skillid) REFERENCES skills(skillid),
	CONSTRAINT curriculum_fk FOREIGN KEY (curriculumid) REFERENCES curriculum(curriculumid)
);

CREATE Table trainer_skills (
	trainerid int not null,
	skillid int not null,
	CONSTRAINT trainer_fk FOREIGN KEY (trainerid) REFERENCES trainer(trainerid),
	CONSTRAINT skills_fk FOREIGN KEY (skillid) REFERENCES skills(skillid)
);

CREATE Table trainer_curriculum (
	trainerid int not null,
	curriculumid int NOT NULL,
	CONSTRAINT trainer_fk FOREIGN KEY (trainerid) REFERENCES trainer(trainerid),
	CONSTRAINT curriculum_fk FOREIGN KEY (curriculumid) REFERENCES curriculum(curriculumid)
);




