# Holiday Deal Page

A modern, responsive Next.js application for showcasing holiday travel deals with dynamic routing and interactive components.

## 🌟 Features

- **Dynamic Holiday Deal Pages**: Custom routes for each holiday package
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Components**: Image sliders, modals, and dynamic sections
- **Modern UI**: Built with Tailwind CSS for sleek styling
- **Modular Architecture**: Organized component structure for maintainability

## 🚀 Live Demo

Visit the live application: [https://holidaydealpage.netlify.app/holiday-deal/east-meets-west-kyoto-bangkok-phuket-whv1521](https://holidaydealpage.netlify.app/holiday-deal/east-meets-west-kyoto-bangkok-phuket-whv1521)

## 📁 Project Structure

```
holiday-deal-page/
├── app/
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout component
│   ├── page.js                  # Home page
│   └── holiday-deal/
│       └── [slug]/
│           └── page.js          # Dynamic holiday deal pages
├── components/
│   ├── HeroSection.js           # Hero banner component
│   ├── OverviewSection.js       # Deal overview section
│   ├── HighlightsSection.js     # Package highlights
│   ├── ItinerarySection.js      # Travel itinerary display
│   ├── HotelsSection.js         # Hotel information
│   ├── DestinationsSection.js   # Destination details
│   ├── ExcursionsSection.js     # Available excursions
│   ├── FinePrintSection.js      # Terms and conditions
│   ├── PaymentSection.js        # Payment information
│   ├── ImageSlider.js           # Image carousel component
│   └── Modal.js                 # Modal dialog component
├── lib/
│   └── api.js                   # API utilities and data fetching
├── public/
│   └── images/
│       └── placeholder.jpg      # Static assets
└── package.json                 # Project dependencies
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: JavaScript
- **Deployment**: Netlify
- **Package Manager**: npm/yarn

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/basuru07/Holiday-Deal-Page.git
   cd holiday-deal-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.


## 🚀 Deployment

### Netlify (Current)
The project is currently deployed on Netlify. To deploy your own version:

1. Fork/clone this repository
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `out` or `.next` (depending on configuration)
5. Deploy!


## 📱 Usage

### Adding New Holiday Deals
1. Create deal data in `lib/api.js`
2. The dynamic route `app/holiday-deal/[slug]/page.js` will automatically handle new URLs
3. Ensure your slug matches the data structure

### Customizing Components
Each component in the `components/` directory can be customized:
- `HeroSection.js` - Update hero banner content
- `ItinerarySection.js` - Modify itinerary display logic
- `ImageSlider.js` - Customize image carousel behavior
