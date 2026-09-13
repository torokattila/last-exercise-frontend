import { motion } from 'framer-motion';
import successTick from '@iconify/icons-eva/checkmark-circle-2-fill';
import { Icon } from '@iconify/react';
import { getItem } from '../../lib/storage';

type Props = {
  progress: number;
  color: string;
};

const VerticalProgressBar = ({ progress, color }: Props) => {
  const isDarkMode = getItem('mode') === 'dark';
  const isProgressFull = progress === 100;

  return (
    <motion.div
      className="fixed left-1.25 top-1/2 z-50 lg:right-5"
      initial={{ scale: 0, y: '-50%' }}
      animate={{ scale: 1, y: '-50%' }}
      exit={{ scale: 0, y: '-50%' }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <div
        className={`
          flex h-[50vh] flex-col
          items-center justify-center rounded-full 
          bg-white px-0.75 py-2.5 shadow-xl dark:bg-[#3c3c3c] 
          lg:h-[60vh] lg:w-12
        `}
      >
        <div className="relative h-full w-1.5 overflow-hidden rounded-full bg-[#efefef] shadow-xl">
          <div
            className="absolute bottom-0 w-full rounded-full transition-all duration-300 ease-out"
            style={{
              height: `${progress}%`,
              backgroundColor: color,
            }}
          />
        </div>
        {isProgressFull ? (
          <Icon
            icon={successTick}
            className="mt-1 text-green-500 transition-all"
            fontSize={32}
          />
        ) : (
          <div
            className="mt-1 text-[4vw] font-bold lg:text-xs"
            style={{ color: isDarkMode ? '#FFFFFF' : '#3c3c3c' }}
          >
            {progress}%
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VerticalProgressBar;
