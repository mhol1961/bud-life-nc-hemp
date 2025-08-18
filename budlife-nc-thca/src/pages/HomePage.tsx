import React from 'react'
import { ArrowRight, Leaf, Shield, Award, Truck, Users, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Lab Tested Quality',
      description: 'Every product is third-party tested with accessible COAs for complete transparency.',
    },
    {
      icon: Leaf,
      title: 'Premium THCA',
      description: 'North Carolina grown hemp with the finest cannabinoid profiles available.',
    },
    {
      icon: Truck,
      title: 'Fast & Discreet',
      description: 'Free shipping over $75 with secure, discreet packaging nationwide.',
    },
    {
      icon: Award,
      title: 'Compliance First',
      description: 'Fully compliant with state and federal regulations, ensuring legal peace of mind.',
    },
  ]

  const categories = [
    {
      name: 'THCA Flower',
      description: 'Premium indoor-grown flower with high THCA content',
      href: '/products?category=flower',
      featured: true,
    },
    {
      name: 'CBD Edibles',
      description: 'Delicious gummies and treats for controlled dosing',
      href: '/products?category=edibles',
    },
    {
      name: 'Concentrates',
      description: 'Pure extracts and tinctures for precise effects',
      href: '/products?category=concentrates',
    },
    {
      name: 'Topicals',
      description: 'Targeted relief creams and balms',
      href: '/products?category=topicals',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Charlotte, NC',
      rating: 5,
      text: 'The quality is incredible! Lab results give me complete confidence in what I\'m consuming.',
    },
    {
      name: 'Michael R.',
      location: 'Raleigh, NC',
      rating: 5,
      text: 'Fast shipping, great packaging, and the products are exactly as described. Highly recommend!',
    },
    {
      name: 'Jessica L.',
      location: 'Asheville, NC',
      rating: 5,
      text: 'Finally found a trusted source for THCA products. The customer service is outstanding.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative premium-gradient py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="container-premium relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 leading-tight">
                Premium <span className="text-gradient">THCA</span> Products
                <br />from North Carolina
              </h1>
              <p className="text-xl lg:text-2xl text-stone-600 mb-8 leading-relaxed">
                Experience the finest hemp-derived THCA products, 
                meticulously crafted and lab-tested for your wellness journey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/products"
                  className="btn-primary text-lg px-10 py-4 hover:shadow-glow"
                >
                  Shop Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/lab-results"
                  className="btn-secondary text-lg px-10 py-4"
                >
                  View Lab Results
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-sage-100/50 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-stone-100/50 rounded-full blur-xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-6">
              Why Choose BudLife NC?
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              We're committed to providing the highest quality THCA products 
              with complete transparency and exceptional customer service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 sage-gradient rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 premium-gradient">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-6">
              Explore Our Products
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              From premium THCA flower to precisely-dosed edibles, 
              discover products crafted for your specific needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card-premium p-8 hover-lift ${category.featured ? 'lg:col-span-2' : ''}`}
              >
                <div className={category.featured ? 'text-center' : ''}>
                  <h3 className="text-2xl font-semibold text-stone-900 mb-3">
                    {category.name}
                  </h3>
                  <p className="text-stone-600 mb-6">
                    {category.description}
                  </p>
                  <Link
                    to={category.href}
                    className="inline-flex items-center text-sage-600 hover:text-sage-700 font-medium transition-colors"
                  >
                    Shop {category.name}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust BudLife NC 
              for their premium THCA needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-stone-700 mb-4 italic">
                  "{testimonial.text}"
                </blockquote>
                <div className="text-sm">
                  <div className="font-semibold text-stone-900">
                    {testimonial.name}
                  </div>
                  <div className="text-stone-500">
                    {testimonial.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 sage-gradient text-white">
        <div className="container-premium text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Stay in the Loop
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Get exclusive offers, product updates, and educational content 
              delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-l-lg sm:rounded-r-none rounded-r-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 rounded-r-lg sm:rounded-l-none rounded-l-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm opacity-70 mt-4">
              Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-stone-50 border-t border-stone-200">
        <div className="container-premium">
          <div className="flex flex-wrap items-center justify-center space-x-8 text-stone-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">10,000+ Happy Customers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Lab Tested Quality</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5" />
              <span className="text-sm font-medium">Free Shipping $75+</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}