import './globals.css'

export const metadata = {
  title: 'NurApp — আলোর পথে',
  description: 'Islamic App - নামাজের সময়, কোরআন, দোয়া, তাসবিহ',
  keywords: 'Islamic, Quran, Prayer, Dua, Tasbih, নামাজ, কোরআন, দোয়া',
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/nurapp/favicon.ico" />
        <meta name="theme-color" content="#0f4c2a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gray-950 text-white">
        {children}
      </body>
    </html>
  )
}
