import express from "express";
import userRouter from "./router/auth.router.js";
import createquiz from "./role/admin.js";
import attempt_quiz from "./router/quiz_start.router.js"
import submit_quiz from "./router/quiz_submitrouter.js"
import get_quiz from "./router/get_quiz.js"
import result from "./router/result.js"
import cors from "cors";
console.log("🔥 THIS FILE IS RUNNING 🔥");
const app = express(); 

 
// ✅ CORS FIRST

const PORT = process.env.PORT || 4000;
              


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://quizzo-frontend-26ru.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

app.use(express.json());     

app.get("/", (req, res) => {
  console.log("✅ ROOT ROUTE HIT");
  res.send("Backend is running");
});

app.use("/user", userRouter);   
app.use("/user" , createquiz)
app.use("/user" , attempt_quiz)
app.use("/user" , submit_quiz)
app.use("/user" , get_quiz)
app.use("/user" , result)

app.listen(PORT, () => {  
  console.log(`Server running on port ${PORT}`);
});
