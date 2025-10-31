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
    
    const slots = await prisma.slot.findMany({
      where: {
        experienceId: req.params.id,
        ...(date && { date: date as string })
      },
      orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }]
    });

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