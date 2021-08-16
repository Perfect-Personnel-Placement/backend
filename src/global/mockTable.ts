export const batch = {
  batchid: 11210034,
  batchsize: 1,
  curriculumid: 1, //we provide, perhaps may change this, like name
  enddate: '1',
  startdate: '1',
  trainerid: 123, //we provide, perhaps may change this, like name
  clientid: null //we provide, perhaps may change this, like name
};

export const batch2 = {
  batchSize: 1,
  curriculumId: 1, //we provide, perhaps may change this, like name
  endDate: '1',
  startDate: '1',
  trainerId: 123, //we provide, perhaps may change this, like name
  clientId: 345 //we provide, perhaps may change this, like name
};

export const curriculum = {
  createdby: 'nobody',
  createdon: '2021-08-05',
  curriculumname: 'fortestingonly',
  skillIdArr: [1, 2, 3]
};

export const demand = {
  clientid: 1,
  curriculumid: 1,
  needby: new Date('8/6/2021').toISOString().substring(0, 10),
  quantitydemanded: 69
};
export const sampleCurr = {
  id: '9001',
  name: 'now you see me'
};

export const skill = {
  skillName: 'whatever',
  skillId: 1
};

export const trainer = {
  trainerId: 123,
  email: 'test@gmail.com',
  trainerfirst: 'Robert',
  trainerlast: 'Connell',
  curriculaIdArr: [2, 7]
};

export const updateBatchData = {
  batchSize: 25,
  batchId: 11210034,
  curriculumId: 11211,
  endDate: '11/3/27',
  startDate: '9/3/27',
  trainerId: 299110,
  clientId: 54330,
  confirmed: false
};

export const updateTrainerData = {
  trainerid: 8,
  email: 'yes@sir.com',
  trainerfirst: 'paul',
  trainerlast: 'smith',
  curriculaIdArr: [3, 9]
};
