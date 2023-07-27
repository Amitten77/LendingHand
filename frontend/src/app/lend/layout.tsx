import React from 'react'

export default function LendLayout({children,}: {
    children: React.ReactNode
  }) {
    return (
    <>
    <main>
        {children}
    </main>
    </>
  )
}
