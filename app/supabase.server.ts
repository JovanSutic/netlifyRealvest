import { createServerClient, parse, serialize } from '@supabase/ssr'
export const createSupabaseServerClient = (request: Request) => {
  const cookies = parse(request.headers.get('Cookie') ?? '')
  const headers = new Headers()
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL_LOCAL!,
    process.env.SUPABASE_KEY_LOCAL!,
    {
      cookies: {
        get(key) {
          return cookies[key]
        },
        set(key, value, options) {
          headers.append('Set-Cookie', serialize(key, value, options))
        },
        remove(key, options) {
          headers.append('Set-Cookie', serialize(key, '', options))
        },
      },
    },
  )
  return { supabaseClient, headers }
}