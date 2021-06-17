import React from 'react'

import '../notification.css'

const Notification = ({notification}) => {
  if ('success' in notification) {
      return <div className={notification.success ? 'success' : 'error'}>{notification.message}</div>
  }
  return <div />
}

export default Notification