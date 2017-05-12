/* jshint esversion:6 */
// const Contest = require('../models/Contest.js');
//
// function authorizeContest(req, res, next){
//   Contest.findById(req.params.id, (err, contests) => {
//     // If there's an error, forward it
//     if (err) { return next(err); }
//     // If there is no campaign, return a 404
//     if (!contests){ return next(new Error('404')); }
//     // If the campaign belongs to the user, next()
//     if (contests.creator.equals(req.currentUser._id)){
//       console.log("User is the owner of the campaign, authorize!");
//       return next();
//     } else {
//     // Otherwise, redirect
//       console.error("User is NOT THE OWNER");
//       return res.redirect(`/contest/${contest._id}`);
//     }
//   });
// }
//
// module.exports = authorizeContest;
