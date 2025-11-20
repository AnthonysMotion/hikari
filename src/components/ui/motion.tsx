"use client"

import { motion, HTMLMotionProps, SVGMotionProps } from "framer-motion"
import React from "react"

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  fullWidth?: boolean
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  direction = "up", 
  className,
  fullWidth = false,
  ...props 
}: FadeInProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
      x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
      className={className}
      style={fullWidth ? { width: "100%" } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerContainer = ({
  children,
  delay = 0,
  stagger = 0.1,
  className,
  ...props
}: {
  children: React.ReactNode
  delay?: number
  stagger?: number
  className?: string
} & HTMLMotionProps<"div">) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const HoverCard = ({
  children,
  className,
  scale = 1.02,
  ...props
}: {
  children: React.ReactNode
  className?: string
  scale?: number
} & HTMLMotionProps<"div">) => {
  return (
    <motion.div
      whileHover={{ scale, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const ScaleIn = ({
  children,
  delay = 0,
  className,
  ...props
}: {
  children: React.ReactNode
  delay?: number
  className?: string
} & HTMLMotionProps<"div">) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

