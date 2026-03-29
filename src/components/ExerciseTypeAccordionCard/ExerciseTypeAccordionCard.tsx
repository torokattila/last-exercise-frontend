import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import ExerciseType from '../../models/ExerciseType';
import { Icon } from '@iconify/react';
import saveOutline from '@iconify/icons-eva/save-outline';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';

type Props = {
  type: Partial<ExerciseType>;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (updated: Partial<ExerciseType>) => void;
  onDelete: () => void;
};

const ExerciseTypeAccordionCard = ({
  type,
  index,
  isOpen,
  onToggle,
  onChange,
  onDelete,
}: Props) => {
  const [cardColorPickerOpen, setCardColorPickerOpen] = useState(false);
  const [textColorPickerOpen, setTextColorPickerOpen] = useState(false);

  return (
    <motion.div
      style={{ backgroundColor: type.seriesCardsColor }}
      key={`${index}_${type.id}`}
      className="flex flex-col overflow-hidden rounded-2xl shadow-card"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.4, type: 'spring' }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2.5"
      >
        <span
          style={{ color: type.cardTextColor }}
          className="truncate font-semibold"
        >
          {type.name}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <Icon
            icon={chevronDownFill}
            fontSize={30}
            style={{ color: type.cardTextColor }}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col gap-y-3 overflow-hidden px-2 pb-2"
          >
            <div className="flex flex-col gap-y-1">
              <label
                style={{ color: type.cardTextColor }}
                className="font-medium"
              >
                Name:
              </label>
              <input
                className="w-full rounded-full border-2 bg-white py-1.5 px-3 outline-none transition-all focus:shadow-card dark:bg-[#28282B] dark:text-white"
                type="text"
                value={type.name}
                onChange={(e) => onChange({ ...type, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <label
                style={{ color: type.cardTextColor }}
                className="font-medium"
              >
                Order on the Exercise page:
              </label>
              <input
                value={type.order ?? ''}
                type="number"
                className="w-full rounded-full border-2 bg-white py-1.5 px-3 outline-none transition-all focus:shadow-card dark:bg-[#28282B] dark:text-white"
                onChange={(e) =>
                  onChange({
                    ...type,
                    order:
                      e.target.value === ''
                        ? undefined
                        : Math.max(1, Number(e.target.value)),
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <label
                style={{ color: type.cardTextColor }}
                className="font-medium"
              >
                Number of series card:
              </label>
              <input
                value={type.seriesCardNumber ?? ''}
                type="number"
                className="w-full rounded-full border-2 bg-white py-1.5 px-3 outline-none transition-all focus:shadow-card dark:bg-[#28282B] dark:text-white"
                onChange={(e) =>
                  onChange({
                    ...type,
                    seriesCardNumber:
                      e.target.value === ''
                        ? null
                        : Math.max(1, Number(e.target.value)),
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <label
                style={{ color: type.cardTextColor }}
                className="font-medium"
              >
                Number of repetitions:
              </label>
              <input
                value={type.numberOfRepetitions ?? ''}
                type="number"
                className="w-full rounded-full border-2 bg-white py-1.5 px-3 outline-none transition-all focus:shadow-card dark:bg-[#28282B] dark:text-white"
                onChange={(e) =>
                  onChange({
                    ...type,
                    numberOfRepetitions:
                      e.target.value === ''
                        ? null
                        : Math.max(1, Number(e.target.value)),
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <label
                style={{ color: type.cardTextColor }}
                className="font-medium"
              >
                Color of the series cards:
              </label>
              {!cardColorPickerOpen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className="mt-1 h-5 w-12 cursor-pointer rounded-lg shadow-card"
                  onClick={() => setCardColorPickerOpen(true)}
                  style={{ backgroundColor: type.seriesCardsColor }}
                />
              )}
              {cardColorPickerOpen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className="mt-2 flex flex-row gap-x-3"
                >
                  <HexColorPicker
                    className="rounded-3xl shadow-card"
                    color={type.seriesCardsColor}
                    onChange={(value) =>
                      onChange({ ...type, seriesCardsColor: value })
                    }
                  />
                  <div
                    className="cursor-pointer self-end rounded-full bg-white p-1 shadow-card transition-all hover:bg-gray-50"
                    onClick={() => setCardColorPickerOpen(false)}
                  >
                    <Icon
                      icon={saveOutline}
                      fontSize={30}
                      className="text-green-700"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col gap-y-1">
              <label
                style={{ color: type.cardTextColor }}
                className="font-medium"
              >
                Series card text color:
              </label>
              {!textColorPickerOpen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className="mt-1 h-5 w-12 cursor-pointer rounded-lg shadow-card"
                  onClick={() => setTextColorPickerOpen(true)}
                  style={{ backgroundColor: type.cardTextColor }}
                />
              )}
              {textColorPickerOpen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className="mt-2 flex flex-row gap-x-3"
                >
                  <HexColorPicker
                    className="rounded-3xl shadow-card"
                    color={type.cardTextColor}
                    onChange={(value) =>
                      onChange({ ...type, cardTextColor: value })
                    }
                  />
                  <div
                    className="cursor-pointer self-end rounded-full bg-white p-1 shadow-card transition-all hover:bg-gray-50"
                    onClick={() => setTextColorPickerOpen(false)}
                  >
                    <Icon
                      icon={saveOutline}
                      fontSize={30}
                      className="text-green-700"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div
              onClick={onDelete}
              className="cursor-pointer self-end rounded-full bg-red-700 p-2 shadow-card transition-all hover:bg-red-800"
            >
              <Icon icon={trash2Fill} className="text-xl text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExerciseTypeAccordionCard;
