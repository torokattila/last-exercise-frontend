import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Props = {
  value: string;
  onChange?: (value: string) => void;
  borderColor?: string;
};

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

const pad = (n: number) => String(n).padStart(2, '0');

const hours = Array.from({ length: 24 }, (_, i) => pad(i));
const minutes = Array.from({ length: 60 }, (_, i) => pad(i));

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

const IntervalTimePicker = ({ value, onChange, borderColor }: Props) => {
  const [open, setOpen] = useState(false);

  const parseValue = (v: string) => {
    const [h, m] = v.split(':');
    return {
      hour: clamp(parseInt(h ?? '0', 10), 0, 23),
      minute: clamp(parseInt(m ?? '0', 10), 0, 59),
    };
  };

  const { hour: initHour, minute: initMinute } = parseValue(value);
  const [selectedHour, setSelectedHour] = useState(initHour);
  const [selectedMinute, setSelectedMinute] = useState(initMinute);
  const [tempHour, setTempHour] = useState(initHour);
  const [tempMinute, setTempMinute] = useState(initMinute);

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const hourScrolling = useRef(false);
  const minuteScrolling = useRef(false);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>, index: number) => {
    ref.current?.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
  };

  const handleOpen = () => {
    setTempHour(selectedHour);
    setTempMinute(selectedMinute);
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        // Use direct scrollTop (instant) instead of smooth scrollTo to avoid
        // triggering the snap handler mid-animation with a wrong position.
        if (hourRef.current) hourRef.current.scrollTop = tempHour * ITEM_HEIGHT;
        if (minuteRef.current) minuteRef.current.scrollTop = tempMinute * ITEM_HEIGHT;
      }, 50);
    }
    // scroll on open only — tempHour/tempMinute are set synchronously before open becomes true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleHourScroll = () => {
    if (!hourRef.current) return;
    if (hourScrolling.current) return;
    hourScrolling.current = true;
    setTimeout(() => {
      const index = Math.round(hourRef.current!.scrollTop / ITEM_HEIGHT);
      const clamped = clamp(index, 0, 23);
      setTempHour(clamped);
      scrollTo(hourRef, clamped);
      hourScrolling.current = false;
    }, 150);
  };

  const handleMinuteScroll = () => {
    if (!minuteRef.current) return;
    if (minuteScrolling.current) return;
    minuteScrolling.current = true;
    setTimeout(() => {
      const index = Math.round(minuteRef.current!.scrollTop / ITEM_HEIGHT);
      const clamped = clamp(index, 0, 59);
      setTempMinute(clamped);
      scrollTo(minuteRef, clamped);
      minuteScrolling.current = false;
    }, 150);
  };

  const handleSave = () => {
    setSelectedHour(tempHour);
    setSelectedMinute(tempMinute);
    onChange?.(`${pad(tempHour)}:${pad(tempMinute)}`);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        style={{ borderColor }}
        className="w-fit rounded-full border-2 bg-transparent py-1.5 px-4 font-medium outline-none transition-all dark:text-white"
      >
        {pad(selectedHour)}:{pad(selectedMinute)}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleCancel}
          >
            <motion.div
              key="picker"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className="w-56 overflow-hidden rounded-2xl bg-[#1D2228]/80 backdrop-blur-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-semibold text-orange-400 transition-opacity hover:opacity-70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="text-sm font-semibold text-orange-400 transition-opacity hover:opacity-70"
              >
                Save
              </button>
            </div>

            {/* Scroll columns */}
            <div className="relative flex items-center justify-center">
              {/* Selection highlight */}
              <div
                className="pointer-events-none absolute left-0 right-0 mx-4 rounded-lg bg-white/10"
                style={{ height: ITEM_HEIGHT, top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
              />

              {/* Hours */}
              <div
                ref={hourRef}
                onScroll={handleHourScroll}
                className="scrollbar-hide flex w-20 flex-col items-center overflow-y-scroll"
                style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
              >
                {/* top padding */}
                <div style={{ minHeight: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }} />
                {hours.map((h) => (
                  <div
                    key={h}
                    style={{ height: ITEM_HEIGHT, minHeight: ITEM_HEIGHT }}
                    className={`flex w-full items-center justify-center text-base font-medium transition-colors ${
                      parseInt(h, 10) === tempHour
                        ? 'text-white'
                        : 'text-gray-500'
                    }`}
                  >
                    {h}
                  </div>
                ))}
                {/* bottom padding */}
                <div style={{ minHeight: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }} />
              </div>

              <span className="text-lg font-bold text-white">:</span>

              {/* Minutes */}
              <div
                ref={minuteRef}
                onScroll={handleMinuteScroll}
                className="scrollbar-hide flex w-20 flex-col items-center overflow-y-scroll"
                style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
              >
                {/* top padding */}
                <div style={{ minHeight: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }} />
                {minutes.map((m) => (
                  <div
                    key={m}
                    style={{ height: ITEM_HEIGHT, minHeight: ITEM_HEIGHT }}
                    className={`flex w-full items-center justify-center text-base font-medium transition-colors ${
                      parseInt(m, 10) === tempMinute
                        ? 'text-white'
                        : 'text-gray-500'
                    }`}
                  >
                    {m}
                  </div>
                ))}
                {/* bottom padding */}
                <div style={{ minHeight: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }} />
              </div>
            </div>

            <div className="h-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IntervalTimePicker;
