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
    title: 'কোনো খবর পাওয়া যায়নি',
    image: '/assets/imaged/Adviser-prdhn-updstr-kryly.jpg',
    category: 'সাধারণ',
    date: '',
  }

  const topNews = posts.slice(1, 7)
  const categoryNewsItems = posts.slice(7, 15)
  const moreNews = posts.slice(15, 30)

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Sidebar - Small News Items */}
          <div className="space-y-4">
            {newsData.topNews.slice(0, 5).map((news) => (
              <Link href={`/news/${news.id}`} key={news.id}>
                <div className="flex gap-3 pb-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="relative w-24 h-20 shrink-0">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-3 mb-1">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-500">{news.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Center - Large Featured News */}
          <div className="lg:col-span-1">
            <Link href={`/news/${newsData.featuredNews.id}`}>
              <div className="relative h-[400px] lg:h-[500px] group">
                <Image
                  src={newsData.featuredNews.image}
                  alt={newsData.featuredNews.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6">
                  <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 mb-2">
                    {newsData.featuredNews.category}
                  </span>
                  <h2 className="text-white text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">
                    {newsData.featuredNews.title}
                  </h2>
                  <p className="text-gray-300 text-sm">{newsData.featuredNews.date}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Sidebar - Small News Items */}
          <div className="space-y-4">
            {newsData.topNews.slice(0,5).map((news) => (
              <Link href={`/news/${news.id}`} key={news.id}>
                <div className="flex gap-3 pb-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="relative w-24 h-20 shrink-0">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-3 mb-1">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-500">{news.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {newsData.categoryNews.map((categorySection) => (
            <div key={categorySection.category}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-600">
                {categorySection.category}
              </h2>
              <div className="space-y-4">
                {categorySection.items.map((news) => (
                  <Link href={`/news/${news.id}`} key={news.id}>
                    <div className="group">
                      <div className="relative h-48 mb-2">
                        <Image
                          src={news.image}
                          alt={news.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-3 group-hover:text-red-600 transition-colors mb-1">
                        {news.title}
                      </h3>
                      <p className="text-xs text-gray-500">{news.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Video News Section */}
        {newsData.videoNews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-600">
              ভিডিও
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newsData.videoNews.map((video) => (
                <Link href={`/news/${video.id}`} key={video.id}>
                  <div className="group">
                    <div className="relative h-48 mb-2">
                      <Image
                        src={video.image}
                        alt={video.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                          <FaPlay className="text-red-600 group-hover:text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-3 group-hover:text-red-600 transition-colors mb-1">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-500">{video.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* More News Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-600">
            আরও সংবাদ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.moreNews.map((news) => (
              <Link href={`/news/${news.id}`} key={news.id}>
                <div className="group">
                  <div className="relative h-48 mb-2">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <span className="inline-block text-red-600 text-xs font-semibold mb-1">
                    {news.category}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-500">{news.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
