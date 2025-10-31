'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { experienceApi, Experience } from '@/lib/api';
import ExperienceCard from '@/components/ExperienceCard';

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await experienceApi.getAll();
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (err) {
      setError('Failed to load experiences');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = experiences.filter(exp =>
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExperiences(filtered);
    } else {
      setFilteredExperiences(experiences);
    }
  }, [searchQuery, experiences]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-56 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={fetchExperiences}
          className="mt-4 px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-secondary transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-light py-4 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto px-4 flex-1 overflow-y-auto">
        {searchQuery && (
          <h1 className="text-2xl font-bold text-dark mb-6">
            Results for "{searchQuery}"
          </h1>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </div>
    </div>
  );
}