# QR Sticker Magic

Create stunning, AI-powered QR code stickers with Google's Gemini Nano Banana. Transform any URL into beautiful, personalized stickers perfect for lost & found, marketing campaigns, and brand promotion.

## Features

- 🤖 **AI-Powered Design**: Uses Google's Gemini 2.5 Flash Image Preview to generate unique sticker designs
- 🎨 **Multiple Styles**: Choose from predefined themes (Modern, Vibrant, Nature, Tech, Vintage)
- 📱 **QR Code Integration**: Seamlessly integrates QR codes into artistic designs
- 👤 **User Authentication**: Secure authentication with Supabase
- 📊 **Analytics**: Track QR code scans and engagement
- 💾 **Dashboard**: Manage all your stickers in one place
- 🖼️ **Download**: Download high-quality sticker images
- 🌐 **Public Sharing**: Share stickers publicly or keep them private

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI**: Google Gemini 2.5 Flash Image Preview
- **QR Code Generation**: qrcode library

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google AI API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd stiqrs
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Enable Google OAuth in Supabase Auth settings (optional)
4. Copy your project URL and anon key to the environment variables

### 4. Google AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add the API key to your environment variables

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   ├── register/
│   └── s/                # Public sticker pages
├── components/            # Reusable components
│   └── ui/               # shadcn/ui components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
│   ├── supabase/        # Supabase client configuration
│   ├── gemini.ts        # Gemini AI integration
│   └── qr-code.ts       # QR code generation
└── types/               # TypeScript type definitions
```

## Key Features Implementation

### QR Code Generation

- Uses the `qrcode` library to generate QR codes from URLs
- Supports custom styling and error correction levels
- Validates and formats URLs automatically

### AI Sticker Generation

- Integrates with Google's Gemini 2.5 Flash Image Preview
- Sends QR code as base64 image data along with text prompts
- Generates cohesive sticker designs that integrate QR codes naturally

### Authentication

- Supabase Auth with email/password and Google OAuth
- Row Level Security (RLS) policies for data protection
- Automatic profile creation on user signup

### Database Schema

- `profiles`: User profile information
- `stickers`: Sticker data with QR codes and generated images
- `sticker_analytics`: Scan tracking and analytics

## API Routes

- `POST /api/stickers/generate`: Generate new stickers
- `POST /api/stickers/[id]/scan`: Track QR code scans
- `GET /s/[id]`: Public sticker view page

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Usage

1. **Sign Up**: Create an account or sign in with Google
2. **Create Sticker**: Enter a URL, title, and choose a style
3. **Generate**: Let AI create a beautiful sticker with integrated QR code
4. **Download**: Save the sticker image for printing
5. **Share**: Make stickers public for others to scan
6. **Track**: Monitor scan analytics in your dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@qrstickermagic.com or create an issue on GitHub.

---

Built with ❤️ using Next.js, Supabase, and Google Gemini AI
