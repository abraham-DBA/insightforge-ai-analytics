import React from 'react'
import Script from 'next/script'

const TestPage = () => {
  return (
    <div>
        <Script src="http://localhost:3000/widget.js" data-id="003cb507-8853-4f4b-821b-fe71f0e8e9de" defer></Script>
    </div>
  )
}

export default TestPage