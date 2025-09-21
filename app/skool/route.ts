import { NextResponse } from 'next/server';

export async function GET() {
  // Skool Community redirect with UTM parameters
  return NextResponse.redirect(
    'https://www.allumi.com/?utm_source=skool&utm_medium=community-about&utm_campaign=allumi-plus-ads&utm_content=solved-dual-offer'
  );
}