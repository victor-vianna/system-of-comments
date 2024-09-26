CREATE TABLE IF NOT EXISTS "system-of-comments_chat-members" (
	"chat_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system-of-comments_chats" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"author_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system-of-comments_comments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"chat_id" varchar NOT NULL,
	"content" text NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system-of-comments_comment_mentions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"chat_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"comment_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system-of-comments_comment_files" (

);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system-of-comments_comment_reactions" (

);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system-of-comments_file_references" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"comment_id" varchar(255),
	"title" varchar(255) NOT NULL,
	"format" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"author_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system-of-comments_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"avatar" text,
	"name" text NOT NULL,
	"email" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_chat-members" ADD CONSTRAINT "system-of-comments_chat-members_chat_id_system-of-comments_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."system-of-comments_chats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_comments" ADD CONSTRAINT "system-of-comments_comments_chat_id_system-of-comments_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."system-of-comments_chats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_comments" ADD CONSTRAINT "system-of-comments_comments_author_id_system-of-comments_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."system-of-comments_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_comment_mentions" ADD CONSTRAINT "system-of-comments_comment_mentions_chat_id_system-of-comments_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."system-of-comments_chats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_comment_mentions" ADD CONSTRAINT "system-of-comments_comment_mentions_user_id_system-of-comments_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."system-of-comments_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_comment_mentions" ADD CONSTRAINT "system-of-comments_comment_mentions_comment_id_system-of-comments_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."system-of-comments_comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_file_references" ADD CONSTRAINT "system-of-comments_file_references_comment_id_system-of-comments_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."system-of-comments_comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_file_references" ADD CONSTRAINT "system-of-comments_file_references_author_id_system-of-comments_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."system-of-comments_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
