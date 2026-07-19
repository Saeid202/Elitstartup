import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const missingConfigError =
	"Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.";

const missingConfigClient = new Proxy(
	{},
	{
		get() {
			throw new Error(missingConfigError);
		}
	}
) as SupabaseClient;

export const supabase =
	supabaseUrl && supabaseAnonKey
		? createClient(supabaseUrl, supabaseAnonKey)
		: missingConfigClient;
