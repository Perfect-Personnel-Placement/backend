export const batch = {
  batchId: 1,
  batchSize: 1,
  curriculumId: 1, //we provide, perhaps may change this, like name
  endDate: '1',
  startDate: '1',
  trainerId: null, //we provide, perhaps may change this, like name
  clientId: null //we provide, perhaps may change this, like name
};

export const curriculum = {
  createdby: 'nobody',
  createdon: '2021-08-05',
  curriculumname: 'fortestingonly'
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
    skillname: "whatever",
    skillId: 10
};

export const trainer = {
    trainerId: 123,
    email: "test@gmail.com",
    trainerfirst: "Robert",
    trainerlast: "Connell"
};

export const updateBatchData = {
  batchSize : 25,
  batchId: 11210034,
  curriculumId : 11211,
  endDate: '11/3/27',
  startDate: '9/3/27',
  trainerId: 299110,
  clientId: 54330,
  confirmed: true,

}
