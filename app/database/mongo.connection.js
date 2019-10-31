const settings = require('../config/config');
const logger   = require('../config/logger');
const mongoose = require('mongoose');
const uri = process.env.MONGO_DB || settings.database.MONGO_DB

var dbConnection;

function connect(){
    return new Promise((resolve, reject) => {
        if(!dbConnection) {
            mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useNewUrlParser: true, reconnectInterval: 500, reconnectTries: Number.MAX_VALUE});
            dbConnection = mongoose.connection;
            dbConnection.on('error', (err) => {
              logger.error(err)
              reject(err)
            });
            dbConnection.once('open', function() {
                resolve(dbConnection)
            })
        } else {
            return resolve(dbConnection);
        }
    });
}

module.exports = {
  connect: () => {
    return new Promise((resolve, reject) => {
      connect().then(dbConnection => {
        resolve();
      }).catch((error) => { 
        return reject(error)
      })
    });
  },
  db: () => {
    return new Promise((resolve, reject) => {
      connect().then(dbConnection => {
        resolve(dbConnection);
      }).catch((error) => { 
        return reject(error)
      })
    });
  }
};
