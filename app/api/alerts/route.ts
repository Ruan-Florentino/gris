import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: alerts, error } = await supabaseAdmin
      .from('alerts')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) throw error;
    return NextResponse.json({ alerts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is PRO
    if ((session.user as any).plan === 'FREE') {
      return NextResponse.json({ error: 'Alerts are a PRO feature' }, { status: 403 });
    }

    const { mineral_type, region, radius_km } = await req.json();

    const { data, error } = await supabaseAdmin
      .from('alerts')
      .insert({
        user_id: session.user.id,
        mineral_type,
        region,
        radius_km: radius_km || 500,
        active: true
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ alert: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
