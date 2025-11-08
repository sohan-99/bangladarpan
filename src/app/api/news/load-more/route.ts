import { NextRequest, NextResponse } from 'next/server';
import { fetchWPPosts } from '@/lib/wp';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Fetch posts with offset
    const posts = await fetchWPPosts(offset + limit);
    
    // Return only the new posts (skip the offset)
    const newPosts = posts.slice(offset);

    return NextResponse.json(newPosts);
  } catch (error) {
    console.error('Error fetching more news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
