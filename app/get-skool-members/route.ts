import { NextResponse } from 'next/server';

export async function GET() {
  // Instagram Bio redirect with UTM parameters
  return NextResponse.redirect(
    'https://www.allumi.com/?utm_source=instagram&utm_medium=bio&utm_campaign=allumi-plus-ads&utm_content=solved-dual-offer'
  );
}