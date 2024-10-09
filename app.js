const express  = require("express")
require("dotenv").config()
const userRoute = require("./routes/user")

const app =express()

app.use(express.json())
app.use("/api/v1",userRoute)
const port = 9000
const db  = require("./models/index")

db.sequelize.authenticate().then(()=>{
        console.log('db is connected successfully');
}).catch((error)=>{
    console.log(error);
})
app.listen(port,()=>{
    console.log(`server is up on the port ${port}`);
})