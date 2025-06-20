import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

const MessageInput = () => {

    const [ text, setText ] = useState("");
    const [ imagePreview, setImagePreview ] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage, selectedUser } = useChatStore();
    const { authUser, socket } = useAuthStore()
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith('image/')) {
            toast.error("C’mon now, even my grandma knows how to pick an image! 📁😂");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };
    
    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
    
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });
            // Clear form
            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            toast.error("sorry, something went wrong! 😢");
            console.error("Error sending message:", error);
        }
    };


    const typingTimeout = useRef();

    const chatId = authUser && selectedUser ? 
    [authUser._id, selectedUser._id].sort().join('-') : null;

    const handleTyping = () => {
        if (!socket || !authUser) {
            console.warn("Socket or authUser not available for typing event");
            return
        };
        socket.emit("typing", { 
            chatId,
            sender: authUser.fullName,
        });
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socket.emit("stop typing", { chatId });
        }, 3000)
    }
    const handleTextChange = (e) => {
        setText(e.target.value);
        handleTyping();
    };
    useEffect(() => {
    return () => {
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
    };
}, []);

  return (
    <div className='p-4 w-full'>
      { imagePreview && (
        <div className="mb-3 flex items-center gap-2">
            <div className="relative">
                <img 
                    src={imagePreview} 
                    alt="Preview"
                    className='size-20 object-cover rounded-lg border border-zinc-700' 
                />
                <button
                    onClick={removeImage}
                    className='absolute -top-1.5 -right-1.5 size-5 hover:bg-red-500/80 rounded-full flex items-center justify-center cursor-pointer bg-base-300/80 transition-colors'
                    type='button'
                >
                    <X className='size-3 ' />
                </button>
            </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className="flex-1 flex gap-2">
            <input 
                type="text" 
                className='w-full input input-bordered rounded-lg input-sm sm:input-md'
                placeholder='Type a message...'
                value={text}
                onChange={handleTextChange}
            />
            <input 
                type="file" 
                accept='image/*'
                className='hidden'
                ref={fileInputRef}
                onChange={handleImageChange}
            />
            <button 
            type='button'
                className={`hidden sm:flex btn btn-circle rounded-lg
                    ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                    onClick={() => fileInputRef.current?.click()}
            >
                <Image size={20} />
            </button>
        </div>
        <button
            type='submit'
            className='btn btn-sm btn-circle rounded-lg p-1 size-10'
            disabled={!text.trim() && !imagePreview}
        >
            <Send size={22} />
        </button>
      </form>

    </div>
  )
}

export default MessageInput
