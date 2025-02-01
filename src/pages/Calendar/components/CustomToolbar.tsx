import { NavigateAction } from 'react-big-calendar';

const CustomToolbar = ({
  label,
  onNavigate,
}: {
  label: string;
  onNavigate: (navigate: NavigateAction, date?: Date) => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1 bg-[#4A9ECB] py-[7%] text-white shadow-md">
      <span className="text-2xl font-bold">{label}</span>
      <div className="mt-3 flex flex-row gap-x-1">
        <button
          className="rounded-xl bg-white px-3 py-1 text-lg font-bold uppercase text-[#4A9ECB] shadow-2xl dark:bg-[#38383a] dark:text-[#fff]"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </button>
        <button
          className="rounded-xl bg-white px-3 py-1 text-lg font-bold uppercase text-[#4A9ECB] shadow-2xl dark:bg-[#38383a] dark:text-[#fff]"
          onClick={() => onNavigate('PREV')}
        >
          Back
        </button>
        <button
          className="rounded-xl bg-white px-3 py-1 text-lg font-bold uppercase text-[#4A9ECB] shadow-2xl dark:bg-[#38383a] dark:text-[#fff]"
          onClick={() => onNavigate('NEXT')}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;
