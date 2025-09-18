import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test if tables exist by querying them
    const tests = {
      users: false,
      communities: false,
      memberships: false,
      posts: false,
      revenue_attribution: false
    };

    // Test each table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    tests.users = !usersError;

    const { data: communities, error: commError } = await supabase
      .from('communities')
      .select('id')
      .limit(1);
    tests.communities = !commError;

    const { data: memberships, error: memError } = await supabase
      .from('memberships')
      .select('id')
      .limit(1);
    tests.memberships = !memError;

    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);
    tests.posts = !postsError;

    const { data: revenue, error: revError } = await supabase
      .from('revenue_attribution')
      .select('id')
      .limit(1);
    tests.revenue_attribution = !revError;

    const allTablesCreated = Object.values(tests).every(test => test === true);

    return NextResponse.json({ 
      success: allTablesCreated,
      message: allTablesCreated 
        ? '🎉 All tables created successfully!' 
        : 'Some tables are missing',
      tables: tests,
      details: {
        users: usersError?.message || 'OK',
        communities: commError?.message || 'OK',
        memberships: memError?.message || 'OK',
        posts: postsError?.message || 'OK',
        revenue_attribution: revError?.message || 'OK'
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}