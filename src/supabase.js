import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uaxzgjmsqcooblaxccqc.supabase.co";
const supabaseAnonKey = "sb_publishable_0waeMyGiTE3-R5Y3SSYlFw_3EYTv1jj";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);