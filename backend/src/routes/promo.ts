import { Router } from 'express';

const router = Router();

const PROMO_CODES: Record<string, { type: 'percentage' | 'flat', value: number }> = {
  'SAVE10': { type: 'percentage', value: 10 },
  'FLAT100': { type: 'flat', value: 100 },
  'WELCOME20': { type: 'percentage', value: 20 },
  'NEWYEAR25': { type: 'percentage', value: 25 }
};

// POST /api/promo/validate
router.post('/validate', (req, res) => {
  try {
    const { code, price } = req.body;

    if (!code || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and price are required' 
      });
    }

    const promoCode = code.toUpperCase();
    const promo = PROMO_CODES[promoCode];

    if (!promo) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid promo code' 
      });
    }

    let discount = 0;
    if (promo.type === 'percentage') {
      discount = Math.round((price * promo.value) / 100);
    } else {
      discount = Math.min(promo.value, price);
    }

    const finalPrice = Math.max(0, price - discount);

    res.json({
      success: true,
      data: {
        code: promoCode,
        discount,
        finalPrice,
        type: promo.type,
        value: promo.value
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;