"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_1 = require("./src/firebase");
firebase_1.auth
    .listUsers(1000)
    .then(function (listUsersResult) {
    listUsersResult.users.forEach(function (userRecord) {
        console.log('user', userRecord.toJSON());
    });
    // delete users
    firebase_1.auth.deleteUsers(listUsersResult.users.map(function (userData) { return userData.uid; }))
        .then(function (deleteUsersResult) {
        console.log("Successfully deleted ".concat(deleteUsersResult.successCount, " users"));
        console.log("Failed to delete ".concat(deleteUsersResult.failureCount, " users"));
        deleteUsersResult.errors.forEach(function (err) {
            console.log(err.error.toJSON());
        });
    })
        .catch(function (error) {
        console.log('Error deleting users:', error);
    });
})
    .catch(function (error) {
    console.log('Error listing users:', error);
});
