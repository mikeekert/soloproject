CREATE TABLE "public"."user_game" (
    "usergame_id" serial,
    "user_id" integer,
    "game_id" integer,
    "progress" numeric(12,2),
    "completed" boolean DEFAULT 'false',
    "nowplaying" boolean DEFAULT 'false',
    "timetobeat" numeric(12,2) DEFAULT '20'::numeric,
    PRIMARY KEY ("usergame_id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE,
    FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE
);