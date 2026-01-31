import express from "express"

import { quizTable } from "../src/db/schema.js";
import { createusertoken } from "../utlis/token.js"; 
import db from "../src/index.js";
import { eq } from "drizzle-orm";
import { ensureauthenticated } from "../Middleware/autheriozation.js";

const router = express.Router();
router.use(ensureauthenticated)
router.get("/api/quizzes", async (req, res) => {
  try {
    const name = req.user.name;
    const quizzes = await db.select({
      quizId: quizTable.quizId,
      subject: quizTable.subject,
      questions: quizTable.numberofquestions
    }).from(quizTable);

    const response = quizzes.map(q => ({
      quizId: q.quizId,
      subject: q.subject,
      totalQuestions: q.questions,
      

    }));

    res.status(200).json({data:{
      response,
      name
    }});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
});
export default router ;
