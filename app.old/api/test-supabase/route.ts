import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test connection by checking auth
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error && error.message !== 'Auth session missing!') {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Supabase connected successfully!',
      user: user || 'No user logged in',
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}