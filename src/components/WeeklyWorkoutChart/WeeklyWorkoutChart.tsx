import * as Popover from '@radix-ui/react-popover';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import { useMemo } from 'react';
import { getItem } from '../../lib/storage';
import Exercise from '../../models/Exercise';

type HistoryEntry = {
  date: string;
  exerciseId: string;
  exercise?: Exercise;
};

type Props = {
  exerciseHistory: HistoryEntry[] | null | undefined;
};

type DayData = {
  label: string;
  date: Date;
  workouts: HistoryEntry[];
};

const WeeklyWorkoutChart = ({ exerciseHistory }: Props) => {
  const isDarkMode = getItem('mode') === 'dark';
  const days: DayData[] = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const workouts = (exerciseHistory ?? []).filter((h) =>
        isSameDay(new Date(h.date), date),
      );
      return {
        label: format(date, 'EEE'),
        date,
        workouts,
      };
    });
  }, [exerciseHistory]);

  const today = new Date();

  return (
    <div className="mt-4 w-full rounded-3xl bg-white p-3 shadow-card dark:bg-[#2A2E37]">
        <h2 className="mb-4 text-lg font-bold uppercase text-gray-800 dark:text-white">
          Progress this week
        </h2>
        <div className="flex h-16 items-end justify-between gap-1">
          {days.map((day) => {
            const hasWorkout = day.workouts.length > 0;
            const isToday = isSameDay(day.date, today);
            const color = hasWorkout
              ? day.workouts[0].exercise?.cardColor ?? '#4A9ECB'
              : undefined;

            const column = (
              <div
                className="flex w-full flex-col items-center justify-end"
                style={{ height: '100px' }}
              >
                <div
                  className="w-full rounded-xl transition-all duration-300"
                  style={{
                    height: hasWorkout ? '100px' : '25px',
                    backgroundColor: hasWorkout
                      ? color
                      : isToday
                        ? '#94a3b8'
                        : isDarkMode
                          ? '#434c53'
                          : '#91919181',
                  }}
                />
              </div>
            );

            return (
              <div
                key={day.label}
                className="flex flex-1 flex-col items-center gap-y-1"
              >
                {hasWorkout ? (
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button className="w-full cursor-pointer">
                        {column}
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        side="top"
                        sideOffset={6}
                        className="z-50 rounded-xl px-2 py-1 text-sm font-semibold text-white shadow-card"
                        style={{ backgroundColor: color }}
                      >
                        <p>{day.workouts[0].exercise?.name}</p>
                        {day.workouts.length > 1 && (
                          <p className="text-xs font-normal opacity-80">
                            +{day.workouts.length - 1} more
                          </p>
                        )}
                        <p className="text-xs font-normal opacity-80">
                          {format(day.date, 'MMM d')}
                        </p>
                        <Popover.Arrow style={{ fill: color }} />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                ) : (
                  column
                )}
                <span
                  className={
                    isToday
                      ? 'text-xs font-semibold text-[#1490d3]'
                      : 'text-xs font-semibold text-gray-400 dark:text-gray-500'
                  }
                >
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
  );
};

export default WeeklyWorkoutChart;

