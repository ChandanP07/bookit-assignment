'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSearch = pathname === '/' || pathname.startsWith('/experiences');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    if (searchQuery === '' && searchParams.get('search')) {
      router.push('/');
    }
  }, [searchQuery, searchParams, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Highway Delite"
                width={100}
                height={100}
                className="object-cover pb-2"
              />
          </Link>

          {showSearch && (
            <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search experiences"
                className="flex-1 sm:flex-none px-4 py-2 bg-[#F0F0F0] border border-[#D6D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-primary sm:w-96 text-sm placeholder:text-[#838383]"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[#FFD643] text-black font-semibold rounded-md text-sm whitespace-nowrap"
              >
                Search
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}