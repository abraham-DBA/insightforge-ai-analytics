import React from 'react'
import Script from 'next/script'

const TestPage = () => {
  return (
    <div>
        <Script src="http://localhost:3000/widget.js" data-id="02ef0b02-d9d1-4486-a0bd-42ab6eb59f48" defer></Script>
    </div>
  )
}

export default TestPage