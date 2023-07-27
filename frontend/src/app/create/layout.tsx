import React from 'react'

export default function CreateLayout({children,}: {
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
