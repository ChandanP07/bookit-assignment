// src/routes/bookings.ts

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

// POST /api/bookings - Create booking
router.post('/',
  [
    body('experienceId').isUUID().withMessage('Invalid experience ID'),
    body('slotId').isUUID().withMessage('Invalid slot ID'),
    body('userName').trim().notEmpty().withMessage('Name is required'),
    body('userEmail').isEmail().withMessage('Valid email is required'),
    body('userPhone').trim().notEmpty().withMessage('Phone is required'),
    body('participants').isInt({ min: 1 }).withMessage('At least 1 participant required'),
    body('totalPrice').isNumeric().withMessage('Total price is required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    try {
      const { 
        experienceId, 
        slotId, 
        userName, 
        userEmail, 
        userPhone, 
        participants, 
        promoCode,
        discount = 0,
        originalPrice,
        totalPrice 
      } = req.body;

      // Use transaction to prevent race conditions
      const result = await prisma.$transaction(async (tx) => {
        // Verify experience exists
        const experience = await tx.experience.findUnique({
          where: { id: experienceId }
        });

        if (!experience) {
          throw new Error('Experience not found');
        }

        // Check slot availability
        const slot = await tx.slot.findUnique({
          where: { id: slotId }
        });

        if (!slot) {
          throw new Error('Slot not found');
        }

        const remainingSeats = slot.availableSeats - slot.bookedSeats;
        if (participants > remainingSeats) {
          throw new Error(`Only ${remainingSeats} seats available`);
        }

        // Update slot booking
        await tx.slot.update({
          where: { id: slotId },
          data: {
            bookedSeats: {
              increment: participants
            }
          }
        });

        // Create booking
        const booking = await tx.booking.create({
          data: {
            experienceId,
            slotId,
            userName,
            userEmail,
            userPhone,
            participants,
            promoCode,
            discount,
            originalPrice: originalPrice || totalPrice,
            totalPrice,
            status: 'confirmed'
          },
          include: {
            experience: true,
            slot: true
          }
        });

        return booking;
      });

      res.status(201).json({ 
        success: true, 
        message: 'Booking confirmed successfully',
        data: result 
      });

    } catch (error: any) {
      console.error('Booking error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message || 'Booking failed' 
      });
    }
  }
);

// GET /api/bookings/:id - Get booking details
router.get('/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        experience: true,
        slot: true
      }
    });
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;