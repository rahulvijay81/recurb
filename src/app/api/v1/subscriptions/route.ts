import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '20';
  const offset = searchParams.get('offset') || '0';
  const sort = searchParams.get('sort') || 'next_renewal_date';
  const order = searchParams.get('order') || 'asc';
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');
  
  const supabase = createRouteHandlerClient({ cookies });
  
  // Verify authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: { code: '401', message: 'Unauthorized' } }, { status: 401 });
  }
  
  // Build query
  let query = supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', session.user.id)
    .order(sort, { ascending: order === 'asc' })
    .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
  
  if (tag) {
    query = query.contains('tags', [tag]);
  }
  
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    return NextResponse.json({ error: { code: '500', message: error.message } }, { status: 500 });
  }
  
  return NextResponse.json({
    data,
    meta: {
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: { code: '401', message: 'Unauthorized' } }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Add user_id to the subscription
    const subscription = {
      ...body,
      user_id: session.user.id,
    };
    
    // Insert subscription into database
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscription])
      .select();
    
    if (error) {
      return NextResponse.json({ error: { code: '500', message: error.message } }, { status: 500 });
    }
    
    return NextResponse.json({ data: data[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: { code: '500', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}