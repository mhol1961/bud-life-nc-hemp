import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Shield, Star, Award, ChevronDown, Play, Pause } from 'lucide-react'

const HomePage = () => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const heroBackgrounds = [
    {
      image: '/images/nc_hemp_farm_5.jpg',
      title: 'Premium THCA From North Carolina',
      subtitle: 'Experience the difference that artisanal cultivation makes',
    },
    {
      image: '/images/cannabis_leaf_logo_9.png',
      title: 'Lab-Tested Excellence',
      subtitle: 'Every batch rigorously tested for purity and potency',
    },
    {
      image: '/images/nc_hemp_farm_0.jpg',
      title: 'Craft Cultivation',
      subtitle: 'Small-batch, hand-trimmed perfection',
    },
  ]

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [isPaused, heroBackgrounds.length])

  return (
    <div className="min-h-screen">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Images */}
        {heroBackgrounds.map((bg, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url("${bg.image}")`,
              zIndex: currentHeroIndex === index ? 2 : 1,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentHeroIndex === index ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        ))}

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-10" />
        
        <div className="relative z-20 text-center text-white px-4 max-w-7xl mx-auto">
          <motion.div
            key={currentHeroIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight">
              {heroBackgrounds[currentHeroIndex].title}
            </h1>
            
            <p className="text-xl lg:text-2xl mb-12 opacity-90 leading-relaxed drop-shadow-lg max-w-4xl mx-auto">
              {heroBackgrounds[currentHeroIndex].subtitle}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <Link
              to="/products"
              className="group relative px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 flex items-center gap-3 backdrop-blur-sm"
            >
              <span>Shop Premium Hemp</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/lab-results"
              className="px-10 py-5 border-2 border-white/80 hover:border-white text-white hover:bg-white hover:text-black font-bold text-lg rounded-2xl transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
            >
              <Shield className="w-6 h-6" />
              View Lab Results
            </Link>
          </motion.div>

          {/* Hero Control Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            
            <div className="flex gap-2">
              {heroBackgrounds.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHeroIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentHeroIndex === index 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-white animate-bounce drop-shadow-lg" />
          </motion.div>
        </div>
      </section>

      {/* Premium Quality Showcase */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50">
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
                title: 'Third-Party Tested',
                description: 'Every batch undergoes comprehensive testing for potency, pesticides, heavy metals, and microbials.',
                color: 'from-emerald-500 to-forest-600'
              },
              {
                icon: Award,
                title: '30+ Day Curing',
                description: 'Extended curing process enhances flavor, potency, and overall quality for superior products.',
                color: 'from-gold-500 to-amber-600'
              },
              {
                icon: Leaf,
                title: '100% Organic',
                description: 'Certified organic cultivation methods ensure pure, clean products free from harmful chemicals.',
                color: 'from-forest-500 to-emerald-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-100 hover:border-emerald-200 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black-900">
                  {feature.title}
                </h3>
                <p className="text-forest-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Enhanced */}
      <section className="py-24 bg-black text-white">
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
            <p className="text-xl text-cream-300 max-w-3xl mx-auto">
              Hand-selected genetics, precision cultivated, and artfully cured to perfection.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Jealousy Strain - Enhanced */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
            >
              <div className="relative h-96 overflow-hidden">
                <img 
                  src="/images/jealousy_flower.png" 
                  alt="Jealousy Strain THCA Flower"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute top-6 right-6 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  AAA Indoor
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Jealousy</h3>
                  <p className="text-cream-200 text-lg mb-6 leading-relaxed">
                    Premium hybrid with stunning purple hues and complex terpene profile. 
                    A connoisseur's choice for exceptional potency and flavor.
                  </p>
                  
                  <div className="flex gap-4 mb-6">
                    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 flex-1 border border-purple-500/30">
                      <div className="text-purple-300 font-bold text-sm mb-1">3.5G</div>
                      <div className="text-white text-2xl font-bold">$35</div>
                    </div>
                    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 flex-1 border border-purple-500/30">
                      <div className="text-purple-300 font-bold text-sm mb-1">7G</div>
                      <div className="text-white text-2xl font-bold">$65</div>
                    </div>
                  </div>

                  <Link
                    to="/products/jealousy"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl"
                  >
                    Explore Jealousy
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Gushers Strain - Enhanced */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500"
            >
              <div className="relative h-96 overflow-hidden">
                <img 
                  src="/images/gushers_flower.png" 
                  alt="Gushers Strain THCA Flower"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute top-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Top Shelf
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Gushers</h3>
                  <p className="text-cream-200 text-lg mb-6 leading-relaxed">
                    Sweet, fruity perfection with dense, trichome-covered buds. 
                    Customer favorite for its incredible flavor and smooth experience.
                  </p>
                  
                  <div className="flex gap-4 mb-6">
                    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 flex-1 border border-emerald-500/30">
                      <div className="text-emerald-300 font-bold text-sm mb-1">3.5G</div>
                      <div className="text-white text-2xl font-bold">$30</div>
                    </div>
                    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 flex-1 border border-emerald-500/30">
                      <div className="text-emerald-300 font-bold text-sm mb-1">7G</div>
                      <div className="text-white text-2xl font-bold">$55</div>
                    </div>
                  </div>

                  <Link
                    to="/products/gushers"
                    className="w-full bg-gradient-to-r from-emerald-600 to-forest-600 hover:from-emerald-500 hover:to-forest-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl"
                  >
                    Explore Gushers
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* View All Products CTA */}
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
              <span>View All Premium Products</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust & Transparency */}
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
              </div>
              
              <div className="mt-10">
                <Link
                  to="/about"
                  className="bg-black text-white hover:bg-black-800 px-8 py-4 rounded-xl font-semibold transition-colors inline-flex items-center gap-3"
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
              <img 
                src="/images/lab_images_6.jpg" 
                alt="Lab testing and quality assurance"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-2 text-black-900">Quality Guaranteed</h3>
                  <p className="text-forest-700">
                    Every product is backed by our satisfaction guarantee and comprehensive lab testing.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-black via-black-800 to-forest-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              Experience the Bud Life NC Difference
            </h2>
            <p className="text-xl text-cream-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands who've discovered what premium THCA should be. 
              Quality you can see, purity you can trust, results you can feel.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/products"
                className="bg-gradient-to-r from-emerald-500 to-forest-600 hover:from-emerald-400 hover:to-forest-500 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 inline-flex items-center justify-center gap-3"
              >
                Shop Premium Hemp
                <ArrowRight className="w-6 h-6" />
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
