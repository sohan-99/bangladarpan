import { prisma } from './prisma'

export type WPPost = {
  ID: number
  post_title: string
  post_name: string | null
  post_date: string
  post_content: string
  guid?: string | null
}

type WPPostWithImage = WPPost & {
  optim_src?: string | null
  optm_status?: number | null
  post_excerpt?: string | null
}

function extractFirstImageFromHtml(html: string): string | null {
  if (!html) return null
  const m = html.match(/<img[^>]+src=["']?([^"' >]+)["']?[^>]*>/i)
  return m ? m[1] : null
}

// Helper function to check if WordPress tables exist
async function checkWPTablesExist(): Promise<boolean> {
  try {
    await prisma.$queryRawUnsafe(`SELECT 1 FROM wpj8_posts LIMIT 1`)
    return true
  } catch {
    return false
  }
}

export async function fetchWPPosts(limit = 20) {
  // Check if WordPress tables exist
  const wpTablesExist = await checkWPTablesExist()
  
  if (!wpTablesExist) {
    // Use News model if WordPress tables don't exist
    const newsItems = await prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    
    return newsItems.map((news) => ({
      id: String(news.id),
      title: news.title,
      slug: news.id.toString(),
      date: news.createdAt.toISOString(),
      content: news.content,
      image: news.image || '/assets/imaged/Adviser-prdhn-updstr-kryly.jpg',
    }))
  }
  
  // Query posts with their optimized images joined by post_id
  // Using LEFT JOIN to get posts even if they don't have optimized images
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT 
      p.ID, 
      p.post_title, 
      p.post_name, 
      p.post_date, 
      p.post_content, 
      p.guid,
      i.src as optim_src,
      i.optm_status
    FROM wpj8_posts p
    LEFT JOIN wpj8_litespeed_img_optming i ON p.ID = i.post_id
    WHERE p.post_status = 'publish' AND p.post_type = 'post'
    ORDER BY p.post_date DESC
    LIMIT ${limit}
  `)) as WPPostWithImage[]

  const posts = rows.map((r) => {
    const imageFromContent = extractFirstImageFromHtml(r.post_content)
    
    // Priority: 1) Optimized image from LiteSpeed table, 2) Image from content, 3) guid, 4) fallback
    let finalImage = '/assets/imaged/Adviser-prdhn-updstr-kryly.jpg'
    
    if (r.optim_src) {
      // Use the optimized image path from LiteSpeed table
      finalImage = String(r.optim_src)
    } else if (imageFromContent) {
      // Use image extracted from post content
      finalImage = imageFromContent
    } else if (r.guid) {
      // Use guid as fallback
      finalImage = String(r.guid)
    }
    
    return {
      id: String(r.ID),
      title: r.post_title || '(No title)',
      slug: r.post_name || String(r.ID),
      date: String(r.post_date),
      content: r.post_content || '',
      image: finalImage,
    }
  })

  return posts
}

export async function fetchWPPostsByCategory(categorySlug: string, limit = 20) {
  // Check if WordPress tables exist
  const wpTablesExist = await checkWPTablesExist()
  
  if (!wpTablesExist) {
    // Use News model if WordPress tables don't exist
    const newsItems = await prisma.news.findMany({
      where: { 
        published: true,
        category: categorySlug,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    
    return newsItems.map((news) => ({
      id: String(news.id),
      title: news.title,
      slug: news.id.toString(),
      date: news.createdAt.toISOString(),
      content: news.content,
      image: news.image || '/assets/imaged/Adviser-prdhn-updstr-kryly.jpg',
    }))
  }
  
  // Try to query with WordPress taxonomy tables - trying both wpj8_ and wp_ prefixes
  try {
    const rows = (await prisma.$queryRawUnsafe(`
      SELECT 
        p.ID, 
        p.post_title, 
        p.post_name, 
        p.post_date, 
        p.post_content, 
        p.guid,
        i.src as optim_src,
        i.optm_status
      FROM wpj8_posts p
      LEFT JOIN wpj8_litespeed_img_optming i ON p.ID = i.post_id
      INNER JOIN wp_term_relationships tr ON p.ID = tr.object_id
      INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
      INNER JOIN wp_terms t ON tt.term_id = t.term_id
      WHERE p.post_status = 'publish' 
        AND p.post_type = 'post'
        AND tt.taxonomy = 'category'
        AND t.slug = '${categorySlug}'
      ORDER BY p.post_date DESC
      LIMIT ${limit}
    `)) as WPPostWithImage[]

    const posts = rows.map((r) => {
      const imageFromContent = extractFirstImageFromHtml(r.post_content)
      
      let finalImage = '/assets/imaged/Adviser-prdhn-updstr-kryly.jpg'
      
      if (r.optim_src) {
        finalImage = String(r.optim_src)
      } else if (imageFromContent) {
        finalImage = imageFromContent
      } else if (r.guid) {
        finalImage = String(r.guid)
      }
      
      return {
        id: String(r.ID),
        title: r.post_title || '(No title)',
        slug: r.post_name || String(r.ID),
        date: String(r.post_date),
        content: r.post_content || '',
        image: finalImage,
      }
    })

    return posts
  } catch {
    // If wp_ prefix doesn't work, try wpj8_ prefix
    try {
      const rows = (await prisma.$queryRawUnsafe(`
        SELECT 
          p.ID, 
          p.post_title, 
          p.post_name, 
          p.post_date, 
          p.post_content, 
          p.guid,
          i.src as optim_src,
          i.optm_status
        FROM wpj8_posts p
        LEFT JOIN wpj8_litespeed_img_optming i ON p.ID = i.post_id
        INNER JOIN wpj8_term_relationships tr ON p.ID = tr.object_id
        INNER JOIN wpj8_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
        INNER JOIN wpj8_terms t ON tt.term_id = t.term_id
        WHERE p.post_status = 'publish' 
          AND p.post_type = 'post'
          AND tt.taxonomy = 'category'
          AND t.slug = '${categorySlug}'
        ORDER BY p.post_date DESC
        LIMIT ${limit}
      `)) as WPPostWithImage[]

      const posts = rows.map((r) => {
        const imageFromContent = extractFirstImageFromHtml(r.post_content)
        
        let finalImage = '/assets/imaged/Adviser-prdhn-updstr-kryly.jpg'
        
        if (r.optim_src) {
          finalImage = String(r.optim_src)
        } else if (imageFromContent) {
          finalImage = imageFromContent
        } else if (r.guid) {
          finalImage = String(r.guid)
        }
        
        return {
          id: String(r.ID),
          title: r.post_title || '(No title)',
          slug: r.post_name || String(r.ID),
          date: String(r.post_date),
          content: r.post_content || '',
          image: finalImage,
        }
      })

      return posts
    } catch (error2) {
      // Fallback: return all recent posts if taxonomy tables don't exist
      console.error('Category filtering not available, returning all posts:', error2)
      const rows = (await prisma.$queryRawUnsafe(`
        SELECT 
          p.ID, 
          p.post_title, 
          p.post_name, 
          p.post_date, 
          p.post_content, 
          p.guid,
          i.src as optim_src,
          i.optm_status
        FROM wpj8_posts p
        LEFT JOIN wpj8_litespeed_img_optming i ON p.ID = i.post_id
        WHERE p.post_status = 'publish' AND p.post_type = 'post'
        ORDER BY p.post_date DESC
        LIMIT ${limit}
      `)) as WPPostWithImage[]

      const posts = rows.map((r) => {
        const imageFromContent = extractFirstImageFromHtml(r.post_content)
        
        let finalImage = '/assets/imaged/Adviser-prdhn-updstr-kryly.jpg'
        
        if (r.optim_src) {
          finalImage = String(r.optim_src)
        } else if (imageFromContent) {
          finalImage = imageFromContent
        } else if (r.guid) {
          finalImage = String(r.guid)
        }
        
        return {
          id: String(r.ID),
          title: r.post_title || '(No title)',
          slug: r.post_name || String(r.ID),
          date: String(r.post_date),
          content: r.post_content || '',
          image: finalImage,
        }
      })

      return posts
    }
  }
}

export async function fetchWPPostById(postId: string) {
  // Check if WordPress tables exist
  const wpTablesExist = await checkWPTablesExist()
  
  if (!wpTablesExist) {
    // Use News model if WordPress tables don't exist
    const news = await prisma.news.findUnique({
      where: { 
        id: parseInt(postId),
        published: true,
      },
    })
    
    if (!news) {
      return null
    }
    
    return {
      id: String(news.id),
      title: news.title,
      slug: news.id.toString(),
      date: news.createdAt.toISOString(),
      content: news.content,
      excerpt: news.content.substring(0, 200),
      image: news.image || '/assets/imaged/Adviser-prdhn-updstr-kryly.jpg',
    }
  }
  
  // Fetch a single post by ID with optimized image
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT 
      p.ID, 
      p.post_title, 
      p.post_name, 
      p.post_date, 
      p.post_content, 
      p.guid,
      p.post_excerpt,
      i.src as optim_src,
      i.optm_status
    FROM wpj8_posts p
    LEFT JOIN wpj8_litespeed_img_optming i ON p.ID = i.post_id
    WHERE p.ID = ${postId} AND p.post_status = 'publish' AND p.post_type = 'post'
    LIMIT 1
  `)) as WPPostWithImage[]

  if (rows.length === 0) {
    return null
  }

  const r = rows[0]
  const imageFromContent = extractFirstImageFromHtml(r.post_content)
  
  let finalImage = '/assets/imaged/Adviser-prdhn-updstr-kryly.jpg'
  
  if (r.optim_src) {
    finalImage = String(r.optim_src)
  } else if (imageFromContent) {
    finalImage = imageFromContent
  } else if (r.guid) {
    finalImage = String(r.guid)
  }
  
  return {
    id: String(r.ID),
    title: r.post_title || '(No title)',
    slug: r.post_name || String(r.ID),
    date: String(r.post_date),
    content: r.post_content || '',
    excerpt: r.post_excerpt || '',
    image: finalImage,
  }
}
