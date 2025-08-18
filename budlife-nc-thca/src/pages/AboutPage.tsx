import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Shield, Award, Users, MapPin, Phone, Mail, ArrowRight, Microscope, TreePine, Heart, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export function AboutPage() {
  const principles = [
    {
      icon: Shield,
      title: 'Purity',
      subtitle: '100% Organic',
      description: 'We utilize only the finest organic growing methods, ensuring our plants are free from harmful pesticides, herbicides, and synthetic fertilizers. Our commitment to purity extends from seed to shelf.',
    },
    {
      icon: Leaf,
      title: 'Potency',
      subtitle: 'Hand-Selected Genetics',
      description: 'Our master cultivators carefully select premium genetics, focusing on strains that deliver consistent potency and exceptional cannabinoid profiles. Every plant is nurtured with precision and care.',
    },
    {
      icon: Microscope,
      title: 'Proof',
      subtitle: 'Third-Party Tested',
      description: 'Radical transparency through comprehensive third-party lab testing. Every batch is rigorously tested for potency, pesticides, heavy metals, and contaminants. Your safety is our priority.',
    },
  ]

  const stats = [
    { number: '15,000', label: 'Sq Ft Facility', suffix: '+' },
    { number: '16', label: 'Week Cycles' },
    { number: '30', label: 'Day Curing', suffix: '+' },
    { number: '2021', label: 'Founded' },
  ]

  const certifications = [
    { name: 'Certified Organic', icon: Leaf },
    { name: 'Lab Verified', icon: Microscope },
    { name: 'Satisfaction Guaranteed', icon: Heart },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url("/images/hero/about_hemp_farm.jpg")'
          }}
        />
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Revolutionizing Hemp Through
              <span className="block text-emerald-400">Uncompromising Quality</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
              Founded in 2021 by master cultivators and wellness advocates, 
              we're pioneering a new standard of radical transparency in the hemp industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Shop Premium Hemp
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/lab-results"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                View Lab Results
                <Microscope className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-black-900 mb-8">
              Our Mission
            </h2>
            <blockquote className="text-2xl lg:text-3xl text-forest-700 italic font-medium max-w-4xl mx-auto leading-relaxed">
              "Revolutionize the hemp industry through uncompromising quality and radical transparency"
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-black-900 mb-6">
              Our Three Pillars
            </h2>
            <p className="text-xl text-forest-600 max-w-3xl mx-auto">
              Every decision we make, every product we craft, is guided by these fundamental principles
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-emerald-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-forest-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <principle.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black-900 mb-2 text-center">
                  {principle.title}
                </h3>
                <p className="text-emerald-600 font-semibold text-center mb-4">
                  {principle.subtitle}
                </p>
                <p className="text-forest-600 leading-relaxed text-center">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultivation Process */}
      <section className="py-20 bg-gradient-to-br from-forest-900 to-black-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                Precision Cultivation
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <TreePine className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">15,000 Sq Ft Indoor Facility</h3>
                    <p className="text-cream-200 leading-relaxed">
                      Our state-of-the-art indoor cultivation facility in California provides complete environmental control, 
                      ensuring optimal growing conditions year-round.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Climate Precision Technology</h3>
                    <p className="text-cream-200 leading-relaxed">
                      Advanced climate control systems monitor temperature, humidity, and airflow 24/7, 
                      creating the perfect environment for premium hemp cultivation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Small-Batch Artisanal Production</h3>
                    <p className="text-cream-200 leading-relaxed">
                      We prioritize quality over quantity, producing small batches that receive individual attention 
                      from our master cultivators throughout the entire growth cycle.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-cream-200 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curing Process - Enhanced Visual */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              {/* Enhanced Curing Process Visualization */}
              <div className="relative rounded-2xl shadow-2xl overflow-hidden h-[400px] bg-gradient-to-br from-amber-600 via-orange-700 to-red-800">
                {/* Professional curing facility visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <Award className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Professional Curing Facility</h3>
                    <p className="text-lg opacity-90 leading-relaxed">
                      Climate-controlled environment for optimal cannabinoid and terpene preservation
                    </p>
                  </div>
                </div>
                
                {/* Animated drying elements */}
                <div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-6 bg-green-400/30 rounded-lg transform rotate-12"
                      style={{
                        left: `${15 + (i % 4) * 20}%`,
                        top: `${20 + Math.floor(i / 4) * 25}%`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Temperature and humidity indicators */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Temperature: 65°F</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span>Humidity: 55%</span>
                  </div>
                </div>
                
                {/* Process timeline */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="flex justify-between items-center text-xs">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4+</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-green-400 to-amber-400 h-2 rounded-full w-3/4 relative">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-black-900 mb-6">
                16-Week Cycles,<br />
                <span className="text-emerald-600">30+ Day Curing</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-black-900">Extended Growth Cycles</h3>
                    <p className="text-lg text-forest-600 leading-relaxed">
                      Our 16-week growth cycles allow plants to fully develop their cannabinoid and terpene profiles, 
                      resulting in more potent and flavorful products with exceptional complexity.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-black-900">Precision Curing Process</h3>
                    <p className="text-lg text-forest-600 leading-relaxed">
                      Following harvest, we implement a minimum 30-day curing process in controlled environments. 
                      This patient approach preserves delicate compounds while enhancing flavor and aroma.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-black-900">Superior Results</h3>
                    <p className="text-lg text-forest-600 leading-relaxed">
                      The result? Premium hemp flower with exceptional cannabinoid retention and terpene expression 
                      that sets our products apart in the market. Quality you can taste and feel.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-black-900 mb-6">
              Your Trust, Our Promise
            </h2>
            <p className="text-xl text-forest-600 max-w-3xl mx-auto">
              Every product carries our commitment to excellence, backed by industry certifications and guarantees
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-shadow border border-emerald-100"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-forest-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <cert.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black-900 mb-4">
                  {cert.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-forest-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Experience Bud Life NC Hemp Co
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the revolution in hemp quality. Every product tells a story of dedication, 
              precision, and unwavering commitment to your wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-emerald-700 hover:bg-cream-100 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Shop Premium Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/lab-results"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                View All Lab Results
                <Microscope className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
