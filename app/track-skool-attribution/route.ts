import { NextResponse } from 'next/server';

export async function GET() {
  // Twitter Bio redirect with UTM parameters
  return NextResponse.redirect(
    'https://www.allumi.com/?utm_source=twitter&utm_medium=bio&utm_campaign=allumi-plus-ads&utm_content=solved-dual-offer'
  );
}