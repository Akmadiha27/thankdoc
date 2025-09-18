# ThankYouDoc - Complete Healthcare Platform

A comprehensive healthcare platform built with React, TypeScript, and Supabase that allows users to search for doctors, book appointments, and manage their health journey.

## 🚀 Features

### For Patients
- **Doctor Search**: Find doctors by specialization, location, and ratings
- **Advanced Filtering**: Filter by location, consultation type, and availability
- **Appointment Booking**: Book online or in-person consultations
- **Multiple Payment Options**: Pay online via QR code or pay at clinic
- **User Dashboard**: Manage appointments, view medical history, and track health records
- **Membership System**: Premium members get 4 free appointments
- **Real-time Notifications**: Get updates about appointment status

### For Doctors
- **Doctor Profiles**: Comprehensive profiles with qualifications, experience, and reviews
- **Appointment Management**: View and manage patient appointments
- **Patient Records**: Access patient medical history and notes
- **Revenue Tracking**: Monitor consultation fees and payments

### For Administrators
- **Super Admin Dashboard**: Manage doctors, users, and system settings
- **Doctor Management**: Add, edit, and verify doctor profiles
- **Data Scraping**: Automated doctor data extraction from Practo
- **Analytics**: View system statistics and user engagement
- **Membership Management**: Track premium memberships and usage

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Payment Integration**: Razorpay QR Payment
- **State Management**: React Hooks, Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React, React Icons
- **Styling**: Tailwind CSS with custom medical theme

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── BottomNavigation.tsx
│   ├── Footer.tsx
│   ├── ProtectedRoute.tsx
│   └── QRPayment.tsx
├── pages/              # Application pages
│   ├── SearchPage.tsx
│   ├── DoctorProfilePage.tsx
│   ├── BookingsPage.tsx
│   ├── ProfilePage.tsx
│   ├── AdminDashboard.tsx
│   └── SuperAdminDashboard.tsx
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions
└── utils/              # Helper functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akmadiha27/thankdoc.git
   cd thankdoc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`
   - Deploy the Edge Functions in `supabase/functions/`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database Schema

### Key Tables
- **doctors**: Doctor profiles with qualifications, experience, and ratings
- **appointments**: Patient appointments with booking details
- **profiles**: User profiles and preferences
- **memberships**: Premium membership tracking
- **user_roles**: Role-based access control

### Key Features
- **Row Level Security (RLS)**: Secure data access
- **Real-time subscriptions**: Live updates
- **Edge Functions**: Serverless backend logic
- **Database migrations**: Version-controlled schema changes

## 🔐 Authentication & Authorization

- **Supabase Auth**: Email/password and OAuth (Google)
- **Role-based Access**: User, Admin, Super Admin roles
- **Protected Routes**: Secure page access
- **Session Management**: Automatic token refresh

## 💳 Payment Integration

- **Razorpay Integration**: Secure payment processing
- **QR Code Payments**: Mobile-friendly payment flow
- **Multiple Payment Methods**: Online and offline options
- **Payment Tracking**: Transaction history and status

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Progressive Web App**: Installable on mobile devices
- **Cross-platform**: Works on all modern browsers
- **Accessibility**: WCAG compliant design

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your server to serve the SPA

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@thankyoudoc.com or create an issue in the GitHub repository.

## 🔮 Future Enhancements

- [ ] Video consultation integration
- [ ] AI-powered symptom checker
- [ ] Prescription management
- [ ] Lab test booking
- [ ] Health records management
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

**ThankYouDoc** - Your health is our priority. Connect with the best doctors in your area.