
import '../globals.css'
import Navbar from '@/components/Navbar'
import { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'






export const metadata: Metadata = {
  title: 'Lending Hand',
  description: 'Illini Blockchain Lending Hand Platform!',
  icons: {
    icon: '/IlliniBlockchain.svg',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet='utf-8'></meta>
        <title>Lending Hand</title>
      </head>
      <body>
      <div className='text-black'>
      <AuthProvider>
        <Navbar></Navbar>
            {children}
        </AuthProvider>
        </div>
        </body>
    </html>
  )
}
