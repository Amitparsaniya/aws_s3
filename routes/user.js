const express = require("express")
const { createUser, getProfile, updateProfile } = require("../controller/user")
const multer =require("multer")
const upload = multer({dest:'uploads/'})

const userRoute = express.Router()


userRoute.post("/create",upload.single("profile"),createUser)
userRoute.get("/profile/:id",getProfile)
userRoute.patch("/update/profile/:id",upload.single("profile"),updateProfile)
module.exports= userRoute