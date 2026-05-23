"use client";

import {
  motion,
} from "framer-motion";

type Props = {

  children: React.ReactNode;
};

export default function FadeIn({

  children,
}: Props) {

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 30,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.4,
      }}

    >

      {children}

    </motion.div>

  );
}