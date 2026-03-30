import close from '@iconify/icons-eva/close-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import { Icon } from '@iconify/react';
import {
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isWithinInterval,
  parse,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import hu from 'date-fns/locale/hu';
import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// @ts-ignore
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useHome from '../../hooks/useHome';
// @ts-ignore
import { confirmAlert } from 'react-confirm-alert';
import ConfirmAlertLayout from '../../components/shared/ConfirmAlertLayout';
import { getItem } from '../../lib/storage';
// @ts-ignore
import { useSnackbar } from 'notistack';
import useApi from '../../hooks/useApi';
import './Calendar.css';
import CustomToolbar from './components/CustomToolbar';

const locales = {
  hu: hu,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: hu }),
  getDay,
  locales,
});

export type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  cardColor: string;
  textColor: string;
  allDay?: boolean;
};

const eventStyleGetter = (
  event: CalendarEvent,
  start: Date,
  end: Date,
  isSelected: boolean,
) => {
  return {
    style: {
      backgroundColor: event.cardColor,
      color: event.textColor,
    },
  };
};

const CalendarPage = () => {
  const isDarkMode = getItem('mode') === 'dark';
  const { user, refetchUser } = useHome();
  const apiClient = useApi();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const events: CalendarEvent[] = useMemo(() => {
    return (
      user?.exerciseHistory?.map((history) => ({
        id: history?.exercise?.id ?? 0,
        title: history?.exercise?.name ?? '',
        start: new Date(history.date),
        end: new Date(history.date),
        cardColor: history?.exercise?.cardColor ?? '',
        textColor: history?.exercise?.textColor ?? '',
        allDay: true,
      })) ?? []
    );
  }, [user?.exerciseHistory]);
  const workoutsThisWeek = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { locale: hu });
    const weekEnd = endOfWeek(today, { locale: hu });

    return (
      user?.exerciseHistory?.filter((history) =>
        isWithinInterval(new Date(history.date), {
          start: weekStart,
          end: weekEnd,
        }),
      ).length ?? 0
    );
  }, [user?.exerciseHistory]);
  const workoutsThisMonth = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    return (
      user?.exerciseHistory?.filter((history) =>
        isWithinInterval(new Date(history.date), {
          start: monthStart,
          end: monthEnd,
        }),
      ).length ?? 0
    );
  }, [user?.exerciseHistory]);

  const deleteEvent = async (exerciseId: number, date: string): Promise<boolean> => {
    try {
      await apiClient.deleteFromHistory(Number(user?.id), exerciseId, date);

      refetchUser();

      const key = enqueueSnackbar('Workout deleted!', {
        variant: 'success',
        autoHideDuration: 3000,
        onClick: () => {
          closeSnackbar(key);
        },
      });

      return true;
    } catch (error: any) {
      const key = enqueueSnackbar('Error in delete workout!', {
        variant: 'error',
        autoHideDuration: 3000,
        onClick: () => {
          closeSnackbar(key);
        },
      });

      return false;
    }
  };

  const handleDeleteEvent = (exerciseId: number, date: string): void => {
    confirmAlert({
      customUI: ({ onClose }: { onClose: () => void }) => {
        return (
          <ConfirmAlertLayout>
            <>
              <p className="text-md text-left font-medium text-gray-800 lg:text-lg lg:font-bold">
                Are you sure you want to delete the workout from the calendar?
              </p>

              <div className="mt-4 flex flex-row justify-end gap-x-2">
                <button
                  className="rounded-full bg-[#4A9ECC] px-2 py-1 uppercase text-white transition-all hover:bg-[#0e6696]"
                  onClick={() => onClose()}
                >
                  cancel
                </button>

                <button
                  className="rounded-full bg-red-500 px-2 py-1 font-bold uppercase text-white transition-all hover:bg-red-700"
                  onClick={() => {
                    deleteEvent(exerciseId, date);
                    onClose();
                  }}
                >
                  delete
                </button>
              </div>
            </>
          </ConfirmAlertLayout>
        );
      },
    });
  };

  const handleEventClick = (event: CalendarEvent) => {
    confirmAlert({
      customUI: ({ onClose }: { onClose: () => void }) => {
        return (
          <ConfirmAlertLayout
            classNames="w-[80%] rounded-3xl h-24 p-2"
            style={{
              backgroundColor: event.cardColor,
            }}
          >
            <div className="flex flex-row-reverse justify-between gap-2">
              <div className="flex flex-col justify-between gap-2 self-end">
                <button
                  className={`
                    rounded-full border-4 border-white 
                    bg-transparent p-1 
                    text-sm font-semibold text-gray-800
                  `}
                  onClick={onClose}
                >
                  <Icon
                    icon={close}
                    className="font-bold text-white transition-all"
                    fontSize={30}
                  />
                </button>
                <div
                  onClick={() => handleDeleteEvent(event.id, format(event.start, 'yyyy-MM-dd'))}
                  className="cursor-pointer self-end rounded-full bg-red-700 p-2 shadow-card transition-all hover:bg-red-800"
                >
                  <Icon icon={trash2Fill} className="text-xl text-white" />
                </div>
              </div>
              <div className="self-center">
                <h2 className="ml-2 mt-2 text-3xl font-bold text-white">
                  {event.title}
                </h2>
              </div>
            </div>
          </ConfirmAlertLayout>
        );
      },
    });
  };

  return (
    <div className="flex-container flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-[#1D2228]">
      {/* Cards Section */}
      <div className="cards mb-5 -mt-[20%] flex flex-row gap-4">
        <div className="card flex-1 rounded-3xl bg-white p-3 shadow-md dark:bg-[#2A2E37]">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-white">
            {workoutsThisWeek}
          </h2>
          <p className="text-md mt-1 font-bold text-gray-600 dark:text-gray-300">
            Workouts this week
          </p>
        </div>
        <div className="card flex-1 rounded-3xl bg-white p-3 shadow-md dark:bg-[#2A2E37]">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-white">
            {workoutsThisMonth}
          </h2>
          <p className="text-md mt-1 font-bold text-gray-600 dark:text-gray-300">
            Workouts this month
          </p>
        </div>
      </div>

      <div
        className={
          'h-[58vh] w-full max-w-4xl justify-center overflow-x-auto rounded-3xl bg-white shadow-lg dark:bg-[#2A2E37]'
        }
      >
        <style>{`
          .rbc-day-bg {
            background-color: ${isDarkMode ? '#252525' : '#fff'};
          }
          .rbc-button-link {
            color: ${isDarkMode ? '#FFFFFF' : '#000000'};
          }
        `}</style>
        <Calendar
          toolbar={true}
          localizer={localizer}
          events={events}
          onSelectEvent={handleEventClick}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
