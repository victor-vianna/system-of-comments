DO $$ BEGIN
 ALTER TABLE "system-of-comments_chats" ADD CONSTRAINT "system-of-comments_chats_author_id_system-of-comments_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."system-of-comments_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
