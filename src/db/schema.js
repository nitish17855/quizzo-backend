import { boolean } from "drizzle-orm/gel-core";
import {
  pgTable,
  pgEnum,
  integer,
  varchar,
  text
} from "drizzle-orm/pg-core";


export const userRoleEnum = pgEnum("user_role", [
  "USER",
  "ADMIN",
]); // important 

export const usersTable = pgTable("users", {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
   name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  role: userRoleEnum()
    .notNull()
    
    .default("USER"),
});

/* ---------- QUIZ ---------- */
export const quizTable = pgTable("quiz", {
  quizId: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  subject : varchar({length:255}).notNull() ,
  createdBy: integer("created_by")
    .references(() => usersTable.id)
    .notNull(),
    numberofquestions : integer().notNull() , 
});

/* ---------- QUESTION ---------- */
export const questionTable = pgTable("question", {
  questionId: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  quizId: integer("quiz_id")
    .references(() => quizTable.quizId)
    .notNull(),
  question: text().notNull(),
  option1: text().notNull(),
  option2: text().notNull(),
  option3: text().notNull(),
  option4: text().notNull(),
  correctAnswer: text("correct_answer").notNull(),
});

export const Attempt_Table = pgTable("attempt" , {
  attempt_Id : integer().primaryKey().generatedAlwaysAsIdentity() , 
  user_Id : integer() ,
  quizId : integer().notNull() ,
  status : boolean()
  })

export const Attemptedquestion_table = pgTable("attempted" , {
  attempt_Id : integer().notNull() ,
  questions : text().notNull() ,
  attempted_answers : text() ,
  correctAnswer : text("correct_answer")  ,
  score : integer() 
})
