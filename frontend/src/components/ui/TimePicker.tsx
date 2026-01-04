"use client";

import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HiOutlineClock } from 'react-icons/hi2';

interface TimePickerProps {
  selected: Date | null;
  onChange: (time: Date | null) => void;
  placeholderText?: string;
  minTime?: Date;
  maxTime?: Date;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  timeIntervals?: number;
  timeFormat?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  selected,
  onChange,
  placeholderText = "Select time",
  minTime,
  maxTime,
  error = false,
  disabled = false,
  className = "",
  name,
  timeIntervals = 15,
  timeFormat = "HH:mm",
}) => {
  return (
    <div className="relative timepicker-wrapper">
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        minTime={minTime}
        maxTime={maxTime}
        disabled={disabled}
        name={name}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={timeIntervals}
        timeFormat={timeFormat}
        dateFormat={timeFormat}
        className={`w-full h-10 rounded-lg border px-3 py-2 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        calendarClassName="custom-timepicker"
        wrapperClassName="w-full"
        popperClassName="custom-timepicker-popper"
      />
      <HiOutlineClock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      
      <style jsx global>{`
        /* Timepicker wrapper */
        .react-datepicker-wrapper {
          width: 100%;
        }

        /* Popper container */
        .custom-timepicker-popper {
          z-index: 9999;
        }

        /* Main container - Light theme */
        .custom-timepicker {
          font-family: inherit;
          background-color: white;
          border: 1px solid rgb(229 231 235);
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          overflow: hidden;
        }

        /* Main container - Dark theme */
        .dark .custom-timepicker {
          background-color: rgb(17 24 39);
          border-color: rgb(55 65 81);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3);
        }

        /* Header - Light theme */
        .react-datepicker__header--time {
          background-color: rgb(249 250 251);
          border-bottom: 1px solid rgb(229 231 235);
          padding: 0.75rem;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }

        /* Header - Dark theme */
        .dark .react-datepicker__header--time {
          background-color: rgb(31 41 55);
          border-bottom-color: rgb(55 65 81);
        }

        /* Time container */
        .react-datepicker__time-container {
          border-left: none;
          width: 100%;
        }

        .react-datepicker__time {
          background-color: white;
        }

        .dark .react-datepicker__time {
          background-color: rgb(17 24 39);
        }

        /* Time box */
        .react-datepicker__time-box {
          width: 100%;
          margin: 0;
        }

        /* Time list */
        .react-datepicker__time-list {
          padding: 0.5rem 0;
          max-height: 200px !important;
          overflow-y: auto;
        }

        /* Scrollbar - Light theme */
        .react-datepicker__time-list::-webkit-scrollbar {
          width: 8px;
        }

        .react-datepicker__time-list::-webkit-scrollbar-track {
          background-color: rgb(249 250 251);
          border-radius: 0.375rem;
        }

        .react-datepicker__time-list::-webkit-scrollbar-thumb {
          background-color: rgb(209 213 219);
          border-radius: 0.375rem;
        }

        .react-datepicker__time-list::-webkit-scrollbar-thumb:hover {
          background-color: rgb(156 163 175);
        }

        /* Scrollbar - Dark theme */
        .dark .react-datepicker__time-list::-webkit-scrollbar-track {
          background-color: rgb(31 41 55);
        }

        .dark .react-datepicker__time-list::-webkit-scrollbar-thumb {
          background-color: rgb(75 85 99);
        }

        .dark .react-datepicker__time-list::-webkit-scrollbar-thumb:hover {
          background-color: rgb(107 114 128);
        }

        /* Time list items - Light theme */
        .react-datepicker__time-list-item {
          padding: 0.5rem 1rem;
          color: rgb(17 24 39);
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        /* Time list items - Dark theme */
        .dark .react-datepicker__time-list-item {
          color: rgb(243 244 246);
        }

        .react-datepicker__time-list-item:hover {
          background-color: rgb(243 244 246);
        }

        .dark .react-datepicker__time-list-item:hover {
          background-color: rgb(55 65 81);
        }

        /* Selected time */
        .react-datepicker__time-list-item--selected {
          background-color: rgb(59 130 246) !important;
          color: white !important;
          font-weight: 600;
        }

        .react-datepicker__time-list-item--selected:hover {
          background-color: rgb(37 99 235) !important;
        }

        /* Disabled time */
        .react-datepicker__time-list-item--disabled {
          color: rgb(209 213 219) !important;
          cursor: not-allowed;
        }

        .dark .react-datepicker__time-list-item--disabled {
          color: rgb(75 85 99) !important;
        }

        .react-datepicker__time-list-item--disabled:hover {
          background-color: transparent !important;
        }

        /* Triangle */
        .react-datepicker__triangle {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TimePicker;
