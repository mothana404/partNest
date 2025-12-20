import { motion } from "framer-motion";
import { useState } from "react";

const FeatureDisplay = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const jobCategories = [
    {
      id: 1,
      icon: "💻",
      name: "Software Development",
      count: "1.2k",
      color: "bg-blue-100",
      description: "Full-stack, Backend, Frontend, and Mobile Development roles",
    },
    {
      id: 2,
      icon: "🎨",
      name: "Design",
      count: "800+",
      color: "bg-purple-100",
      description: "UI/UX, Product, and Graphic Design positions",
    },
    {
      id: 3,
      icon: "📊",
      name: "Data Science",
      count: "600+",
      color: "bg-green-100",
      description: "Data Analysis, Machine Learning, and AI roles",
    },
    {
      id: 4,
      icon: "📱",
      name: "Mobile Development",
      count: "450+",
      color: "bg-orange-100",
      description: "iOS, Android, and Cross-platform Development",
    },
  ];

  return (
    <div className="relative min-h-[600px] w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        {/* Central Circle */}
        <motion.div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl" />
            <div className="absolute inset-0 rounded-full bg-white/90 backdrop-blur-sm shadow-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="text-5xl mb-2"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  💼
                </motion.div>
                <h2 className="text-xl font-bold text-gray-800">
                  Explore Opportunities
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Find your dream tech role
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Category Cards */}
        {jobCategories.map((category, index) => {
          const angle = (index * 360) / jobCategories.length;
          const radius = 250; // Distance from center
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.div
              key={category.id}
              className="absolute left-1/2 top-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              style={{
                x: x,
                y: y,
              }}
            >
              <motion.div
                className={`w-[200px] p-4 rounded-xl ${category.color} backdrop-blur-sm shadow-lg cursor-pointer`}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredCard(category.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {category.name}
                    </h3>
                    <span className="text-sm font-medium text-gray-600">
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
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-600 mt-2">
                    {category.description}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Connecting Lines */}
        <svg className="absolute  w-full h-full" style={{ zIndex: -1 }}>
          {jobCategories.map((_, index) => {
            const angle = (index * 360) / jobCategories.length;
            const endX = Math.cos((angle * Math.PI) / 180) * 250 + 500;
            const endY = Math.sin((angle * Math.PI) / 180) * 250 + 300;

            return (
              <motion.line
                key={index}
                x1="500"
                y1="300"
                x2={endX}
                y2={endY}
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="1"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            );
          })}
        </svg>

        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-2 h-2 rounded-full bg-blue-500/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default FeatureDisplay;