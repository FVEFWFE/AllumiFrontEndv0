import { NextResponse } from 'next/server';

export async function GET() {
  // Skool Profile redirect with UTM parameters
  return NextResponse.redirect(
    'https://www.allumi.com/?utm_source=skool&utm_medium=profile-bio&utm_campaign=allumi-plus-ads&utm_content=solved-dual-offer'
  );
}