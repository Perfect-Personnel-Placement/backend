--**************************************************************************
--**************************************************************************
-- project 3 Data
--**************************************************************************
--**************************************************************************


--//////////////////////////////////////////////////////////////////////////
-- creating regular table data
--//////////////////////////////////////////////////////////////////////////


-- creating table skills
INSERT INTO skill(skillid, skillname) values(357, 'React-Native');
INSERT INTO skill(skillid, skillname) values(246, 'Java-SpringBoot');
INSERT INTO skill(skillid, skillname) values(975, 'Python-DevOps');
INSERT INTO skill(skillid, skillname) values(405, 'Angular-AWS');
INSERT INTO skill(skillid, skillname) values(111, 'R-MATLAB');


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
INSERT INTO demand (clientid, demandid, curriculumid, needby, quantitydemanded) VALUES (1234, 1111, 1, '7/1/21', 10);
INSERT INTO demand (clientid, demandid, curriculumid, needby, quantitydemanded) VALUES (1235, 1121, 2, '9/1/21', 18);
INSERT INTO demand (clientid, demandid, curriculumid, needby, quantitydemanded) VALUES (1236, 1113, 3, '4/1/21', 23);
INSERT INTO demand (clientid, demandid, curriculumid, needby, quantitydemanded) VALUES (1234, 1131, 4, '5/1/21', 25);
INSERT INTO demand (clientid, demandid, curriculumid, needby, quantitydemanded) VALUES (1237, 1114, 5, '6/1/21', 30);
INSERT INTO demand (clientid, demandid, curriculumid, needby, quantitydemanded) VALUES (1236, 1141, 6, '7/1/21', 12);


--//////////////////////////////////////////////////////////////////////////
-- creating join table data
--//////////////////////////////////////////////////////////////////////////

-- create data for curriculum_skills
INSERT INTO curriculum_skill(curriculumid, skillid) values(1, 357);
INSERT INTO curriculum_skill(curriculumid, skillid) values(2, 246);
INSERT INTO curriculum_skill(curriculumid, skillid) values(3, 975);
INSERT INTO curriculum_skill(curriculumid, skillid) values(4, 405);
INSERT INTO curriculum_skill(curriculumid, skillid) values(5, 111);

     
-- create data for trainer_skill
INSERT INTO trainer_skill (trainerid, skillid) VALUES (123, 357);
INSERT INTO trainer_skill (trainerid, skillid) VALUES (124, 246);
INSERT INTO trainer_skill (trainerid, skillid) VALUES (125, 975);
INSERT INTO trainer_skill (trainerid, skillid) VALUES (126, 405);

-- create data for trainer_curriculum
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(123, 1);
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(124, 2);
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(125, 3);
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(126, 4);
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(127, 5);
INSERT INTO trainer_curriculum(trainerid, curriculumid) values(128, 6);