import './globals.css';
     import { Inter } from 'next/font/google';

     const inter = Inter({ subsets: ['latin'] });

     export const metadata = {
       title: 'TravelDeals - Unforgettable Experiences',
       description: 'Discover amazing travel deals and book your dream vacation today.',
     };

     export default function RootLayout({ children }) {
       return (
         <html lang="en">
           <body className={inter.className}>{children}</body>
         </html>
       );
     }