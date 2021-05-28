import React, { useEffect } from 'react';

const Notification = ({message, type, setMessage, setType}) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {

            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message])

    return (
        message ?
        <div className={type}>
            {message}
        </div>
        :
        null
    )
}

export default Notification
