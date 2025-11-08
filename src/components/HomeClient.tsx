'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

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

type HomeClientProps = {
  initialNewsData: NewsData
}

export default function HomeClient({ initialNewsData }: HomeClientProps) {
  const [newsData, setNewsData] = useState(initialNewsData);
  const [loading, setLoading] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(30);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/news/load-more?offset=${currentOffset}&limit=100`);
      const newPosts = await response.json();

      if (newPosts.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      // Add new posts to moreNews section
      const newNewsItems: NewsItem[] = newPosts.map((p: NewsItem) => ({
        id: p.id,
        title: p.title,
        image: p.image,
        category: 'খেলা',
        date: p.date,
      }));

      setNewsData({
        ...newsData,
        moreNews: [...newsData.moreNews, ...newNewsItems],
      });

      setCurrentOffset(currentOffset + 100);
      setLoading(false);
    } catch (error) {
      console.error('Error loading more news:', error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Featured News Section - Top */}
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

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mb-8">
            <button
              onClick={loadMoreNews}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
            >
              {loading ? 'লোড হচ্ছে...' : 'আরও সংবাদ দেখুন'}
            </button>
          </div>
        )}

        {!hasMore && (
          <div className="flex justify-center mb-8">
            <p className="text-gray-500 text-lg">আর কোনো সংবাদ নেই</p>
          </div>
        )}
      </div>
    </>
  );
}
