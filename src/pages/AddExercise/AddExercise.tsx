import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import useHome from '../../hooks/useHome';
import ExerciseType from '../../models/ExerciseType';

import saveOutline from '@iconify/icons-eva/save-outline';
import { Icon } from '@iconify/react';
import * as Switch from '@radix-ui/react-switch';
import useExercise from '../../hooks/useExercise';
import ExercisePayload from '../../api/payloads/ExercisePayload';
import ExerciseTypeAccordionCard from '../../components/ExerciseTypeAccordionCard';
import IntervalTimePicker from '../../components/IntervalTimePicker';

const AddExercise = () => {
  const { user } = useHome();
  const { handleCreateExercise } = useExercise();
  const [openExerciseCardColorPicker, setOpenExeriseCardColorPicker] =
    useState<boolean>(false);
  const [openExerciseTextColorPicker, setOpenExerciseTextColorPicker] =
    useState<boolean>(false);

  const [openAccordions, setOpenAccordions] = useState<boolean[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const [exercise, setExercise] = useState<ExercisePayload>({
    name: '',
    cardColor: '#005A92',
    textColor: '#fff',
    duration: '',
    intervalNotificationTime: '01:00',
    useIntervalTimer: false,
    exerciseTypes: [],
    order: 1,
    userId: Number(user?.id) ?? undefined,
  });

  const handleAddNewExerciseType = () => {
    const types = [...exercise.exerciseTypes];
    const newExerciseType: Partial<ExerciseType> = {
      name: '',
      order: 1,
      exerciseId: undefined,
      exercise: null,
      cardTextColor: '#fff',
      seriesCardsColor: '#005A92',
      seriesCardNumber: null,
      numberOfRepetitions: null,
    };
    types.push(newExerciseType);
    setExercise({ ...exercise, exerciseTypes: types });
    setOpenAccordions((prev) => [...prev.map(() => false), true]);
  };

  const handleDeleteType = (index: number) => {
    const currentExerciseTypes = exercise.exerciseTypes.filter(
      (_, i) => i !== index,
    );
    setExercise({ ...exercise, exerciseTypes: currentExerciseTypes });
    setOpenAccordions((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setOpenAccordions((prev) =>
      prev.length === 0 ? exercise.exerciseTypes.map(() => false) : prev,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.exerciseTypes.length]);

  useEffect(() => {
    setExercise({ ...exercise, userId: Number(user?.id) ?? undefined });
  }, [user]);

  return (
    <AnimatePresence>
      <div
        style={{
          backgroundColor: exercise.cardColor,
        }}
        className="relative lg:!bg-white dark:lg:!bg-[#1D2228]"
      >
        <div className="relative flex h-full w-full flex-col gap-y-4 lg:gap-y-0">
          <div className="mt-5 flex w-full items-center justify-center lg:justify-start lg:px-5">
            <h1
              style={{
                color: exercise.textColor,
              }}
              className="text-2xl font-bold lg:!text-gray-800 dark:lg:!text-white"
            >
              Create new Exercise 💪
            </h1>
          </div>

          <div className="relative flex w-full flex-col gap-y-4 rounded-t-[40px] bg-white px-5 pb-15 dark:bg-[#1D2228] lg:min-h-screen lg:rounded-none">
            <div className="fixed top-17 right-3 lg:top-10">
              <button
                onClick={() => {
                  handleCreateExercise(exercise);
                }}
                style={{
                  backgroundColor: exercise.cardColor,
                  color: exercise.textColor,
                }}
                className="rounded-full px-2 py-2 uppercase shadow-card transition-all hover:opacity-90"
              >
                <Icon icon={saveOutline} fontSize={30} className="text-white" />
              </button>
            </div>
            <div className="flex flex-col py-2 lg:flex-row lg:gap-x-4">
              <div className="mt-2 flex flex-col lg:mt-5">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Exercise card color:
                </h3>

                {!openExerciseCardColorPicker && (
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
                    className="mt-2 h-5 w-12 cursor-pointer rounded-lg shadow-card"
                    onClick={() =>
                      setOpenExeriseCardColorPicker(
                        !openExerciseCardColorPicker,
                      )
                    }
                    style={{
                      backgroundColor: exercise.cardColor,
                    }}
                  />
                )}
                {openExerciseCardColorPicker && (
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
                    className="mt-2 flex flex-row gap-x-3"
                  >
                    <HexColorPicker
                      className="rounded-3xl shadow-card"
                      color={exercise.cardColor}
                      onChange={(e) =>
                        setExercise({ ...exercise, cardColor: e })
                      }
                    />

                    <div
                      className="cursor-pointer self-end rounded-full bg-white p-1 shadow-card transition-all hover:bg-gray-50"
                      onClick={() => setOpenExeriseCardColorPicker(false)}
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

              <div className="mt-2 flex flex-col lg:mt-5">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Exercise text color on the card:
                </h3>
                {!openExerciseTextColorPicker && (
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
                    className="mt-2 h-5 w-12 cursor-pointer rounded-lg shadow-card"
                    onClick={() =>
                      setOpenExerciseTextColorPicker(
                        !openExerciseTextColorPicker,
                      )
                    }
                    style={{
                      backgroundColor: exercise.textColor,
                    }}
                  />
                )}
                {openExerciseTextColorPicker && (
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
                    className="mt-2 flex flex-row gap-x-3"
                  >
                    <HexColorPicker
                      className="rounded-3xl shadow-card"
                      color={exercise.textColor}
                      onChange={(e) =>
                        setExercise({ ...exercise, textColor: e })
                      }
                    />

                    <div
                      className="cursor-pointer self-end rounded-full bg-white p-1 shadow-card transition-all hover:bg-gray-50"
                      onClick={() => setOpenExerciseTextColorPicker(false)}
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
            </div>

            <div className="flex flex-col xl:w-1/3">
              <label className="mb-1 font-medium dark:text-white">
                Exercise name:
              </label>
              <input
                style={{
                  borderColor: exercise.cardColor,
                }}
                className="w-full rounded-full border-2 bg-transparent py-1.5 px-3 outline-none transition-all focus:shadow-card dark:text-white"
                value={exercise.name}
                onChange={(e) =>
                  setExercise({ ...exercise, name: e.target.value })
                }
                placeholder="Exercise Name"
              />
            </div>

            <div className="flex flex-col xl:w-1/3">
              <label className="mb-1 font-medium dark:text-white">
                Exercise order on the Home page:
              </label>
              <input
                style={{
                  borderColor: exercise.cardColor,
                }}
                className="w-full rounded-full border-2 bg-transparent py-1.5 px-3 outline-none transition-all focus:shadow-card dark:text-white"
                value={exercise.order}
                type="number"
                min={1}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setExercise({ ...exercise, order: '' });
                  } else {
                    setExercise({
                      ...exercise,
                      order: Math.max(1, Number(e.target.value)),
                    });
                  }
                }}
                placeholder="Exercise order"
              />
            </div>

            <div className="flex flex-row gap-2">
              <label
                className="mb-1 font-medium dark:text-white"
                htmlFor="interval-timer-switch"
              >
                Use interval timer:
              </label>
              <Switch.Root
                id="interval-timer-switch"
                checked={exercise.useIntervalTimer}
                onCheckedChange={(v) =>
                  setExercise({ ...exercise, useIntervalTimer: v })
                }
                style={
                  exercise.useIntervalTimer
                    ? { backgroundColor: exercise.cardColor }
                    : undefined
                }
                className={`
                  relative h-3.5 w-7 cursor-pointer rounded-full border-2 
                  border-transparent bg-slate-400 outline-none
                  transition-colors`}
              >
                <Switch.Thumb
                  className={`
                    block h-3 w-3 translate-x-0 rounded-full bg-white 
                    shadow-md transition-transform duration-200 
                    data-[state=checked]:translate-x-3.5`}
                />
              </Switch.Root>
            </div>

            <AnimatePresence>
              {exercise.useIntervalTimer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="-mt-3 flex flex-col"
                >
                  <label className="mb-1 font-medium dark:text-white">
                    Interval timer:
                  </label>
                  <IntervalTimePicker
                    value={exercise.intervalNotificationTime || '01:00'}
                    onChange={(v) =>
                      setExercise({ ...exercise, intervalNotificationTime: v })
                    }
                    borderColor={exercise.cardColor}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="xl:w-1/3">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Exercise types:
              </h3>

              {exercise.exerciseTypes && (
                <div className="mt-2 flex flex-col gap-y-2">
                  {exercise.exerciseTypes.length > 0 &&
                    exercise.exerciseTypes.map((type, index: number) => (
                      <ExerciseTypeAccordionCard
                        key={`${index}_${type.id}`}
                        type={type}
                        index={index}
                        isOpen={!!openAccordions[index]}
                        onToggle={() => toggleAccordion(index)}
                        onChange={(updated) =>
                          setExercise({
                            ...exercise,
                            exerciseTypes: [
                              ...exercise.exerciseTypes.slice(0, index),
                              updated,
                              ...exercise.exerciseTypes.slice(index + 1),
                            ],
                          })
                        }
                        onDelete={() => handleDeleteType(index)}
                      />
                    ))}
                </div>
              )}
            </div>

            <div className="self-center">
              <button
                style={{
                  backgroundColor: exercise.cardColor,
                  color: exercise.textColor,
                }}
                onClick={handleAddNewExerciseType}
                className="rounded-full px-3 py-2 text-sm uppercase text-white shadow-card transition-all"
              >
                add new exercise type
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AddExercise;
