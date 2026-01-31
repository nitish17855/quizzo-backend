import jwt from "jsonwebtoken"

export const ensureauthenticated =  function(req , res ,next) { 
    const auth = req.headers.authorization 
     if(!auth) {
        res.status(404).json({message :"authorization is empty "}) 

     }
 
     const token = auth.split(" ")[1] 
     try {
       const  decoded = jwt.verify(token, process.env.JWT_SECRET ) 
        req.user = decoded 
 next()
     } 
     catch(err)
     {
      console.error(err.name, err.message);
res.status(404).json({message :"error"})
     }
}



export const restricttorole = function(role) {
  return function(req,res,next) { if (req.user.role != role) {
      return res.status(404).json({message:"u are not authorized for this "})
   }
   return next()
  }

}