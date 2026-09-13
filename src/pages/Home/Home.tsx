import { useMemo } from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import ExerciseCard from '../../components/ExerciseCard';
import AddExerciseButton from '../../components/shared/AddExerciseButton';
import WeeklyWorkoutChart from '../../components/WeeklyWorkoutChart/WeeklyWorkoutChart';
import useHome from '../../hooks/useHome';
import Exercise from '../../models/Exercise';

const sectionInitial = { opacity: 0, x: -40 };
const sectionAnimate = { opacity: 1, x: 0 };
const sectionTransition = (index: number) => ({
  duration: 0.5,
  delay: index * 0.15,
});

const Home = (): JSX.Element => {
  const { user } = useHome();

  const sortExerciseByOrder = (a: Exercise, b: Exercise): number => {
    if (a.order === b.order) {
      if ((a.modified ?? '') < (b.modified ?? '')) return -1;
      if ((a.modified ?? '') > (b.modified ?? '')) return 1;
      return 0;
    } else {
      return a.order - b.order;
    }
  };

  const sortedExercises = useMemo(() => {
    if (user?.exercises) {
      return user?.exercises.sort(sortExerciseByOrder);
    } else {
      return [];
    }
  }, [user]);

  return (
    <div className="flex h-screen w-full flex-col overflow-y-auto bg-white px-4 pb-16 dark:bg-[#1D2228] lg:pb-7">
      <motion.div
        className="mt-5 lg:mt-7"
        initial={sectionInitial}
        animate={sectionAnimate}
        transition={sectionTransition(0)}
      >
        <p className="mt-1 text-gray-500 dark:text-gray-400">Welcome back</p>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {user?.firstname}! 👋
        </h1>
      </motion.div>

      {user?.lastExercise && (
        <motion.div
          className="mt-4 lg:mt-7"
          initial={sectionInitial}
          animate={sectionAnimate}
          transition={sectionTransition(1)}
        >
          <h1 className="text-xl font-bold uppercase text-gray-800 dark:text-white">
            Your last workout:
          </h1>
          <div className="mt-2">
            <ExerciseCard exercise={user?.lastExercise} isLastExercise />
          </div>
        </motion.div>
      )}

      <motion.div
        initial={sectionInitial}
        animate={sectionAnimate}
        transition={sectionTransition(2)}
      >
        <WeeklyWorkoutChart exerciseHistory={user?.exerciseHistory} />
      </motion.div>

      {user?.exercises && user?.exercises.length > 0 ? (
        <motion.div
          className="mt-4 flex flex-col"
          initial={sectionInitial}
          animate={sectionAnimate}
          transition={sectionTransition(3)}
        >
          <h2 className="text-xl font-bold uppercase text-gray-800 dark:text-white">
            Your workouts:
          </h2>
          <div className="w-full">
            <Swiper
              spaceBetween={-40}
              slidesPerView={1.2}
              style={{
                marginLeft: '-32px',
                marginRight: '-32px',
                paddingLeft: 32,
                paddingRight: 32,
              }}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3.2 },
              }}
            >
              {sortedExercises.map((exercise: Exercise) => (
                <SwiperSlide
                  key={exercise.id}
                  style={{ paddingTop: '20px', paddingBottom: '20px' }}
                >
                  <ExerciseCard exercise={exercise} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      ) : null}

      <div className="absolute bottom-9 right-10 z-20 hidden lg:flex">
        <AddExerciseButton />
      </div>

      <div className=" relative mt-3 flex justify-center lg:hidden">
        <AddExerciseButton />
      </div>
    </div>
  );
};

export default Home;
