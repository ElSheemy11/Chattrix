import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom'; 
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';
import { motion } from "framer-motion"
const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("No name? Are you a ghost? 👻 ")
    if (!formData.email.trim()) return toast.error("Not even a fake one? Come on.😴")
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Bro, Your keyboard is trolling you. That's not a real email.😂")
    if (!formData.password) return toast.error("It's not secure if it's empty, buddy.🔐")
    if (formData.password.length < 6 ) return toast.error("Longer passwords = fewer regrets.")
    
    return true
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if(success === true ) signup(formData)
  }


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
    >

    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* LEFT SIDE */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* LOGO */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
              <p className='text-base-content/60'>Get started with your free account</p>
            </div>
          </div>
          {/* FORM */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Full Name</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10'>
                  <User className='size-5 text-base-content/40'  />
                </div>
                <input 
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder='Enter your full name'
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
                />
              </div>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'> Email </span>
              </label>
              <div className="relative">
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                  <Mail className='size-5 text-base-content/40'/>
                </div>
                <input 
                  type="email" 
                  className={`input input-bordered w-full pl-10`}
                  placeholder='you@example.com'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value})}
                />                
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className="relative">
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                  <Lock className='size-5 text-base-content/40'/>
                </div>
                <input 
                  type={ showPassword ? "text" : "password" }
                  className={`input input-bordered w-full pl-10`}
                  placeholder='•••••••••'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/60 hover:text-base-content z-20'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  { showPassword ? (
                    <EyeOff className="siz-5 text-primary/40 hover:text-primary cursor-pointer transition " />
                  ): (
                    <Eye className='siz-5 text-primary/40 hover:text-primary cursor-pointer transition' />
                  )}

                </button>
              </div>
            </div>
            <button 
              type='submit'
              className='btn btn-primary w-full'
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60" >
            Already have an account? {""}
            <Link to="/login" className="link link-primary font-medium no-underline">
              Sign in 
            </Link>
            </p>
          </div>
        </div>
      </div>
      {/* RIGHT SIDE */}
      
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones" 
      />

    </div>
    </ motion.div>
  )
}

export default SignUpPage
