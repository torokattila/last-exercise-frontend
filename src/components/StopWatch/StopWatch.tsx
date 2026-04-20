import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Timer from 'react-compound-timer';

import clockFill from '@iconify/icons-eva/clock-fill';
import closeCircleFill from '@iconify/icons-eva/close-circle-fill';
import pauseCircleOutline from '@iconify/icons-eva/pause-circle-outline';
import playCircleOutline from '@iconify/icons-eva/play-circle-outline';
import { Icon } from '@iconify/react';
import useExercise from '../../hooks/useExercise';
import { getItem } from '../../lib/storage';

type Props = {
  show: boolean;
  setShowStopWatch: Dispatch<SetStateAction<boolean>>;
  setDuration: Dispatch<SetStateAction<string>>;
};

const parseIntervalToSeconds = (value: string): number => {
  const [m, s] = (value ?? '00:00').split(':').map(Number);
  return (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s);
};

const formatCountdown = (totalSeconds: number): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
};

const playNotificationSound = () => {
  if (getItem('playSound') !== 'true') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();

    const beepAt = (startTime: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, startTime);
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    };

    beepAt(ctx.currentTime);
    beepAt(ctx.currentTime + 0.2);
    beepAt(ctx.currentTime + 0.4);
  } catch {
    // AudioContext not supported
  }
};

const StopWatch = ({ show, setShowStopWatch, setDuration }: Props) => {
  const { currentExercise } = useExercise();
  const shouldUseIntervalTimer = currentExercise?.useIntervalTimer;
  const intervalTotalSeconds = parseIntervalToSeconds(
    currentExercise?.intervalNotificationTime ?? '00:00',
  );

  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(intervalTotalSeconds);
  const [flash, setFlash] = useState<boolean>(false);

  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intervalTotalSecondsRef = useRef(intervalTotalSeconds);

  useEffect(() => {
    intervalTotalSecondsRef.current = intervalTotalSeconds;
  }, [intervalTotalSeconds]);

  // Run the countdown while the exercise timer is active
  useEffect(() => {
    const shouldTick =
      isStarted &&
      !isPaused &&
      shouldUseIntervalTimer &&
      intervalTotalSeconds > 0;

    if (shouldTick) {
      intervalTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            playNotificationSound();
            setFlash(true);
            setTimeout(() => setFlash(false), 700);
            return intervalTotalSecondsRef.current;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
        intervalTimerRef.current = null;
      }
    };
  }, [isStarted, isPaused, shouldUseIntervalTimer, intervalTotalSeconds]);

  const onStartPress = () => {
    setIsStarted(true);
    setIsPaused(false);
  };

  const onPausePress = () => {
    setIsPaused(true);
    setIsStarted(false);
  };

  const handleClose = () => {
    onPausePress();
    setCountdown(intervalTotalSecondsRef.current);
    setShowStopWatch(false);
  };

  const progress =
    intervalTotalSeconds > 0
      ? ((intervalTotalSeconds - countdown) / intervalTotalSeconds) * 100
      : 0;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="expanded_timer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.4, type: 'spring' }}
          className={`
            fixed bottom-14 right-2 z-30 flex w-28 
            flex-row items-center justify-center
            rounded-3xl border-[3px] border-[#1D2228] bg-white 
            py-3.5 text-3xl text-white shadow-card dark:border-white dark:bg-[#1D2228] 
            lg:bottom-10 lg:right-5 lg:py-1 lg:px-12
          `}
        >
          <div
            className="absolute -top-1.5 -right-1 cursor-pointer rounded-full bg-[#1D2228] shadow-card dark:bg-white"
            onClick={handleClose}
          >
            <Icon
              icon={closeCircleFill}
              className="text-white transition-all hover:text-blues-2 dark:text-[#1D2228]"
              fontSize={52}
            />
          </div>

          <Timer initialTime={0} startImmediately={false}>
            {({ start, pause }: any) => (
              <motion.div
                className={`
                  relative mb-2 flex flex-col items-center 
                  justify-center ${
                    shouldUseIntervalTimer ? 'gap-y-0.5' : 'gap-y-2.5'
                  }
                  `}
              >
                <motion.div
                  animate={
                    flash
                      ? {
                          boxShadow: [
                            '0 0 0px rgba(249,115,22,0)',
                            '0 0 18px rgba(249,115,22,0.85)',
                            '0 0 0px rgba(249,115,22,0)',
                          ],
                        }
                      : { boxShadow: '0 0 0px rgba(249,115,22,0)' }
                  }
                  transition={{ duration: 0.7 }}
                  className={`
                    flex w-full flex-col items-center justify-center 
                    gap-y-0.5 rounded-full border-4 border-[#1D2228] 
                  ${
                    shouldUseIntervalTimer ? 'py-5 px-2.5' : 'py-7 px-2'
                  } font-semibold text-[#1D2228] 
                    dark:border-white dark:text-white
                  `}
                >
                  {/* Stopwatch time */}
                  <div className="text-3xl">
                    <Timer.Hours
                      formatValue={(num: number) =>
                        num < 10 ? `0${num}` : `${num}`
                      }
                    />
                    :
                    <Timer.Minutes
                      formatValue={(num: number) =>
                        num < 10 ? `0${num}` : `${num}`
                      }
                    />
                    :
                    <Timer.Seconds
                      formatValue={(num: number) =>
                        num < 10 ? `0${num}` : `${num}`
                      }
                    />
                  </div>

                  {/* Interval countdown */}
                  <AnimatePresence>
                    {shouldUseIntervalTimer && intervalTotalSeconds > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                        className="flex w-full flex-col items-center overflow-hidden"
                      >
                        <motion.span
                          animate={
                            flash ? { scale: [1, 1.3, 1] } : { scale: 1 }
                          }
                          transition={{ duration: 0.5 }}
                          className={`text-base font-bold tabular-nums transition-colors duration-300 ${
                            flash
                              ? 'text-orange-400'
                              : 'text-[#1D2228] dark:text-white'
                          }`}
                        >
                          {formatCountdown(countdown)}
                        </motion.span>
                        <div className="mt-0.5 mb-0.5 h-[4px] w-8.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor:
                                currentExercise?.cardColor ?? '#1490d3',
                            }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.9, ease: 'linear' }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="absolute -bottom-3.5 flex flex-row gap-x-2 bg-white dark:bg-[#1D2228]">
                  {!isPaused && (
                    <button
                      onClick={() => {
                        pause();
                        onPausePress();
                      }}
                    >
                      <Icon
                        icon={pauseCircleOutline}
                        fontSize={65}
                        className="rounded-full text-green-500 transition-all hover:text-green-600"
                      />
                    </button>
                  )}
                  {!isStarted && (
                    <button
                      onClick={() => {
                        start();
                        onStartPress();
                      }}
                    >
                      <Icon
                        icon={playCircleOutline}
                        fontSize={65}
                        className="rounded-full text-cyan-500 transition-all hover:text-cyan-600"
                      />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </Timer>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.4, type: 'spring' }}
          key="shrinked_timer"
          onClick={() => setShowStopWatch(true)}
          style={{ backgroundColor: currentExercise?.cardColor }}
          className={`
            fixed bottom-16 right-2 z-30 flex h-9 w-9 
            cursor-pointer flex-col items-center justify-center 
            rounded-full shadow-card hover:opacity-90 lg:bottom-10 
            lg:right-5
          `}
        >
          <Icon
            className="z-40"
            icon={clockFill}
            color={`${currentExercise?.textColor}`}
            fontSize={47}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StopWatch;
