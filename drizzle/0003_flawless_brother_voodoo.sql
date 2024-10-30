CREATE TABLE IF NOT EXISTS "system-of-comments_tests" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system-of-comments_likes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"comment_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system-of-comments_reactions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"emoji" text NOT NULL,
	"user_id" varchar NOT NULL,
	"comment_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_likes" ADD CONSTRAINT "system-of-comments_likes_comment_id_system-of-comments_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."system-of-comments_comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_reactions" ADD CONSTRAINT "system-of-comments_reactions_comment_id_system-of-comments_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."system-of-comments_comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
