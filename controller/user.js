const { User } = require("../models");
const fs = require("fs")
const util = require("util")
const unlinkFile = util.promisify(fs.unlink)
const {S3,PutObjectCommand,DeleteObjectCommand} =require("@aws-sdk/client-s3")
const onboardingDirName='onboarding'

const s3 = new S3({
    region:process.env.REGION,
    credentials:{
        accessKeyId:process.env.ACCESS_KEY_ID,
        secretAccessKey:process.env.SECRET_ACCESS_KEY
    }

})

const uploadFile = async(file, res,bucketDirName=onboardingDirName)=>{
    const  extension = file.originalname.split(".")[1]
    const fileStream = fs.createReadStream(file.path)
    const params ={
        Bucket:process.env.BUCKET,
        Body:fileStream,
        ContentType: file.mimetype,
        Key: `${bucketDirName?bucketDirName:onboardingDirName}/${file.filename}.${extension}`,
    }

    try {
        const command = new PutObjectCommand(params)
        await s3.send(command)
        return {filename:`${file.filename}.${extension}`}
    } catch (error) {
        console.log(/error/,error);
    }
 }


const deleteFile = async(file,res,bucketDirName)=>{
    console.log(/file/,file);
    console.log(/bucketDirName/,bucketDirName);
    const extension = file.split(".")[1]
    const params = {
        Bucket:process.env.BUCKET,
        Key:`${bucketDirName||'img'}/${file}`,
    }

    try {
        const command= new DeleteObjectCommand(params)
        await s3.send(command)
    } catch (error) {
        console.log(error);
    }
}

exports.updateProfile = async(req,res)=>{
    try {
        const {id} = req.params
        const profile  = req.file
        const userDetail = await User.findOne({
            where:{
                uuid:id
            }
        })

        if(!userDetail){
            return res.status(404).json({message:"user not exist"})
        }

        if(userDetail.profile){
            let dir
            if(userDetail.profile.split(".")[1]==="zip"){
                 dir= process.env.BUCKET_DIR_NAME_zip
            }else if(userDetail.profile.split(".")[1]==="xlsx"){
                dir = process.env.BUCKET_DIR_NAME_EXCEL
            }else{
                dir= process.env.BUCKET_DIR_NAME_IMG
            }
            await deleteFile(userDetail.profile,res,dir)
        }
        let bucketDirName
        if(profile.originalname.split(".")[1]==='xlsx'){
            bucketDirName = 'excel'
        }else if(profile.originalname.split(".")[1]==='zip'){
            bucketDirName  ='zip'
        }else{
            bucketDirName= 'img'
        }
        const result  = await uploadFile(profile,res,bucketDirName)
        await userDetail.update({
            profile:result.filename
        })
        if(profile){
            await unlinkFile(profile.path)
        }
        return  res.status(200).json({message:"profile updated successfully"})

    } catch (error) {
        console.log(error);
    }
}

exports.createUser = async(req,res)=>{
    try {
        const profile  = req.file
        const { firstName,lastName,email,password } = req.body
        console.log(/profile/,profile);
       const userExist = await User.findOne({
        where:{
            email:email
        }
       })

       if(userExist){
         return res.status(400).json({message:"user already exist"})
        }
        let bucketDirName
        // console.log(/typr/,profile.originalname.split(".")[1]);
        if(profile.originalname.split(".")[1]==='xlsx'){
            bucketDirName='excel'
        }else if(profile.originalname.split(".")[1]==='zip'){
            bucketDirName='zip'
        }else{
            bucketDirName='img'
        }
        const result = await uploadFile(profile,res,bucketDirName)
        await User.create({
            firstName,
            lastName,
            email,
            password,
            profile:result.filename
        })

        if(profile){
            await unlinkFile(profile.path)
        }

       return  res.status(201).json({message:"user created successfully"})


    } catch (error) {
        console.log(error);
    }
}


exports.getProfile = async (req,res)=>{
    try {
        const {id} = req.params
        const userDetail = await User.findOne({
            where:{
                uuid:id
            },
            attributes:["uuid","firstName",'lastName',['created_at','createdAt'],'profile']
        })

        if(!userDetail){
            return res.status(404).json({message:"user not exist"})
        }
        
        
        if(userDetail.profile){
            let dir
            if(userDetail.profile.split(".")[1]==="zip"){
                 dir= process.env.BUCKET_DIR_NAME_zip
            }else if(userDetail.profile.split(".")[1]==="xlsx"){
                dir = process.env.BUCKET_DIR_NAME_EXCEL
            }else{
                dir= process.env.BUCKET_DIR_NAME_IMG
            }
            userDetail.profile = `${process.env.BASE_URL}/${process.env.BUCKET}/${dir}/${userDetail.profile}`
        }

       return res.status(201).json({message:"user fetched successfully",userDetail})



    } catch (error) {
        console.log(error);
    }
}

