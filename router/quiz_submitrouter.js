import express from "express" 
import { ensureauthenticated } from "../Middleware/autheriozation.js"
import  { Attempt_Table, Attemptedquestion_table, questionTable } from "../src/db/schema.js"
import db from "../src/index.js";
import { eq , and } from "drizzle-orm";

const router =  express.Router() 

router.use(ensureauthenticated)

router.post("/submit_quiz" , async(req , res) => {
    
    const { attempt_Id , answers} = req.body 
  const userId = req.user.id

   const [quizid]= await db
   .select({
    quiz_id : Attempt_Table.quizId
   })
   .from(Attempt_Table)
   .where(eq(Attempt_Table.attempt_Id , attempt_Id))  


   const answered = await db 
   .select({
    correct_answer : questionTable.correctAnswer ,
    questions : questionTable.question
   }).from(questionTable).where(eq(questionTable.quizId , quizid.quiz_id))


 const correctAnswers = answered.map(q => q.correct_answer);
 const questions = answered.map(item => item.questions);

console.log("correct_answer:",correctAnswers);
console.log("answers:", answers);
console.log("quiz_id received:", quizid);

 
     const attempted_answers = answers ;


  let n = 0;

for (let i = 0; i < correctAnswers.length; i++) {
  if (correctAnswers[i] === attempted_answers[i]) {
    n++;
  }
}

 
await db
  .update(Attempt_Table)
  .set({ status: false })
  .where(
    and(
      eq(Attempt_Table.attempt_Id, attempt_Id),
      eq(Attempt_Table.user_Id, userId),
      eq(Attempt_Table.status, true)
    )
  );



    const [selected_options ] = await db 
    .insert(Attemptedquestion_table)
    .values({
        attempt_Id ,
        attempted_answers : answers ,
       correctAnswer : correctAnswers ,
       questions : questions ,
       score : n ,
       
    }).returning( {result : Attemptedquestion_table.score }) 
    console.log("score :" , n)


 

    res.status(200).json({score : selected_options.result})
 
})
export default router ;