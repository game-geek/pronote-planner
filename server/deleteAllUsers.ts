import { auth } from "./src/firebase"


  auth
    .listUsers(1000)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        console.log('user', userRecord.toJSON());
      });
      // delete users
      auth.deleteUsers(listUsersResult.users.map((userData) => userData.uid))
      .then((deleteUsersResult) => {
        console.log(`Successfully deleted ${deleteUsersResult.successCount} users`);
        console.log(`Failed to delete ${deleteUsersResult.failureCount} users`);
        deleteUsersResult.errors.forEach((err) => {
          console.log(err.error.toJSON());
        });
      })
      .catch((error) => {
        console.log('Error deleting users:', error);
      });
    })
    .catch((error) => {
      console.log('Error listing users:', error);
    });
