CREATE TABLE IF NOT EXISTS "system-of-comments_posts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "system-of-comments_comment_files";--> statement-breakpoint
ALTER TABLE "system-of-comments_chat-members" ADD COLUMN "user_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "system-of-comments_comment_reactions" ADD COLUMN "id" varchar(255) PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "system-of-comments_comment_reactions" ADD COLUMN "comment_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "system-of-comments_comment_reactions" ADD COLUMN "chat_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "system-of-comments_comment_reactions" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "system-of-comments_comment_reactions" ADD COLUMN "reaction_type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "system-of-comments_comment_reactions" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_chat-members" ADD CONSTRAINT "system-of-comments_chat-members_user_id_system-of-comments_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."system-of-comments_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_comment_reactions" ADD CONSTRAINT "system-of-comments_comment_reactions_comment_id_system-of-comments_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."system-of-comments_comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_comment_reactions" ADD CONSTRAINT "system-of-comments_comment_reactions_chat_id_system-of-comments_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."system-of-comments_chats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system-of-comments_comment_reactions" ADD CONSTRAINT "system-of-comments_comment_reactions_user_id_system-of-comments_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."system-of-comments_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
