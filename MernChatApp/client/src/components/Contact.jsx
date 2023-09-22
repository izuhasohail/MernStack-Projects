import React from 'react'
import Avatar from './Avatar'
const Contact = ({id,onClick,selected,username,online}) => {
  return (
    <div
            key={id}
            onClick={() => onClick(id)}
            className={
              "border-b border-gray-100  flex gap-2 items-center cursor-pointer " +
              (selected ? "bg-blue-50" : "")
            }
          >
            {selected && (
              <div className="w-1 bg-blue-600 h-16 rounded-r-md"></div>
            )}

            <div className=" flex gap-2 py-4 pl-2 items-center">
              <Avatar online={online} username={username} userId={id} />
              <span className=" text-gray-500 font-mono font-semibold">
                {username}
              </span>
            </div>
          </div>
  )
}

export default Contact
