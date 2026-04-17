import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
)

// Servidor apenas (ignora RLS se necessario em webhooks)
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : supabase;

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
  return data
}

export async function updateUserPlan(userId: string, plan: string, stripeData: {
  customerId?: string
  subscriptionId?: string
  status?: string
}) {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      plan,
      stripe_customer_id: stripeData.customerId,
      stripe_subscription_id: stripeData.subscriptionId,
      subscription_status: stripeData.status
    })
    .eq('id', userId)
  
  if (error) throw error
}
