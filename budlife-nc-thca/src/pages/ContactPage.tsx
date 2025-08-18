import React, { useState } from 'react'
import { Mail, Phone, Clock, Send, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit form to Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (error) {
        console.error('Contact form error:', error)
        throw new Error(error.message || 'Failed to send message')
      }

      if (data?.data?.success) {
        toast.success(data.data.message || 'Message sent successfully! We\'ll get back to you soon.')
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      } else {
        throw new Error('Unexpected response from server')
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      toast.error(error.message || 'Failed to send message. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@budlifenc.com',
      description: 'Send us an email anytime',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '(828) 555-0123',
      description: 'Mon-Fri, 9AM-6PM EST',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 9AM-6PM\nSat: 10AM-4PM\nSun: Closed',
      description: 'Eastern Standard Time',
    },
    {
      icon: MessageCircle,
      title: 'Support',
      details: 'Expert guidance available',
      description: 'Product questions welcome',
    },
  ]

  const faqs = [
    {
      question: 'What is THCA?',
      answer: 'THCA (Tetrahydrocannabinolic Acid) is the non-psychoactive precursor to THC found in raw cannabis plants. When heated, THCA converts to THC.',
    },
    {
      question: 'Are your products legal?',
      answer: 'Yes, all our products contain less than 0.3% Delta-9 THC by dry weight and are federally legal under the 2018 Farm Bill.',
    },
    {
      question: 'Do you ship nationwide?',
      answer: 'We ship to most states where hemp-derived products are legal. Some restrictions apply based on state regulations.',
    },
    {
      question: 'How do I read lab results?',
      answer: 'Each product includes a QR code linking to its Certificate of Analysis (COA) showing cannabinoid content and safety testing results.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/contact_professional.jpg" 
            alt="Professional Hemp Business Environment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 via-forest-700/80 to-black/80" />
        </div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10 z-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-forest-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Get in <span className="text-gold-400">Touch</span>
            </h1>
            <p className="text-xl lg:text-2xl opacity-90 leading-relaxed mb-8">
              Have questions about our products? Need assistance with your order? 
              We're here to help you on your wellness journey.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
                <span className="font-semibold">✓ 24/7 Customer Support</span>
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
                <span className="font-semibold">✓ Expert Product Guidance</span>
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
                <span className="font-semibold">✓ Personalized Wellness Plans</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-forest-600 rounded-full flex items-center justify-center">
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <div className="text-gray-700 font-medium mb-2 whitespace-pre-line">
                  {info.details}
                </div>
                <p className="text-sm text-gray-500">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-emerald-100"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-premium w-full"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-premium w-full"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-premium w-full"
                    >
                      <option value="">Select a topic</option>
                      <option value="product-question">Product Question</option>
                      <option value="order-support">Order Support</option>
                      <option value="shipping">Shipping Inquiry</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="input-premium w-full resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-stone-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-stone-600">
                  Find quick answers to common questions about our products and services.
                </p>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card-premium p-6"
                  >
                    <h3 className="font-semibold text-stone-900 mb-3 flex items-start">
                      <MessageCircle className="w-5 h-5 text-sage-600 mr-2 mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-stone-600 leading-relaxed pl-7">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-stone-600 mb-4">
                  Don't see your question? We're here to help!
                </p>
                <a
                  href="mailto:hello@budlifenc.com"
                  className="inline-flex items-center text-sage-600 hover:text-sage-700 font-medium transition-colors"
                >
                  <Mail className="mr-2 w-4 h-4" />
                  Email us directly
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}