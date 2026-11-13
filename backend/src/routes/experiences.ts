import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/experiences - List all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: experiences });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/experiences/:id - Get single experience
router.get('/:id', async (req, res) => {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: req.params.id },
      include: {
        slots: {
          orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }]
        }
      }
    });

    if (!experience) {
      return res.status(404).json({ 
        success: false, 
        message: 'Experience not found' 
      });
    }

    res.json({ success: true, data: experience });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/experiences/:id/slots - Get available slots
router.get('/:id/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const experienceId = req.params.id;

    // Verify experience exists
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId }
    });

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    let slots = await prisma.slot.findMany({
      where: {
        experienceId,
        ...(date && { date: date as string })
      },
      orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }]
    });

    // Auto-generate slots for the requested date if none exist
    if (slots.length === 0 && date) {
      const timeSlots = [
        '06:00 AM - 09:00 AM',
        '09:00 AM - 12:00 PM',
        '12:00 PM - 03:00 PM',
        '03:00 PM - 06:00 PM',
      ];

      // Create 2-3 random slots for the requested date
      const numSlots = Math.floor(Math.random() * 2) + 2;
      const createdSlots = [];
      for (let i = 0; i < numSlots; i++) {
        try {
          const slot = await prisma.slot.create({
            data: {
              experienceId,
              date: date as string,
              timeSlot: timeSlots[i],
              availableSeats: experience.maxParticipants,
              bookedSeats: Math.floor(Math.random() * 3),
            },
          });
          createdSlots.push(slot);
        } catch (err) {
          // Skip if slot already exists (unique constraint)
        }
      }

      slots = createdSlots;
    }

    const slotsWithStatus = slots.map((slot: any) => ({
      ...slot,
      isAvailable: slot.bookedSeats < slot.availableSeats,
      remainingSeats: slot.availableSeats - slot.bookedSeats
    }));

    res.json({ success: true, data: slotsWithStatus });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;