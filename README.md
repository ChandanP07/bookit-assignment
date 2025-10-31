# BookIt: Travel Experience Booking Platform

Full-stack web application for booking travel experiences.

## Live Demo

- **Frontend**: https://bookit-assignment-9cjg.vercel.app/
- **Backend API**: https://bookit-backend-drc0.onrender.com/api/health

## Tech Stack

**Frontend:**
- Next.js 14
- TypeScript
- TailwindCSS
- Axios

**Backend:**
- Node.js
- Express
- PostgreSQL
- Prisma ORM

## Features

- Browse travel experiences
- Real-time slot availability
- Booking management
- Promo code validation (SAVE10, FLAT100, WELCOME20, NEWYEAR25)
- Responsive design
- Transaction safety

## Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Experience Details
![Details Page](screenshots/details.png)
![Details Page](screenshots/details2.png)

### Checkout
![Checkout Page](screenshots/checkout.png)

### Booking Confirmation
![Success Page](screenshots/success.png)



## Local Development

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update DATABASE_URL in .env
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Update NEXT_PUBLIC_API_URL in .env.local
npm run dev
```

## API Endpoints

- `GET /api/experiences` - List all experiences
- `GET /api/experiences/:id` - Get experience details
- `GET /api/experiences/:id/slots` - Get available slots
- `POST /api/bookings` - Create booking
- `POST /api/promo/validate` - Validate promo code

## Testing

1. Visit the live site
2. Browse experiences
3. Select date & time slot
4. Complete booking with test promo codes
5. View confirmation

## Deployment

- **Backend**: Render.com (PostgreSQL + Node.js)
- **Frontend**: Vercel (Next.js)

## Author

[Chandan Prajapati]
- Email: chandan789633@gmail.com
- GitHub: [@ChandanP07](https://github.com/ChandanP07)

## Assignment

This project was created for the Highway Delite Full Stack Developer Internship assignment.

**Submitted on**: October 31, 2025

---

Built with for Highway Delite