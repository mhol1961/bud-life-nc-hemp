import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Shield, Award, Users, MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'Every product undergoes rigorous third-party lab testing to ensure purity, potency, and safety.',
    },
    {
      icon: Leaf,
      title: 'Natural Excellence',
      description: 'We source only the finest hemp from trusted North Carolina growers committed to sustainable practices.',
    },
    {
      icon: Award,
      title: 'Compliance & Trust',
      description: 'Full adherence to state and federal regulations ensures legal, reliable products you can trust.',
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Your wellness journey is our priority. We provide education, support, and exceptional service.',
    },
  ]

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '99.9%', label: 'Purity Guaranteed' },
    { number: '48 hrs', label: 'Average Shipping' },
    { number: '5 Stars', label: 'Customer Rating' },
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      description: 'Former pharmaceutical researcher with 15 years of experience in cannabinoid science.',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Quality',
      description: 'Certified lab technician ensuring every batch meets our rigorous quality standards.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Success',
      description: 'Dedicated to helping customers find the right products for their wellness needs.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="premium-gradient py-20">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-6">
              About <span className="text-gradient">BudLife NC</span>
            </h1>
            <p className="text-xl lg:text-2xl text-stone-600 leading-relaxed">
              We're North Carolina's premier source for lab-tested, premium THCA products, 
              committed to your wellness journey through quality, transparency, and trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-6">
                Our Story
              </h2>
            </motion.div>
            
            <div className="prose prose-lg mx-auto text-stone-600">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Founded in the heart of North Carolina, BudLife NC began with a simple mission: to provide access to 
                premium, lab-tested THCA products that support wellness and elevate daily life. Our founders, 
                passionate about the therapeutic potential of hemp-derived cannabinoids, recognized the need for 
                a trusted source of high-quality products in the rapidly evolving cannabis industry.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                What started as a small operation has grown into North Carolina's leading THCA retailer, serving 
                thousands of customers who trust us for consistency, quality, and compliance. We work exclusively 
                with licensed North Carolina hemp farmers who share our commitment to sustainable growing practices 
                and product excellence.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Every product in our catalog undergoes rigorous third-party lab testing, and we make Certificate 
                of Analysis (COA) documents readily available to our customers. This transparency isn't just good 
                business—it's essential for building the trust that the cannabis industry needs to thrive.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 premium-gradient">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              These core principles guide everything we do, from sourcing and testing 
              to customer service and community engagement.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-8"
              >
                <div className="w-12 h-12 sage-gradient rounded-lg flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-sage-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-stone-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 premium-gradient">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              The passionate experts behind BudLife NC, dedicated to bringing you 
              the finest THCA products with unmatched quality and service.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-8 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-sage-100 rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-sage-600" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-sage-600 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-stone-600">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-6">
                Rooted in North Carolina
              </h2>
              <p className="text-xl text-stone-600">
                Proudly serving customers nationwide from our home in the beautiful 
                mountains of Asheville, North Carolina.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold text-stone-900 mb-6">
                  Visit Us
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-sage-600" />
                    <span className="text-stone-700">
                      123 Mountain View Drive<br />
                      Asheville, NC 28801
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-sage-600" />
                    <span className="text-stone-700">(828) 555-0123</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-sage-600" />
                    <span className="text-stone-700">hello@budlifenc.com</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link
                    to="/contact"
                    className="inline-flex items-center text-sage-600 hover:text-sage-700 font-medium transition-colors"
                  >
                    Get in touch
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card-premium p-8"
              >
                <h3 className="text-xl font-semibold text-stone-900 mb-4">
                  Why North Carolina?
                </h3>
                <p className="text-stone-600 leading-relaxed mb-4">
                  North Carolina's ideal climate and rich agricultural heritage make it 
                  perfect for cultivating premium hemp. Our state's commitment to 
                  agricultural innovation and sustainable farming practices ensures 
                  we can source the finest raw materials.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  From the mountains to the coast, we're proud to support local 
                  farmers and contribute to North Carolina's growing hemp industry.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sage-gradient text-white">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Experience the BudLife NC Difference
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their 
              premium THCA needs. Quality, transparency, and your wellness 
              are our top priorities.
            </p>
            <Link
              to="/products"
              className="bg-white text-sage-700 hover:bg-stone-100 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              Shop Premium Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}