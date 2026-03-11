import React from 'react'

const email = () => {
  return (
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hi ${booking.user.name},</h2>
      <p>Your booking for <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> is confirmed.</p>
      <p>
        <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
        <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', {timeZone: 'Asia/Kolkata'})}
      </p>
      <p>Enjoy the show! 🍿</p>
      <p>Thanks for booking with us!<br/>- QuickShow Team</p>
    </div>
  )
}

export default email