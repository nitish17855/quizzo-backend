CREATE TYPE "public"."user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "question" (
	"questionId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "question_questionId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"quiz_id" integer NOT NULL,
	"question" text NOT NULL,
	"option1" text NOT NULL,
	"option2" text NOT NULL,
	"option3" text NOT NULL,
	"option4" text NOT NULL,
	"correct_answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz" (
	"quizId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "quiz_quizId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"subject" varchar(255) NOT NULL,
	"created_by" integer NOT NULL,
	"number_of_questions" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_quiz_id_quiz_quizId_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("quizId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;