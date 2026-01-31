import {  ensureauthenticated  , restricttorole} from "../Middleware/autheriozation.js";
import express from "express"
import db from "../src/index.js"

import { questionTable, quizTable} from "../src/db/schema.js";

const router = express.Router()
const roleauthorized = restricttorole("ADMIN")


router.use(ensureauthenticated)
router.use(roleauthorized)


router.post("/createquiz" , async(req ,res )=>{
 const { subject , numberofquestions , questions } = req.body 
  
 await db.transaction(async(tx) => {
      const quiz = await tx.insert(quizTable)
      .values({
        subject ,
        numberofquestions , 
        createdBy : req.user.id ,
      }).returning({quizId : quizTable.quizId })
      
     
      const quizId = quiz[0].quizId ;

      for (const q of questions) {
    await tx.insert(questionTable).values({
      quizId: quizId,
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      correctAnswer: q.correct_answer
    });
  }

})

 
 

 

 res.status(200).json({message : "quiz created"})


})
export default router ; 
