import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const experiences = [
  {
    title: 'Sunrise Trek to Tiger\'s Nest',
    description: 'Experience the magical sunrise at Bhutan\'s iconic monastery perched on a cliff.',
    location: 'Paro, Bhutan',
    price: 2500,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
    category: 'Adventure',
    duration: '6 hours',
    highlights: ['Professional mountain guide', 'Traditional breakfast', 'Photography session', 'Temple visit'],
    maxParticipants: 10
  },
  {
    title: 'Scuba Diving',
    description: 'Dive into crystal-clear waters and explore vibrant coral reefs.',
    location: 'Havelock Island, Andaman',
    price: 3500,
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
    category: 'Water Sports',
    duration: '4 hours',
    highlights: ['PADI certified instructor', 'All equipment included', 'Underwater photography', 'Safety briefing'],
    maxParticipants: 8
  },
  {
    title: 'Desert Safari',
    description: 'Experience the golden sands of Thar Desert with camel rides and cultural performances.',
    location: 'Jaisalmer, Rajasthan',
    price: 1800,
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800'],
    category: 'Cultural',
    duration: '8 hours',
    highlights: ['Camel safari', 'Desert camping', 'Folk music & dance', 'Authentic Rajasthani dinner'],
    maxParticipants: 15
  },
  {
    title: 'Paragliding',
    description: 'Soar through the skies at one of Asia\'s best paragliding spots.',
    location: 'Bir, Himachal Pradesh',
    price: 2800,
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1546779175-a70fdbd4481d?w=800'],
    category: 'Adventure',
    duration: '3 hours',
    highlights: ['Tandem flight with expert pilot', 'GoPro video recording', 'Insurance included', 'Safety gear provided'],
    maxParticipants: 6
  },
  {
    title: 'Backwater Houseboat Stay',
    description: 'Cruise through Kerala\'s serene backwaters in a traditional houseboat.',
    location: 'Alleppey, Kerala',
    price: 4500,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'],
    category: 'Leisure',
    duration: '24 hours',
    highlights: ['Private houseboat', 'Kerala meals included', 'Village tour', 'Sunset cruise'],
    maxParticipants: 4
  },
  {
    title: 'Wildlife Safari',
    description: 'Spot majestic Bengal tigers in their natural habitat.',
    location: 'Ranthambore, Rajasthan',
    price: 3200,
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1549366021-9f761d450615?w=800'],
    category: 'Wildlife',
    duration: '5 hours',
    highlights: ['Expert naturalist guide', 'Open-top jeep safari', 'Bird watching', 'Breakfast included'],
    maxParticipants: 6
  },
  {
    title: 'Yoga Retreat',
    description: 'Find inner peace with daily yoga sessions by the Ganges.',
    location: 'Rishikesh, Uttarakhand',
    price: 2200,
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'],
    category: 'Wellness',
    duration: '3 Days',
    highlights: ['Daily yoga sessions', 'Meditation classes', 'Ayurvedic meals', 'Ganga Aarti'],
    maxParticipants: 12
  },
  {
    title: 'Tea Plantation Tour',
    description: 'Walk through lush tea estates and enjoy fresh brews with panoramic views.',
    location: 'Munnar, Kerala',
    price: 1200,
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800'],
    category: 'Nature',
    duration: '4 hours',
    highlights: ['Tea factory visit', 'Tea tasting session', 'Scenic viewpoints', 'Local guide'],
    maxParticipants: 20
  }
];

router.post('/seed', async (req, res) => {
  try {
    // Clear existing data
    await prisma.booking.deleteMany();
    await prisma.slot.deleteMany();
    await prisma.experience.deleteMany();

    console.log('🧹 Cleared existing data');

    // Create experiences
    const createdExperiences = [];
    for (const exp of experiences) {
      const created = await prisma.experience.create({ data: exp });
      createdExperiences.push(created);
    }

    console.log(`✅ Created ${createdExperiences.length} experiences`);

    // Create slots
    const getDate = (daysFromNow: number): string => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      return date.toISOString().split('T')[0];
    };

    const timeSlots = [
      '06:00 AM - 09:00 AM',
      '09:00 AM - 12:00 PM',
      '12:00 PM - 03:00 PM',
      '03:00 PM - 06:00 PM'
    ];

    let slotCount = 0;
    for (const exp of createdExperiences) {
      for (let day = 0; day < 5; day++) {
        const date = getDate(day);
        for (const timeSlot of timeSlots) {
          await prisma.slot.create({
            data: {
              experienceId: exp.id,
              date,
              timeSlot,
              availableSeats: exp.maxParticipants,
              bookedSeats: Math.floor(Math.random() * 3)
            }
          });
          slotCount++;
        }
      }
    }

    console.log(`✅ Created ${slotCount} slots`);

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        experiences: createdExperiences.length,
        slots: slotCount
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Seed failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;