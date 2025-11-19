import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import HomeClient from '@/components/HomeClient';
import { fetchWPPosts } from '@/lib/wp';

type NewsItem = {
  id: string
  title: string
  image: string
  category?: string
  date?: string
}

type NewsData = {
  featuredNews: NewsItem
  topNews: NewsItem[]
  categoryNews: { category: string; items: NewsItem[] }[]
  videoNews: NewsItem[]
  moreNews: NewsItem[]
}

export default async function Home() {
  const posts = await fetchWPPosts(30)

  const featuredNews = posts[0] ?? {
    id: '0',
    title: 'কোনো খবর পাওয়া যায়নি',
    image: '/assets/imaged/Adviser-prdhn-updstr-kryly.jpg',
    category: 'সাধারণ',
    date: '',
  }

  // Remove duplicates using Set
  const uniquePosts = Array.from(new Map(posts.map(post => [post.id, post])).values())

  const topNews = uniquePosts.slice(1, 7)
  const categoryNewsItems = uniquePosts.slice(7, 15)
  const moreNews = uniquePosts.slice(15, 30)

  const newsData: NewsData = {
    featuredNews: {
      id: featuredNews.id,
      title: featuredNews.title,
      image: featuredNews.image,
      category: 'সাধারণ',
      date: featuredNews.date,
    },
    topNews: topNews.map((p) => ({ id: p.id, title: p.title, image: p.image, category: 'সাধারণ', date: p.date })),
    categoryNews: [
      {
        category: 'সর্বশেষ',
        items: categoryNewsItems.map((p) => ({ id: p.id, title: p.title, image: p.image, date: p.date })),
      },
    ],
    videoNews: [],
    moreNews: moreNews.map((p) => ({ id: p.id, title: p.title, image: p.image, category: 'সামগ্রিক', date: p.date })),
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-4">
        <Header />
        <Navigation />
      </div>

      <HomeClient initialNewsData={newsData} />
    </div>
  );
}
