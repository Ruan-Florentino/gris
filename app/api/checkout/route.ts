import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-03-25.dahlia' as any,
})

const PRICE_IDS = {
  PRO: process.env.STRIPE_PRICE_PRO || 'price_pro_placeholder',
  ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_placeholder'
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();
    const priceId = plan === 'ENTERPRISE' ? PRICE_IDS.ENTERPRISE : PRICE_IDS.PRO;

    // Verificar / Recuperar customer no Supabase
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, email, full_name')
      .eq('id', session.user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Criar novo customer no stripe
      const customer = await stripe.customers.create({
        email: session.user.email || profile?.email,
        name: session.user.name || profile?.full_name,
        metadata: {
          userId: session.user.id
        }
      });
      customerId = customer.id;

      // Update in Supabase
      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', session.user.id);
    }

    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        plan
      }
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
