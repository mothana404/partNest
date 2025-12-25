import { motion } from "framer-motion";
import { useState } from "react";

const FeatureDisplay = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const jobCategories = [
    {
      id: 1,
      icon: "🛒",
      name: "Retail & Sales",
      count: "250+",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      description: "Part-time sales, cashier, and customer service positions",
    },
    {
      id: 2,
      icon: "🍽️",
      name: "Food & Hospitality",
      count: "320+",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      description: "Waiter, barista, kitchen staff, and hotel jobs",
    },
    {
      id: 3,
      icon: "📚",
      name: "Tutoring & Education",
      count: "180+",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      description: "Private tutoring, teaching assistant, and mentoring roles",
    },
    {
      id: 4,
      icon: "💼",
      name: "Office & Admin",
      count: "210+",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      description: "Data entry, receptionist, and administrative support",
    },
    {
      id: 5,
      icon: "🎨",
      name: "Creative & Marketing",
      count: "150+",
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50",
      description: "Social media, content creation, and design work",
    },
    {
      id: 6,
      icon: "🏥",
      name: "Healthcare Support",
      count: "90+",
      color: "from-red-400 to-red-600",
      bgColor: "bg-red-50",
      description: "Care assistant, pharmacy helper, and clinic support",
    },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center py-12">
      <div className="relative w-[700px] h-[700px]">
        {/* Central Hub */}
        <motion.div
          className="absolute left-1/2 top-72 transform -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] z-20"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="relative w-full h-full">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Main circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl" />
            
            {/* Inner content */}
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
              <motion.div
                className="text-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="text-5xl mb-2"
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🎓
                </motion.div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Student Jobs
                </h3>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  Find your perfect match
                </p>
              </motion.div>
            </div>

            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-dashed border-blue-300/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Orbital Category Cards */}
        {jobCategories.map((category, index) => {
          const angle = (index * 360) / jobCategories.length - 90;
          const radius = 280;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.div
              key={category.id}
              className="absolute left-1/2 top-1/2 z-10"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1, x: x, y: y }}
              transition={{ 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
            >
              <motion.div
                className={`relative w-[180px] ${category.bgColor} rounded-2xl shadow-lg cursor-pointer overflow-hidden border-2 border-white`}
                whileHover={{ scale: 1.08, y: -5 }}
                onHoverStart={() => setHoveredCard(category.id)}
                onHoverEnd={() => setHoveredCard(null)}
                animate={{
                  y: hoveredCard === category.id ? -5 : 0,
                }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative p-4">
                  <div className="flex items-start space-x-3 mb-2">
                    <motion.span 
                      className="text-3xl"
                      animate={hoveredCard === category.id ? {
                        rotate: [0, -10, 10, -10, 0],
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {category.icon}
                    </motion.span>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm leading-tight">
                        {category.name}
                      </h4>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${category.color} text-white`}>
                        {category.count} jobs
                      </span>
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: hoveredCard === category.id ? "auto" : 0,
                      opacity: hoveredCard === category.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-gray-600 leading-relaxed pt-2 border-t border-gray-200">
                      {category.description}
                    </p>
                  </motion.div>
                </div>

                {/* Hover indicator */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`}
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: hoveredCard === category.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Connection line to center */}
              <svg 
                className="absolute left-1/2 top-1/2 pointer-events-none" 
                style={{ 
                  width: Math.abs(x) * 2, 
                  height: Math.abs(y) * 2,
                  transform: `translate(-50%, -50%)`,
                }}
              >
                <motion.line
                  x1={Math.abs(x)}
                  y1={Math.abs(y)}
                  x2={x > 0 ? 0 : Math.abs(x) * 2}
                  y2={y > 0 ? 0 : Math.abs(y) * 2}
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: hoveredCard === category.id ? 0.4 : 0.15 
                  }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#9333ea" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          );
        })}

        {/* Animated Background Particles */}
        {Array.from({ length: 15 }).map((_, index) => {
          const randomAngle = Math.random() * 360;
          const randomRadius = 150 + Math.random() * 200;
          const startX = Math.cos((randomAngle * Math.PI) / 180) * randomRadius;
          const startY = Math.sin((randomAngle * Math.PI) / 180) * randomRadius;

          return (
            <motion.div
              key={`particle-${index}`}
              className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${
                  index % 2 === 0 ? '#3b82f6' : '#9333ea'
                })`,
                filter: 'blur(1px)',
              }}
              initial={{ x: startX, y: startY, opacity: 0, scale: 0 }}
              animate={{
                x: [startX, startX + (Math.random() - 0.5) * 100, startX],
                y: [startY, startY + (Math.random() - 0.5) * 100, startY],
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Decorative rotating circles */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[500px] h-[500px] border border-blue-200/30 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 w-[400px] h-[400px] border border-purple-200/30 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default FeatureDisplay;