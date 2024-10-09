const config= require("../config/db")
const Sequelize = require("sequelize")

const sequelize= new Sequelize(
  config.dbName,
  config.dbUserName,
  config.dbPassword,
  {
    host:config.dbHost,
    dialect:config.dbDialect
  }
)


const db = {
  Sequelize,
  sequelize
}

db.User = require("./user")(sequelize,Sequelize)

module.exports =db