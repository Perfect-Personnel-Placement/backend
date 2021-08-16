--**************************************************************************
--**************************************************************************
-- project 3 tables
--**************************************************************************
--**************************************************************************


--//////////////////////////////////////////////////////////////////////////
-- creating regular tables
--//////////////////////////////////////////////////////////////////////////

-- creating table skills
CREATE Table IF NOT EXISTS skill (
	skillid serial NOT null primary key,
	skillname varchar UNIQUE NOT NULL
);

-- creating a table for curriculum
CREATE Table IF NOT EXISTS curriculum (
	curriculumid serial PRIMARY KEY,
	createdby varchar NOT NULL,
	createdon date NOT null default CURRENT_DATE,
	lastmodified date NOT null default CURRENT_DATE,
	lastmodifiedby varchar,
	curriculumname varchar NOT null
);

-- create table for trainer
CREATE Table IF NOT EXISTS trainer(
	trainerid serial not null primary key,
	email varchar UNIQUE not null,
	trainerfirst varchar not null,
	trainerlast varchar not null
);

-- creating table client
CREATE Table IF NOT EXISTS client (
	clientid serial not null primary key,
	clientname varchar not null
);

-- creating table for batch
CREATE Table IF NOT EXISTS batch ( 
	batchid serial PRIMARY KEY NOT NULL,
	batchsize int NOT NULL,
	enddate date NOT NULL,
	startdate date NOT NULL,
	trainerid int,
	clientid int,
	confirmed boolean default false, 
	curriculumid int NOT NULL,
	constraint batch_curriculum_fk1 foreign key (curriculumid) references curriculum(curriculumid),
	constraint batch_trainer_fk1 foreign key (trainerid) references trainer(trainerid),
	constraint batch_client_fk1 foreign key (clientid) references client(clientid)
);

-- creating a table for client demand
CREATE Table IF NOT EXISTS demand (
	demandid serial not null primary key,
	clientid int not null,
	curriculumid int not null,
	needby date not null,
	quantitydemanded int not null,
	constraint demand_client_fk1 foreign key (clientid) references client(clientid),
	constraint demand_curriculum_fk1 foreign key (curriculumid) references curriculum(curriculumid)
);

--//////////////////////////////////////////////////////////////////////////
-- creating join tables
--//////////////////////////////////////////////////////////////////////////

-- creating a table for curriculum_skills
CREATE Table IF NOT EXISTS curriculum_skill (
	skillid int NOT NULL,
	curriculumid int NOT NULL,
	CONSTRAINT skill_fk FOREIGN KEY (skillid) REFERENCES skill(skillid),
	CONSTRAINT curriculum_fk FOREIGN KEY (curriculumid) REFERENCES curriculum(curriculumid)
);

-- creating a table for trainer_skills
CREATE Table IF NOT EXISTS trainer_skill (
	trainerid int not null,
	skillid int not null,
	CONSTRAINT trainer_fk FOREIGN KEY (trainerid) REFERENCES trainer(trainerid),
	CONSTRAINT skill_fk FOREIGN KEY (skillid) REFERENCES skill(skillid)
);

-- creating a table for trainer_curriculum
CREATE Table IF NOT EXISTS trainer_curriculum (
	trainerid int not null,
	curriculumid int NOT NULL,
	CONSTRAINT trainer_fk FOREIGN KEY (trainerid) REFERENCES trainer(trainerid),
	CONSTRAINT curriculum_fk FOREIGN KEY (curriculumid) REFERENCES curriculum(curriculumid)
);