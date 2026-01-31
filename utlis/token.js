import jwt from "jsonwebtoken" 

export  function createusertoken(existinguser) {
    const payload = {
        id : existinguser.id ,  
        email : existinguser.email ,
        name : existinguser.name ,
        role : existinguser.role
    }

    
    const token = jwt.sign(
        payload ,  process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
    )
    return token 
}


export async function verifytoken(params) {
    
}