import React, { useState } from "react";
import { motion } from "framer-motion";

const HoverButton = ({ message, hoverMessage, classes, action }) => {
  
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`${classes} transition-transform duration-50 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={action}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {isHovered ? hoverMessage : message}
    </motion.button>
  );
};


export default HoverButton;
