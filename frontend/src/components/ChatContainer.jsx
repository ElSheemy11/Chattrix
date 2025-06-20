import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from "../store/useChatStore"
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessagesSkeleton from './skeletons/MessagesSkeleton'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/utils'

const ChatContainer = () => {

  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages,unsubscribeFromMessages  } = useChatStore()
  const { socket, authUser } = useAuthStore()
  const [ isTyping, setisTyping ] = useState(false);
  const chatId = [authUser._id, selectedUser._id].sort().join('-');
  
  useEffect(() => {
    getMessages(selectedUser._id)
    
     if (socket && chatId) {
    socket.emit("join", { chatId });
        socket.emit("join", { chatId });
  }

    subscribeToMessages()
  
    return () => {
      unsubscribeFromMessages( )
    }
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, socket, chatId])

  const messageEndRef = useRef(null);
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView( { behavior: "smooth" } )
  
  };
  
  useEffect(() => {
    scrollToBottom();
  }, []) // For user sending a message
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // for new messages coming in
  
  useEffect(() => {
    if (!socket) return;
    socket.on("display typing", (msg) => {
      setisTyping(msg)

    })
    
    socket.on("remove typing", () => {
      setisTyping("");
    })
    
    return () => {
      socket.off("display typing");
      socket.off("remove typing");
    }
  }, [socket]);

  if(isMessagesLoading) {
    return (
     <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className='flex-1 flex flex-col overflow-auto'
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <MessagesSkeleton />
        <MessageInput />
      </div>
    </motion.div>
   )
}

  
  return (
        <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className='flex-1 flex flex-col overflow-auto'
    >
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        { messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${ message.senderId === authUser._id ? "chat-end " : "chat-start" }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img 
                  src={message.senderId === authUser._id ?
                    authUser.profilePic || "/avatar.png" 
                    : selectedUser.profilePic || "/avatar.png"} 
                  alt="profile pic" />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className='text-xs opacity-50 ml-1'>
                { formatMessageTime(message.createdAt) }
              </time>
            </div>

            <div className={`flex flex-col max-w-[80%] rounded-xl p-3 shadow-sm 
                              ${message.senderId === authUser._id ? " bg-primary text-primary-content " :       " bg-base-200 "}`}>
              {message.image && (
                <img 
                src={message.image} 
                alt="Attachment"
                className='sm:max-w-[200px] rounded-md mb-2' 
              />)}
              {message.text && ( <p>{message.text}</p> )}
              
            </div>
            
            <div ref={messageEndRef} />
                
          </div>
          
        )) }
        
      </div>
        {isTyping && (
          <div className="flex items-end gap-2 px-4 pb-4">
            <div className="flex items-center gap-2 bg-base-200 rounded-full px-3 py-2 shadow-md animate-bounce-in">
              <video 
                src="/isTyping.webm"
                autoPlay
                loop
                muted
                className="h-6 w-auto opacity-80 drop-shadow-md"
                style={{ background: "transparent" }}
              />
              <span className="text-xs text-zinc-400 italic animate-pulse">
                {isTyping}
              </span>
            </div>
          </div>
        )}
    
      <MessageInput />

      </div>
    </motion.div>
  )
}

export default ChatContainer
