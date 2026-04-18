import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-03-25.dahlia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    } else {
      // In development without webhook secret, skip verification
      event = JSON.parse(body);
    }

    // Handle events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.subscription && session.metadata?.userId) {
          const planTarget = session.metadata.plan || 'PRO'; // Default back to PRO

          await supabaseAdmin
            .from('profiles')
            .update({
              plan: planTarget,
              stripe_subscription_id: session.subscription as string,
              subscription_status: 'active'
            })
            .eq('id', session.metadata.userId);
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: subscription.status
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabaseAdmin
          .from('profiles')
          .update({
            plan: 'FREE',
            subscription_status: subscription.status
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
