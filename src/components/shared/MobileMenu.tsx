import { Icon } from '@iconify/react';

import calendarFill from '@iconify/icons-eva/calendar-fill';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import useMenu from '../../hooks/useMenu';

const MobileMenu = () => {
  const {
    isHomePage,
    isProfilePage,
    isExercisePage,
    handleNavigateToOtherPage,
    handleConfirmPageNavigation,
    isCalendarPage,
  } = useMenu();

  const activeColor = '#1490d3';
  const inactiveColor = '#91919181';

  return (
    <div
      style={{
        transform: 'translateX(-50%)',
      }}
      className={`
        fixed bottom-1.5 left-1/2 z-20 flex h-8 w-[75%] flex-row items-center
        justify-evenly rounded-full bg-white/80 shadow-top backdrop-blur-md dark:bg-[#2A2E37]/80
        lg:hidden
      `}
    >
      <div
        className="flex cursor-pointer flex-col items-center justify-center transition-all"
        onClick={() => {
          if (isExercisePage) {
            handleConfirmPageNavigation('home');
          } else {
            handleNavigateToOtherPage('home');
          }
        }}
      >
        <Icon
          icon={homeFill}
          fontSize={34}
          color={isHomePage ? activeColor : inactiveColor}
        />
      </div>

      <div
        className="flex cursor-pointer flex-col items-center justify-center transition-all"
        onClick={() => {
          if (isExercisePage) {
            handleConfirmPageNavigation('calendar');
          } else {
            handleNavigateToOtherPage('calendar');
          }
        }}
      >
        <Icon
          icon={calendarFill}
          fontSize={34}
          color={isCalendarPage ? activeColor : inactiveColor}
        />
      </div>

      <div
        className="flex cursor-pointer flex-col items-center justify-center transition-all"
        onClick={() => {
          if (isExercisePage) {
            handleConfirmPageNavigation('profile');
          } else {
            handleNavigateToOtherPage('profile');
          }
        }}
      >
        <Icon
          icon={personFill}
          fontSize={36}
          color={isProfilePage ? activeColor : inactiveColor}
        />
      </div>
    </div>
  );
};

export default MobileMenu;
