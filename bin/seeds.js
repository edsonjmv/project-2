/*jshint esversion: 6*/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project2');
const User = require('../models/User');
const Group = require('../models/Group');
const Contest = require('../models/Contest');

const user = [
  {
    username: 'Nombre',
    password: 'test'
  }
];
User.create(user, (err, docs) => {
  if (err) {
    throw err;
  }
  docs.forEach((user) => {
    console.log(product.name);
  });
  mongoose.connection.close();
});


const contest = [
  {
    name: 'Nombre',
    hashtag: 'Nombre',
    finalDate: 'Nombre',
    picPath: 'Nombre',
    prize: 'Nombre',
  }
];
Contest.create(contest, (err, docs) => {
  if (err) {
    throw err;
  }
  docs.forEach((product) => {
    console.log(product.name);
  });
  mongoose.connection.close();
});

// const group = [
//   {
//     contestId: 'Nombre',
//     userId: 'test'
//
//   }
// ];
// Group.create(group, (err, docs) => {
//   if (err) {
//     throw err;
//   }
//   docs.forEach((product) => {
//     console.log(product.name);
//   });
//   mongoose.connection.close();
// });
