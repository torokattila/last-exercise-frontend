import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

type Props = {
  children: JSX.Element;
  classNames?: string;
  style?: React.CSSProperties;
};

const ConfirmAlertLayout = ({ children, classNames, style }: Props) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-10 bg-black opacity-80" />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
        <motion.div
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          exit={{
            scale: 0,
          }}
          transition={{
            duration: 0.4,
            type: 'spring',
          }}
          className={`w-full rounded-2xl bg-white p-3 shadow-card lg:w-65 ${classNames ?? ''}`}
          style={style}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmAlertLayout;