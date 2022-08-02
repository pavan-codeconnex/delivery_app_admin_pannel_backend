const mongoose= require('mongoose')

const CredentialSchema=new mongoose.Schema({
    adminEmail:{type:String, required: true},
    passwordHash:{type:String, required:true},
    salt:{type:String, required:true}
})

Credentials=module.exports=mongoose.model("Credential",CredentialSchema)