import useExercise from '../../hooks/useExercise';
import { HexColorPicker } from 'react-colorful';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseType from '../../models/ExerciseType';

import saveOutline from '@iconify/icons-eva/save-outline';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Icon } from '@iconify/react';
import useHome from '../../hooks/useHome';
import { ExerciseTypeCardColorOpen } from '../../@types/ExerciseTypeCardColorOpen';

const EditExercise = () => {
  const {
    currentExercise,
    handleDeleteExerciseType,
    handleEditExercise,
    handleDeleteExercise,
  } = useExercise();
  const { user } = useHome();

  const [exerciseId, setExerciseId] = useState<number | undefined>(
    currentExercise?.id ?? undefined,
  );
  const [exerciseCardColor, setExerciseCardColor] = useState<string>(
    currentExercise?.cardColor ?? '',
  );
  const [exerciseName, setExerciseName] = useState<string>(
    currentExercise?.name ?? '',
  );
  const [exerciseOrder, setExerciseOrder] = useState<number | string>(
    currentExercise?.order ?? 0,
  );
  const [exerciseTextColor, setExerciseTextColor] = useState<string>(
    currentExercise?.textColor ?? '',
  );
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>(
    currentExercise?.exerciseTypes ?? [],
  );
  const [exerciseDuration, setExerciseDuration] = useState<string>(
    currentExercise?.duration ?? '',
  );

  const [openExerciseColorPicker, setOpenExeriseColorPicker] =
    useState<boolean>(false);
  const [openExerciseTextColorPicker, setOpenExerciseTextColorPicker] =
    useState<boolean>(false);
  const [openExerciseTypeCardColorPicker, setOpenExerciseTypeCardColorPicker] =
    useState<ExerciseTypeCardColorOpen[]>([]);
  const [
    openExerciseTypeCardTextColorPicker,
    setOpenExerciseTypeCardTextColorPicker,
  ] = useState<ExerciseTypeCardColorOpen[]>([]);

  const [openAccordions, setOpenAccordions] = useState<boolean[]>([]);
  const [openActionsMenu, setOpenActionsMenu] = useState<boolean>(false);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  useEffect(() => {
    setExerciseId(currentExercise?.id ?? undefined);
    setExerciseCardColor(currentExercise?.cardColor ?? '');
    setExerciseName(currentExercise?.name ?? '');
    setExerciseOrder(currentExercise?.order ?? 0);
    setExerciseTextColor(currentExercise?.textColor ?? '');
    setExerciseTypes(currentExercise?.exerciseTypes ?? []);
    setExerciseDuration(currentExercise?.duration ?? '');
  }, [currentExercise]);

  useEffect(() => {
    if (exerciseTypes.length > 0) {
      const initialOpenExerciseTypeCardColorValues: ExerciseTypeCardColorOpen[] =
        [];
      const initialOpenExerciseTypeCardTextColorValues: ExerciseTypeCardColorOpen[] =
        [];
      const initialOpenAccordions: boolean[] = [];

      for (let i = 0; i < exerciseTypes.length; i++) {
        initialOpenExerciseTypeCardColorValues.push({
          index: i,
          isOpen: false,
        });
        initialOpenExerciseTypeCardTextColorValues.push({
          index: i,
          isOpen: false,
        });
        initialOpenAccordions.push(false);
      }

      setOpenExerciseTypeCardColorPicker(
        initialOpenExerciseTypeCardColorValues,
      );
      setOpenExerciseTypeCardTextColorPicker(
        initialOpenExerciseTypeCardTextColorValues,
      );
      setOpenAccordions((prev) =>
        prev.length === 0 ? initialOpenAccordions : prev,
      );
    }
  }, [exerciseTypes.length]);

  const handleAddNewExerciseType = () => {
    const types = [...exerciseTypes];
    const newExerciseType: ExerciseType = {
      id: undefined,
      name: '',
      order: 1,
      exerciseId: Number(exerciseId),
      exercise: null,
      cardTextColor: '#fff',
      seriesCardsColor: exerciseCardColor,
      seriesCardNumber: null,
      numberOfRepetitions: null,
    };
    types.push(newExerciseType);
    setExerciseTypes(types);
    setOpenExerciseTypeCardColorPicker([
      ...openExerciseTypeCardColorPicker,
      {
        index:
          openExerciseTypeCardColorPicker[
            openExerciseTypeCardColorPicker.length - 1
          ].index + 1,
        isOpen: false,
      },
    ]);
    setOpenAccordions((prev) => [...prev.map(() => false), true]);
  };

  const handleDeleteType = (type: ExerciseType, index: number) => {
    setOpenAccordions((prev) => prev.filter((_, i) => i !== index));
    if (!type?.id) {
      const currentExerciseTypes = [...exerciseTypes];
      currentExerciseTypes.splice(index, 1);
      setExerciseTypes(currentExerciseTypes);
    } else {
      handleDeleteExerciseType(type.id);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          backgroundColor: exerciseCardColor,
        }}
        className={`relative lg:!bg-white dark:lg:!bg-[#28282B]`}
      >
        <div className="relative flex h-full w-full flex-col gap-y-4 lg:gap-y-0">
          <div className="mt-5 flex w-full items-center justify-center lg:justify-start lg:px-5">
            <h1
              style={{
                color: exerciseTextColor,
              }}
              className="text-2xl font-bold lg:!text-gray-800 dark:lg:!text-white"
            >
              {currentExercise?.name}
            </h1>
          </div>

          <div className="relative flex w-full flex-col gap-y-4 rounded-t-[40px] bg-white px-5 pb-15 dark:bg-[#28282B] lg:rounded-none">
            <div
              className={`fixed top-17 right-3 flex flex-col items-center justify-center gap-y-2 rounded-full lg:top-10`}
            >
              <button
                onClick={() => setOpenActionsMenu((v) => !v)}
                style={{
                  backgroundColor: exerciseCardColor,
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-card transition-all hover:bg-gray-100 dark:bg-[#28282B] dark:hover:bg-[#3a3a3d]"
              >
                <Icon
                  icon={moreVerticalFill}
                  fontSize={30}
                  className="text-gray-700 dark:text-white"
                />
              </button>
              <AnimatePresence>
                {openActionsMenu && (
                  <motion.div
                    key="actions"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.1 } },
                    }}
                    className="flex flex-col items-end gap-y-2"
                  >
                    <motion.button
                      variants={{
                        hidden: { scale: 0 },
                        visible: {
                          scale: 1,
                          transition: { type: 'spring', duration: 0.1 },
                        },
                      }}
                      onClick={() => {
                        setOpenActionsMenu(false);
                        handleEditExercise({
                          id: exerciseId,
                          userId: Number(user?.id) ?? undefined,
                          cardColor: exerciseCardColor,
                          duration: exerciseDuration,
                          exerciseTypes: exerciseTypes,
                          name: exerciseName,
                          order: Number(exerciseOrder),
                          textColor: exerciseTextColor,
                        });
                      }}
                      style={{
                        backgroundColor: exerciseCardColor,
                        color: exerciseTextColor,
                      }}
                      className="h-7 w-7 rounded-full p-2 shadow-card transition-all hover:opacity-90"
                    >
                      <Icon icon={saveOutline} className="text-2xl" />
                    </motion.button>

                    <motion.button
                      variants={{
                        hidden: { scale: 0 },
                        visible: {
                          scale: 1,
                          transition: { type: 'spring', duration: 0.1 },
                        },
                      }}
                      onClick={() => {
                        setOpenActionsMenu(false);
                        handleDeleteExercise(exerciseId ?? undefined);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 p-2 shadow-card transition-all hover:bg-red-800"
                    >
                      <Icon icon={trash2Fill} className="text-2xl text-white" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col py-2 lg:flex-row lg:gap-x-4">
              <div className="mt-2 flex flex-col lg:mt-5">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Exercise card color:
                </h3>
                {!openExerciseColorPicker && (
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
                      setOpenExeriseColorPicker(!openExerciseColorPicker)
                    }
                    style={{
                      backgroundColor: exerciseCardColor,
                    }}
                  />
                )}
                {openExerciseColorPicker && (
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
                      color={exerciseCardColor}
                      onChange={setExerciseCardColor}
                    />

                    <div
                      className="cursor-pointer self-end rounded-full bg-white p-1 shadow-card transition-all hover:bg-gray-50"
                      onClick={() => setOpenExeriseColorPicker(false)}
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
                      backgroundColor: exerciseTextColor,
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
                      color={exerciseTextColor}
                      onChange={setExerciseTextColor}
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
                  borderColor: exerciseCardColor,
                }}
                className="w-full rounded-full border-2 bg-transparent py-1.5 px-3 outline-none transition-all focus:shadow-card dark:text-white"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Exercise Name"
              />
            </div>

            <div className="flex flex-col xl:w-1/3">
              <label className="mb-1 font-medium dark:text-white">
                Exercise order on the Home page:
              </label>
              <input
                style={{
                  borderColor: exerciseCardColor,
                }}
                className="w-full rounded-full border-2 bg-transparent py-1.5 px-3 outline-none transition-all focus:shadow-card dark:text-white"
                value={exerciseOrder}
                type="number"
                min={1}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setExerciseOrder('');
                  } else {
                    setExerciseOrder(Number(e.target.value));
                  }
                }}
                placeholder="Exercise Name"
              />
            </div>

            <div className="xl:w-1/3">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Exercise types:
              </h3>

              {exerciseTypes && (
                <div className="mt-2 flex flex-col gap-y-2">
                  {exerciseTypes.length > 0 &&
                    exerciseTypes.map((type, index: number) => (
                      <motion.div
                        style={{
                          backgroundColor:
                            exerciseTypes[index].seriesCardsColor,
                        }}
                        key={`${index}_${type.id}`}
                        className="flex flex-col overflow-hidden rounded-2xl shadow-card"
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
                      >
                        <button
                          type="button"
                          onClick={() => toggleAccordion(index)}
                          className="flex w-full items-center justify-between px-3 py-2.5"
                        >
                          <span
                            style={{
                              color: exerciseTypes[index].cardTextColor,
                            }}
                            className="truncate font-semibold"
                          >
                            {type.name}
                          </span>
                          <motion.div
                            animate={{
                              rotate: openAccordions[index] ? 180 : 0,
                            }}
                            transition={{ duration: 0.25 }}
                          >
                            <Icon
                              icon={chevronDownFill}
                              fontSize={30}
                              style={{
                                color: exerciseTypes[index].cardTextColor,
                              }}
                            />
                          </motion.div>
                        </button>

                        {/* Accordion body */}
                        <AnimatePresence initial={false}>
                          {openAccordions[index] && (
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
                                  style={{
                                    color: exerciseTypes[index].cardTextColor,
                                  }}
                                  className="font-medium"
                                >
                                  Name:
                                </label>
                                <input
                                  className="w-full rounded-full border-2 bg-white py-1.5 px-3 outline-none transition-all focus:shadow-card dark:bg-[#28282B] dark:text-white"
                                  type="text"
                                  value={type.name}
                                  onChange={(e) => {
                                    setExerciseTypes([
                                      ...exerciseTypes.slice(0, index),
                                      {
                                        ...exerciseTypes[index],
                                        name: e.target.value,
                                      },
                                      ...exerciseTypes.slice(index + 1),
                                    ]);
                                  }}
                                />
                              </div>

                              <div className="flex flex-col gap-y-1">
                                <label
                                  style={{
                                    color: exerciseTypes[index].cardTextColor,
                                  }}
                                  className="font-medium"
                                >
                                  Order on the Exercise page:
                                </label>
                                <input
                                  value={type.order}
                                  type="number"
                                  className="w-full rounded-full border-2 bg-white py-1.5 px-3 outline-none transition-all focus:shadow-card dark:bg-[#28282B] dark:text-white"
                                  onChange={(e) => {
                                    setExerciseTypes([
                                      ...exerciseTypes.slice(0, index),
                                      {
                                        ...exerciseTypes[index],
                                        order: Number(e.target.value),
                                      },
                                      ...exerciseTypes.slice(index + 1),
                                    ]);
                                  }}
                                />
                              </div>

                              <div className="flex flex-col gap-y-1">
                                <label
                                  style={{
                                    color: exerciseTypes[index].cardTextColor,
                                  }}
                                  className="font-medium"
                                >
                                  Number of series card:
                                </label>
                                <input
                                  value={Number(type.seriesCardNumber)}
                                  type="number"
                                  className="w-full rounded-full border-2 bg-white py-1.5 px-3 outline-none transition-all focus:shadow-card dark:bg-[#28282B] dark:text-white"
                                  onChange={(e) => {
                                    setExerciseTypes([
                                      ...exerciseTypes.slice(0, index),
                                      {
                                        ...exerciseTypes[index],
                                        seriesCardNumber: Number(
                                          e.target.value,
                                        ),
                                      },
                                      ...exerciseTypes.slice(index + 1),
                                    ]);
                                  }}
                                />
                              </div>

                              <div className="flex flex-col gap-y-1">
                                <label
                                  style={{
                                    color: exerciseTypes[index].cardTextColor,
                                  }}
                                  className="font-medium"
                                >
                                  Number of repetitions:
                                </label>
                                <input
                                  value={Number(type.numberOfRepetitions)}
                                  type="number"
                                  className="w-full rounded-full border-2 bg-white py-1.5 px-3 outline-none transition-all focus:shadow-card dark:bg-[#28282B] dark:text-white"
                                  onChange={(e) => {
                                    setExerciseTypes([
                                      ...exerciseTypes.slice(0, index),
                                      {
                                        ...exerciseTypes[index],
                                        numberOfRepetitions: Number(
                                          e.target.value,
                                        ),
                                      },
                                      ...exerciseTypes.slice(index + 1),
                                    ]);
                                  }}
                                />
                              </div>

                              <div className="flex flex-col gap-y-1">
                                <label
                                  style={{
                                    color: exerciseTypes[index].cardTextColor,
                                  }}
                                  className="font-medium"
                                >
                                  Color of the series cards:
                                </label>

                                {openExerciseTypeCardColorPicker[index] &&
                                  !openExerciseTypeCardColorPicker[index]
                                    .isOpen && (
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
                                      className="mt-1 h-5 w-12 cursor-pointer rounded-lg shadow-card"
                                      onClick={() =>
                                        setOpenExerciseTypeCardColorPicker([
                                          ...openExerciseTypeCardColorPicker.slice(
                                            0,
                                            index,
                                          ),
                                          {
                                            ...openExerciseTypeCardColorPicker[
                                              index
                                            ],
                                            isOpen:
                                              !openExerciseTypeCardColorPicker[
                                                index
                                              ].isOpen,
                                          },
                                          ...openExerciseTypeCardColorPicker.slice(
                                            index + 1,
                                          ),
                                        ])
                                      }
                                      style={{
                                        backgroundColor:
                                          exerciseTypes[index].seriesCardsColor,
                                      }}
                                    />
                                  )}
                                {openExerciseTypeCardColorPicker[index] &&
                                  openExerciseTypeCardColorPicker[index]
                                    .isOpen && (
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
                                        color={
                                          exerciseTypes[index].seriesCardsColor
                                        }
                                        onChange={(value) => {
                                          setExerciseTypes([
                                            ...exerciseTypes.slice(0, index),
                                            {
                                              ...exerciseTypes[index],
                                              seriesCardsColor: value,
                                            },
                                            ...exerciseTypes.slice(index + 1),
                                          ]);
                                        }}
                                      />

                                      <div
                                        className="cursor-pointer self-end rounded-full bg-white p-1 shadow-card transition-all hover:bg-gray-50"
                                        onClick={() =>
                                          setOpenExerciseTypeCardColorPicker([
                                            ...openExerciseTypeCardColorPicker.slice(
                                              0,
                                              index,
                                            ),
                                            {
                                              ...openExerciseTypeCardColorPicker[
                                                index
                                              ],
                                              isOpen: false,
                                            },
                                            ...openExerciseTypeCardColorPicker.slice(
                                              index + 1,
                                            ),
                                          ])
                                        }
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
                                  style={{
                                    color: exerciseTypes[index].cardTextColor,
                                  }}
                                  className="font-medium"
                                >
                                  Series card text color:
                                </label>

                                {openExerciseTypeCardTextColorPicker[index] &&
                                  !openExerciseTypeCardTextColorPicker[index]
                                    .isOpen && (
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
                                      className="mt-1 h-5 w-12 cursor-pointer rounded-lg shadow-card"
                                      onClick={() =>
                                        setOpenExerciseTypeCardTextColorPicker([
                                          ...openExerciseTypeCardTextColorPicker.slice(
                                            0,
                                            index,
                                          ),
                                          {
                                            ...openExerciseTypeCardTextColorPicker[
                                              index
                                            ],
                                            isOpen:
                                              !openExerciseTypeCardTextColorPicker[
                                                index
                                              ].isOpen,
                                          },
                                          ...openExerciseTypeCardTextColorPicker.slice(
                                            index + 1,
                                          ),
                                        ])
                                      }
                                      style={{
                                        backgroundColor:
                                          exerciseTypes[index].cardTextColor,
                                      }}
                                    />
                                  )}
                                {openExerciseTypeCardTextColorPicker[index] &&
                                  openExerciseTypeCardTextColorPicker[index]
                                    .isOpen && (
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
                                        color={
                                          exerciseTypes[index].cardTextColor
                                        }
                                        onChange={(value) => {
                                          setExerciseTypes([
                                            ...exerciseTypes.slice(0, index),
                                            {
                                              ...exerciseTypes[index],
                                              cardTextColor: value,
                                            },
                                            ...exerciseTypes.slice(index + 1),
                                          ]);
                                        }}
                                      />

                                      <div
                                        className="cursor-pointer self-end rounded-full bg-white p-1 shadow-card transition-all hover:bg-gray-50"
                                        onClick={() =>
                                          setOpenExerciseTypeCardTextColorPicker(
                                            [
                                              ...openExerciseTypeCardTextColorPicker.slice(
                                                0,
                                                index,
                                              ),
                                              {
                                                ...openExerciseTypeCardTextColorPicker[
                                                  index
                                                ],
                                                isOpen: false,
                                              },
                                              ...openExerciseTypeCardTextColorPicker.slice(
                                                index + 1,
                                              ),
                                            ],
                                          )
                                        }
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
                                onClick={() => handleDeleteType(type, index)}
                                className="cursor-pointer self-end rounded-full bg-red-700 p-2 shadow-card transition-all hover:bg-red-800"
                              >
                                <Icon
                                  icon={trash2Fill}
                                  className="text-xl text-white"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>

            <div className="self-center">
              <button
                style={{
                  backgroundColor: exerciseCardColor,
                  color: exerciseTextColor,
                }}
                onClick={handleAddNewExerciseType}
                className="rounded-full px-3 py-2 text-sm uppercase shadow-card transition-all hover:opacity-90"
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

export default EditExercise;
