import { createClient, SupabaseClient } from '@supabase/supabase-js'


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function createMockQuery() {
  const result = Promise.resolve({ data: null, error: null, count: 0 })

  const query = {
    select: () => query,
    update: (data?: unknown) => query,
    eq: () => query,
    or: () => query,
    neq: () => query,
    order: () => query,
    limit: () => query,
    insert: (data?: unknown) => Promise.resolve({ data, error: null }),
    upsert: (data?: unknown) => Promise.resolve({ data, error: null }),
    delete: () => query,
    single: () => result,
    then: result.then.bind(result),
    catch: result.catch.bind(result),
    finally: result.finally.bind(result),
  }

  return query
}

function createMockSupabase() {
  const query = createMockQuery()

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
      signInWithPassword: async () => ({ data: { session: null, user: null }, error: new Error('Supabase is not configured') }),
      signOut: async () => ({ error: null }),
    },
    from: () => query,
    storage: {
      from: () => ({
        upload: async (path: string) => ({ data: { path }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
      }),
    },
  }
}

export const supabase = (supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (createMockSupabase() as any)) as SupabaseClient<any, any, any>



