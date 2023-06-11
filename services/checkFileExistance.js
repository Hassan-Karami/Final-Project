// module.js
const fs = require('fs');

  function checkIfFileExists(filePath) {
  return fs.promises
    .stat(filePath)
    .then(() => true) // File exists
    .catch((error) => {
      if (error.code === "ENOENT") {
        return false; // File does not exist
      } else {
        console.log(error);
        throw new Error("server error");
      }
    });
}

module.exports = {checkIfFileExists};

