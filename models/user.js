 module.exports = (sequelize,Sequelize)=>{
    return sequelize.define("users",{
       uuid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4
       },
       firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password:{
        type:Sequelize.STRING
      },
      lastLogin:{
        type:Sequelize.DATE
      },
      profile:{
        type:Sequelize.STRING
      },
      deleted_at:{
        type:Sequelize.DATE
      },
      created_by:{
        type:Sequelize.INTEGER
      },
      updated_by:{
        type:Sequelize.INTEGER
      },
      deleted_by:{
        type:Sequelize.INTEGER
      }

    },{
      timestamps:true,
      createdAt:"created_at",
      updatedAt:"updated_at"
    })
 }