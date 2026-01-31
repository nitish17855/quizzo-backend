import express from "express";
import db from "../src/index.js";
import { eq } from "drizzle-orm";
import { Attemptedquestion_table } from "../src/db/schema.js";
import { ensureauthenticated } from "../Middleware/autheriozation.js";

const router = express.Router();
router.use(ensureauthenticated);

router.get("/result/:attempt_Id", async (req, res) => {
  try {
    const { attempt_Id } = req.params;

    const result = await db
      .select({
        questions: Attemptedquestion_table.questions,
        attempted_answers: Attemptedquestion_table.attempted_answers,
        correctAnswer: Attemptedquestion_table.correctAnswer,
        score: Attemptedquestion_table.score,
      })
      .from(Attemptedquestion_table)
      .where(eq(Attemptedquestion_table.attempt_Id, attempt_Id));

    if (result.length === 0) {
      return res.status(404).json({ message: "Result not found" });
    }

    const data = result[0]; // ← THIS was missing in your brain

    const cleanResult = {
      score: data.score,
      questions: data.questions,
      correctAnswers: data.correctAnswer,
      attemptedAnswers: data.attempted_answers,
    };

    res.status(200).json(cleanResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
