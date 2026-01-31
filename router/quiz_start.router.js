import express from "express"
import { Attempt_Table, questionTable, quizTable } from "../src/db/schema.js"
import { ensureauthenticated } from "../Middleware/autheriozation.js"
import db from "../src/index.js";
import { eq , and } from "drizzle-orm";

const router = express.Router();

router.use(ensureauthenticated);

router.post("/attempt-quiz/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;
   console.log(userId)
 
    const [quiz] = await db
      .select({ quizId: quizTable.quizId })
      .from(quizTable)
      .where(eq(quizTable.quizId, quizId));

    if (!quiz) {
      return res.status(400).json({ err: "Quiz not found" });
    }

    
    const [existingAttempt] = await db
      .select({
        attemptId: Attempt_Table.attempt_Id,
        status: Attempt_Table.status,
      })
      .from(Attempt_Table)
      .where(
        and(
          eq(Attempt_Table.user_Id, userId),
          eq(Attempt_Table.quizId, quizId),
          eq(Attempt_Table.status, true)
        )
      );

    let attemptId;

   
    if (existingAttempt) {
      attemptId = existingAttempt.attemptId;
    } else {
      const [newAttempt] = await db
        .insert(Attempt_Table)
        .values({
          quizId,
          user_Id: userId,
          status: true,
        })
        .returning({ attemptId: Attempt_Table.attempt_Id });

      attemptId = newAttempt.attemptId;
    }


    const questions = await db
      .select({
        question: questionTable.question,
        option1: questionTable.option1,
        option2: questionTable.option2,
        option3: questionTable.option3,
        option4: questionTable.option4,
      })
      .from(questionTable)
      .where(eq(questionTable.quizId, quizId));

   
    return res.status(200).json({
      data: {
        attempt_Id: attemptId,
        questions,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "Internal server error" });
  }
});

export default router;
