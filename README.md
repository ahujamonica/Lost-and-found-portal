# Lost and Found Portal

A comprehensive full-stack web application for managing lost and found items in communities. Built with React, TypeScript, Tailwind CSS, and Supabase.

**VERCEL**: https://lost-and-found-portal-phi.vercel.app/

## Features

### 🔍 **Core Functionality**
- **Lost Item Reporting**: Users can report lost items with detailed descriptions, photos, and contact information
- **Found Item Reporting**: Community members can report items they've found
- **Advanced Search**: Filter by category, location, date range, and keywords
- **Real-time Messaging**: Direct communication between item owners and finders
- **User Dashboard**: Manage all your lost/found items in one place

### 🎨 **User Experience**
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Clean, professional design with smooth animations
- **Intuitive Navigation**: Easy-to-use interface with clear call-to-actions
- **Real-time Updates**: Instant notifications for messages and status changes

### 🔐 **Authentication & Security**
- **Secure Authentication**: Email/password login with Supabase Auth
- **Row Level Security**: Database-level security policies
- **Protected Routes**: Authentication required for sensitive actions
- **User Privacy**: Contact information only visible to authenticated users

### 📊 **Management Features**
- **Item Status Tracking**: Active, Found, Claimed, Closed statuses
- **Category Organization**: Pre-defined categories for easy browsing
- **Message History**: Complete conversation threads between users
- **Item Management**: Edit, update status, or delete items

## Tech Stack

### **Frontend**
- **React 18** with TypeScript for type safety
- **React Router DOM** for client-side routing
- **Tailwind CSS** for modern, responsive styling
- **React Hook Form** with Zod validation
- **Lucide React** for consistent iconography
- **React Hot Toast** for user notifications
- **date-fns** for date formatting and manipulation

### **Backend & Database**
- **Supabase** for backend services
  - PostgreSQL database with real-time capabilities
  - Row Level Security (RLS) policies
  - Built-in authentication system
  - RESTful APIs with auto-generated TypeScript types

### **Database Schema**
- **categories**: Item categorization system
- **lost_items**: Lost item records with full details
- **found_items**: Found item records with full details
- **item_messages**: Real-time messaging between users
- **Users managed by Supabase Auth**

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lost-found-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the migration file in your Supabase SQL editor:
     ```sql
     -- Copy and run the contents of supabase/migrations/create_lost_found_schema.sql
     ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Database Setup

The application uses a comprehensive PostgreSQL schema with the following tables:

### **Categories**
- Pre-populated with common item categories
- Extensible for custom categories

### **Items Tables** (lost_items, found_items)
- Comprehensive item details (title, description, location, dates)
- Image URL support for item photos
- Status tracking (active, found, claimed, closed)
- User relationship for ownership

### **Messaging System**
- Real-time messaging between users
- Message history and threading
- Privacy controls and permissions

### **Security**
- Row Level Security on all tables
- User-based access controls
- Public read access for browsing
- Private write access for authenticated users

## Key Features Explained

### **Search & Discovery**
- Multi-faceted search with text, category, location, and date filters
- Sorting by newest/oldest
- Responsive grid layout for optimal browsing

### **Item Management**
- Comprehensive form validation with error handling
- Image URL support with preview functionality
- Status management with dropdown controls
- Bulk operations and quick actions

### **Communication**
- Real-time messaging system
- Message threading and history
- Contact information protection
- Safe meeting recommendations

### **User Dashboard**
- Centralized item management
- Quick stats and overviews
- Status updates and bulk actions
- Message management

## Production Deployment

### **Build for Production**
```bash
npm run build
```

### **Deployment Options**
- **Vercel**: Automatic deployments from Git
- **Netlify**: Simple drag-and-drop deployment
- **Traditional hosting**: Upload `dist` folder to web server

### **Environment Variables for Production**
Ensure your production environment has the correct Supabase URLs and keys configured.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@findit.com or create an issue in this repository.

---

Built with ❤️ for communities everywhere. Help people reunite with their lost belongings!
