import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Shield, Star, Award, ChevronDown, Play, Pause, Truck, Clock, Users, CheckCircle } from 'lucide-react'
import { ImageCarousel, ScrollingBanner } from '@/components/ImageCarousel'

const HomePage = () => {
  // Hero carousel data with professional THCA hemp imagery
  const heroSlides = [
    {
      id: 'premium-thca-flowers',
      title: 'Premium THCA Flowers',
      subtitle: 'Hand-selected genetics with exceptional potency',
      description: 'Our premium THCA flowers showcase visible trichomes and complex terpene profiles for the ultimate experience.',
      backgroundImage: '/images/hero/thca_flower_premium.jpg'
    },
    {
      id: 'indoor-led-cultivation',
      title: 'State-of-the-Art Indoor Cultivation',
      subtitle: 'Climate-controlled LED growing facilities',
      description: '15,000 sq ft indoor facility with precision LED lighting and environmental control for optimal growth.',
      backgroundImage: '/images/hero/cultivation_facility_professional.jpg'
    },
    {
      id: 'lab-tested-excellence',
      title: 'Lab-Tested Excellence',
      subtitle: 'Every batch rigorously tested by professionals',
      description: 'Third-party lab testing ensures purity, potency, and safety for complete peace of mind.',
      backgroundImage: '/images/hero/laboratory_testing_facility.jpg'
    },
    {
      id: 'north-carolina-heritage',
      title: 'North Carolina Hemp Heritage',
      subtitle: 'Proudly grown in the Blue Ridge Mountains',
      description: 'Combining traditional hemp farming knowledge with modern cultivation techniques in beautiful NC.',
      backgroundImage: '/images/hero/nc_hemp_mountains.jpg'
    }
  ]

  // Scrolling messages for promotional banner
  const scrollingMessages = [
    { id: 'shipping', text: 'FREE SHIPPING on orders over $125', icon: Truck },
    { id: 'testing', text: 'Third-party lab tested for purity', icon: Shield },
    { id: 'organic', text: '100% Organic cultivation methods', icon: Leaf },
    { id: 'quality', text: 'Lab-Tested Quality guaranteed', icon: Shield },
    { id: 'guarantee', text: 'Satisfaction guaranteed or money back', icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen">
      {/* Promotional Banner */}
      <ScrollingBanner 
        messages={scrollingMessages}
        speed={30}
        backgroundColor="bg-emerald-600"
        textColor="text-white"
        height="h-12"
      />

      {/* Enhanced Hero Carousel */}
      <section className="relative">
        <ImageCarousel
          items={heroSlides}
          autoPlay={true}
          interval={4500}
          showIndicators={true}
          showArrows={true}
          height="h-screen"
          className=""
        />
        
        {/* Hero CTAs Overlay - Adjusted positioning for better visibility */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/products"
              className="group relative px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 flex items-center gap-3 backdrop-blur-sm"
            >
              <span>Shop Premium Hemp</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/lab-results"
              className="px-12 py-5 border-2 border-white/80 hover:border-white text-white hover:bg-white hover:text-black font-bold text-lg rounded-2xl transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
            >
              <Shield className="w-6 h-6" />
              View Lab Results
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Shield, title: 'Lab Tested', subtitle: '3rd Party Verified' },
              { icon: Leaf, title: '100% Organic', subtitle: 'Pesticide Free' },
              { icon: Award, title: 'Premium Quality', subtitle: 'Artisan Crafted' },
              { icon: Truck, title: 'Fast Shipping', subtitle: 'Nationwide Delivery' }
            ].map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <badge.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Quality Showcase with Enhanced Visuals */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-black-900">
              Uncompromising Quality,
              <span className="block text-emerald-600">Exceptional Experience</span>
            </h2>
            <p className="text-xl text-forest-600 max-w-3xl mx-auto leading-relaxed">
              From our 15,000 sq ft climate-controlled facility to your door, every step is designed for excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Shield,
                title: 'Radical Transparency',
                description: 'Every batch undergoes comprehensive testing for potency, pesticides, heavy metals, and microbials. COAs publicly available.',
                color: 'from-emerald-500 to-forest-600',
                accentColor: 'text-emerald-600'
              },
              {
                icon: Clock,
                title: 'Extended Curing',
                description: '30+ day curing process enhances flavor, potency, and overall quality for superior products that stand apart.',
                color: 'from-gold-500 to-amber-600',
                accentColor: 'text-amber-600'
              },
              {
                icon: Leaf,
                title: 'Organic Excellence',
                description: 'Certified organic cultivation methods ensure pure, clean products free from harmful chemicals and pesticides.',
                color: 'from-forest-500 to-emerald-600',
                accentColor: 'text-forest-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-100 hover:border-emerald-200 group relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform rotate-12 translate-x-8 -translate-y-8">
                  <feature.icon className="w-full h-full" />
                </div>
                
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black-900">
                  {feature.title}
                </h3>
                <p className="text-forest-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className={`mt-4 h-1 w-12 bg-gradient-to-r ${feature.color} rounded-full`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Product Showcase with Enhanced Carousel */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Premium Strain Collection
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hand-selected genetics, precision cultivated, and artfully cured to perfection.
            </p>
          </motion.div>

          {/* Enhanced Product Cards */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Jealousy Strain - Enhanced with Animation */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
            >
              <div className="relative h-96 overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-black">
                <img 
                  src="/images/jealousy_flower.png" 
                  alt="Jealousy Strain THCA Flower"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-overlay opacity-80"
                />
                {/* Animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-purple-900/50 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-6 right-6 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                  AAA Indoor • 24.8% THCA
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <h3 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Jealousy</h3>
                    <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                      Premium hybrid showcasing stunning purple hues and complex terpene profile. 
                      A connoisseur's choice for exceptional potency and flavor complexity.
                    </p>
                    
                    <div className="flex gap-4 mb-6">
                      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 flex-1 border border-purple-500/30 hover:border-purple-400/50 transition-colors">
                        <div className="text-purple-300 font-bold text-sm mb-1">3.5G</div>
                        <div className="text-white text-2xl font-bold">$35</div>
                      </div>
                      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 flex-1 border border-purple-500/30 hover:border-purple-400/50 transition-colors">
                        <div className="text-purple-300 font-bold text-sm mb-1">7G</div>
                        <div className="text-white text-2xl font-bold">$65</div>
                      </div>
                    </div>

                    <Link
                      to="/products/jealousy"
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl backdrop-blur-sm"
                    >
                      Explore Jealousy
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Gushers Strain - Enhanced with Animation */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500"
            >
              <div className="relative h-96 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-black">
                <img 
                  src="/images/gushers_flower.png" 
                  alt="Gushers Strain THCA Flower"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-overlay opacity-80"
                />
                {/* Animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-emerald-900/50 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                  Top Shelf • 22.4% THCA
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <h3 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Gushers</h3>
                    <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                      Sweet, fruity perfection with dense, trichome-covered buds. 
                      Customer favorite for incredible flavor profile and smooth experience.
                    </p>
                    
                    <div className="flex gap-4 mb-6">
                      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 flex-1 border border-emerald-500/30 hover:border-emerald-400/50 transition-colors">
                        <div className="text-emerald-300 font-bold text-sm mb-1">3.5G</div>
                        <div className="text-white text-2xl font-bold">$30</div>
                      </div>
                      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 flex-1 border border-emerald-500/30 hover:border-emerald-400/50 transition-colors">
                        <div className="text-emerald-300 font-bold text-sm mb-1">7G</div>
                        <div className="text-white text-2xl font-bold">$55</div>
                      </div>
                    </div>

                    <Link
                      to="/products/gushers"
                      className="w-full bg-gradient-to-r from-emerald-600 to-forest-600 hover:from-emerald-500 hover:to-forest-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl backdrop-blur-sm"
                    >
                      Explore Gushers
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-bold px-12 py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-gold-500/25 text-xl"
            >
              <span>Explore Full Collection</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Trust & Transparency with Professional Image */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 to-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-black-900">
                Built on Trust,
                <span className="block text-emerald-600">Proven by Results</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-black-900">Radical Transparency</h3>
                    <p className="text-forest-600 leading-relaxed">
                      Every Certificate of Analysis is publicly available. No hidden processes, 
                      no shortcuts – just honest, transparent quality you can verify.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-black-900">Artisanal Excellence</h3>
                    <p className="text-forest-600 leading-relaxed">
                      16-week growth cycles, 30+ day curing, and small-batch production ensure 
                      every product meets our uncompromising standards.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-black-900">Certified Quality</h3>
                    <p className="text-forest-600 leading-relaxed">
                      Organic certification, ISO-compliant lab testing, and satisfaction guarantee 
                      back every product we create.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link
                  to="/about"
                  className="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold transition-colors inline-flex items-center gap-3 shadow-lg"
                >
                  Learn Our Story
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Enhanced Professional Lab Image */}
              <div className="relative rounded-2xl shadow-2xl overflow-hidden h-[500px]">
                <img 
                  src="/images/hero/professional_hemp_examination.jpg" 
                  alt="Professional Hemp Plant Examination with Magnifying Glass"
                  className="w-full h-full object-cover"
                />
                {/* Professional overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Professional content overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <Shield className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 drop-shadow-lg">Expert Hemp Analysis</h3>
                    <p className="text-lg opacity-90 leading-relaxed drop-shadow-md">
                      Professional botanical examination ensures optimal plant quality and cannabinoid development
                    </p>
                  </div>
                </div>
                
                {/* Animated particles effect */}
                <div className="absolute inset-0">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Overlay info card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold mb-2 text-black-900">Quality Guaranteed</h3>
                  <p className="text-forest-700">
                    Every product is backed by our satisfaction guarantee and comprehensive lab testing.
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                      ISO Certified
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                      Third-Party Tested
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA with Enhanced Animation */}
      <section className="py-24 bg-gradient-to-r from-black via-gray-900 to-black text-white relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              Experience the Bud Life NC Difference
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands who've discovered what premium THCA should be. 
              Quality you can see, purity you can trust, results you can feel.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/products"
                className="group bg-gradient-to-r from-emerald-500 to-forest-600 hover:from-emerald-400 hover:to-forest-500 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 inline-flex items-center justify-center gap-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-out" />
                Shop Premium Hemp
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/lab-results"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 inline-flex items-center justify-center gap-3"
              >
                View Lab Results
                <Shield className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export { HomePage }
export default HomePage
