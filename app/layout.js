import './globals.css'

export const metadata = {
  title: {
    default: 'NurApp — আলোর পথে',
    template: '%s | NurApp'
  },
  description: 'সম্পূর্ণ ইসলামিক অ্যাপ — নামাজের সময়, কোরআন, দোয়া, তাসবিহ, কিবলা, হাদিস। আপনার ইসলামিক জীবনের সঙ্গী।',
  keywords: ['Islamic App', 'Prayer Times', 'Quran', 'Dua', 'Tasbih', 'Qibla', 'Hadith', 'নামাজ', 'কোরআন', 'দোয়া', 'তাসবিহ', 'কিবলা', 'হাদিস', 'ইসলামিক অ্যাপ'],
  authors: [{ name: 'Muhammad Shourov', url: 'https://github.com/muhammadshourov404' }],
  creator: 'Muhammad Shourov',
  publisher: 'Muhammad Shourov',
  metadataBase: new URL('https://muhammadshourov404.github.io'),
  openGraph: {
    title: 'NurApp — আলোর পথে',
    description: 'সম্পূর্ণ ইসলামিক অ্যাপ — নামাজের সময়, কোরআন, দোয়া, তাসবিহ, কিবলা, হাদিস',
    url: 'https://muhammadshourov404.github.io/nurapp',
    siteName: 'NurApp',
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NurApp — আলোর পথে',
    description: 'সম্পূর্ণ ইসলামিক অ্যাপ',
    creator: '@muhammadshourov404',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/nurapp/manifest.json',
  icons: {
    icon: '/nurapp/favicon.ico',
    apple: '/nurapp/apple-touch-icon.png',
  },
  themeColor: '#07070f',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="NurApp" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NurApp" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#07070f" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#07070f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-lg mx-auto relative">
          {children}
        </div>
      </body>
    </html>
  )
}
