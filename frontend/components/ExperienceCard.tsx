'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Experience } from '@/lib/api';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const placeName = experience.location.split(',').pop()?.trim() || experience.location;

  return (
    <div className="bg-[#F0F0F0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
      {/* Image */}
      <div className="relative h-48 sm:h-44 w-full overflow-hidden">
        <Image
          src={experience.images[0]}
          alt={experience.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-sm font-bold text-[#161616] line-clamp-1 flex-1">
            {experience.title}
          </h3>
          <span className="text-xs font-bold text-[#161616] bg-[#BDBDBD] px-2 py-1 rounded whitespace-nowrap">
            {placeName}
          </span>
        </div>

        <p className="text-xs text-[#656565] mb-2 line-clamp-2">
          {experience.description}
        </p>

        <div className="flex justify-between items-center mt-3">
          <div>
            <span className="text-xs text-[#838383]">From </span>
            <span className="text-lg font-bold text-[#161616]">₹{experience.price}</span>
          </div>
          <Link href={`/experiences/${experience.id}`}>
            <button className="px-4 py-2 bg-[#FFD643] text-black font-bold rounded-lg text-xs cursor-pointer">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}