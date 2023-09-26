import React from 'react'

const CustomButton = ({ fun, text }) => {
    return (
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2' onClick={fun}>{text}</button>
    )
}

export default CustomButton