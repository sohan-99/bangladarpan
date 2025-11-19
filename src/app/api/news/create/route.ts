import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const featuredImage = formData.get('featuredImage') as File | null;
    const reporterImage = formData.get('reporterImage') as File | null;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Handle featured image upload
    let featuredImagePath = null;
    if (featuredImage && featuredImage.size > 0) {
      const bytes = await featuredImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'news');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const filename = `${uniqueSuffix}-${featuredImage.name.replace(/\s/g, '-')}`;
      const filepath = join(uploadDir, filename);

      // Save file
      await writeFile(filepath, buffer);
      featuredImagePath = `/uploads/news/${filename}`;
    }

    // Handle reporter image upload (if needed in future)
    if (reporterImage && reporterImage.size > 0) {
      const bytes = await reporterImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), 'public', 'uploads', 'reporters');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const filename = `${uniqueSuffix}-${reporterImage.name.replace(/\s/g, '-')}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      // reporterImagePath can be stored in future if needed
    }

    // Create news in database
    const news = await prisma.news.create({
      data: {
        title,
        content,
        category: category || 'Uncategorized',
        image: featuredImagePath,
        published: true, // Always publish when creating news
      },
    });

    console.log('✅ News created successfully:', {
      id: news.id,
      title: news.title,
      category: news.category,
      published: news.published,
      createdAt: news.createdAt,
    });

    return NextResponse.json({
      success: true,
      message: 'News created successfully!',
      news: {
        id: news.id,
        title: news.title,
        category: news.category,
        published: news.published,
      },
    });

  } catch (error) {
    console.error('❌ Error creating news:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create news', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
