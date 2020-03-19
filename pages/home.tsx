import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to home page!</h1>
      <Link href='/recipes'>
        <a>Recipes</a>
      </Link>
    </div>
  )
}
