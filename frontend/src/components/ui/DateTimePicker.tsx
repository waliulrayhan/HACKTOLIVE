"use client";

import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HiOutlineClock } from 'react-icons/hi2';

interface DateTimePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  minDate?: Date;
  maxDate?: Date;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  showTimeSelect?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  dateFormat?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selected,
  onChange,
  placeholderText = "Select date and time",
  minDate,
  maxDate,
  error = false,
  disabled = false,
  className = "",
  name,
  showTimeSelect = true,
  timeFormat = "HH:mm",
  timeIntervals = 15,
  dateFormat = "yyyy-MM-dd HH:mm",
}) => {
  return (
    <div className="relative datepicker-wrapper">
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        name={name}
        showTimeSelect={showTimeSelect}
        timeFormat={timeFormat}
        timeIntervals={timeIntervals}
        dateFormat={dateFormat}
        className={`w-full h-10 rounded-lg border px-3 py-2 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        calendarClassName="custom-datepicker"
        wrapperClassName="w-full"
        popperClassName="custom-datepicker-popper"
      />
      <HiOutlineClock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      
      <style jsx global>{`
        /* Datepicker wrapper */
        .react-datepicker-wrapper {
          width: 100%;
        }

        /* Popper container */
        .custom-datepicker-popper {
          z-index: 9999;
        }

        /* Main container - Light theme */
        .custom-datepicker {
          font-family: inherit;
          background-color: white;
          border: 1px solid rgb(229 231 235);
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          overflow: hidden;
        }

        /* Main container - Dark theme */
        .dark .custom-datepicker {
          background-color: rgb(17 24 39);
          border-color: rgb(55 65 81);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3);
        }

        /* Header - Light theme */
        .react-datepicker__header {
          background-color: rgb(249 250 251);
          border-bottom: 1px solid rgb(229 231 235);
          padding: 1rem 0.75rem 0.75rem;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }

        /* Header - Dark theme */
        .dark .react-datepicker__header {
          background-color: rgb(31 41 55);
          border-bottom-color: rgb(55 65 81);
        }

        /* Time header */
        .react-datepicker__header--time {
          padding: 0.5rem;
        }

        /* Current month - Light theme */
        .react-datepicker__current-month,
        .react-datepicker-time__header {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgb(17 24 39);
          margin-bottom: 0.5rem;
        }

        /* Current month - Dark theme */
        .dark .react-datepicker__current-month,
        .dark .react-datepicker-time__header {
          color: rgb(243 244 246);
        }

        /* Navigation buttons */
        .react-datepicker__navigation {
          top: 1rem;
          width: 2rem;
          height: 2rem;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .react-datepicker__navigation:hover {
          background-color: rgb(243 244 246);
        }

        .dark .react-datepicker__navigation:hover {
          background-color: rgb(55 65 81);
        }

        .react-datepicker__navigation-icon::before {
          border-color: rgb(107 114 128);
          border-width: 2px 2px 0 0;
        }

        .dark .react-datepicker__navigation-icon::before {
          border-color: rgb(156 163 175);
        }

        /* Day names */
        .react-datepicker__day-names {
          display: flex;
          justify-content: space-around;
          padding: 0 0.5rem;
        }

        .react-datepicker__day-name {
          color: rgb(107 114 128);
          font-size: 0.75rem;
          font-weight: 600;
          width: 2rem;
          line-height: 2rem;
          margin: 0.166rem;
        }

        .dark .react-datepicker__day-name {
          color: rgb(156 163 175);
        }

        /* Month container - Light theme */
        .react-datepicker__month {
          margin: 0.75rem;
          background-color: white;
        }

        /* Month container - Dark theme */
        .dark .react-datepicker__month {
          background-color: rgb(17 24 39);
        }

        /* Weeks */
        .react-datepicker__week {
          display: flex;
          justify-content: space-around;
        }

        /* Days - Light theme */
        .react-datepicker__day {
          color: rgb(17 24 39);
          width: 2rem;
          height: 2rem;
          line-height: 2rem;
          margin: 0.166rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        /* Days - Dark theme */
        .dark .react-datepicker__day {
          color: rgb(243 244 246);
        }

        .react-datepicker__day:hover {
          background-color: rgb(243 244 246);
          border-radius: 0.375rem;
        }

        .dark .react-datepicker__day:hover {
          background-color: rgb(55 65 81);
        }

        /* Selected day */
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: rgb(59 130 246) !important;
          color: white !important;
          border-radius: 0.375rem;
          font-weight: 600;
        }

        .react-datepicker__day--selected:hover,
        .react-datepicker__day--keyboard-selected:hover {
          background-color: rgb(37 99 235) !important;
        }

        /* Today - Light theme */
        .react-datepicker__day--today {
          font-weight: 600;
          color: rgb(59 130 246);
        }

        /* Today - Dark theme */
        .dark .react-datepicker__day--today {
          color: rgb(96 165 250);
        }

        /* Outside month - Light theme */
        .react-datepicker__day--outside-month {
          color: rgb(209 213 219);
        }

        /* Outside month - Dark theme */
        .dark .react-datepicker__day--outside-month {
          color: rgb(75 85 99);
        }

        /* Disabled - Light theme */
        .react-datepicker__day--disabled {
          color: rgb(209 213 219) !important;
          cursor: not-allowed;
        }

        /* Disabled - Dark theme */
        .dark .react-datepicker__day--disabled {
          color: rgb(75 85 99) !important;
        }

        .react-datepicker__day--disabled:hover {
          background-color: transparent !important;
        }

        /* Time container */
        .react-datepicker__time-container {
          border-left: 1px solid rgb(229 231 235);
        }

        .dark .react-datepicker__time-container {
          border-left-color: rgb(55 65 81);
        }

        .react-datepicker__time {
          background-color: white;
        }

        .dark .react-datepicker__time {
          background-color: rgb(17 24 39);
        }

        .react-datepicker__time-box {
          width: 100%;
        }

        /* Time list */
        .react-datepicker__time-list {
          padding: 0 !important;
        }

        .react-datepicker__time-list-item {
          height: 2rem !important;
          padding: 0.25rem 0.5rem !important;
          font-size: 0.875rem;
          color: rgb(17 24 39);
          transition: all 0.2s;
        }

        .dark .react-datepicker__time-list-item {
          color: rgb(243 244 246);
        }

        .react-datepicker__time-list-item:hover {
          background-color: rgb(243 244 246) !important;
        }

        .dark .react-datepicker__time-list-item:hover {
          background-color: rgb(55 65 81) !important;
        }

        .react-datepicker__time-list-item--selected {
          background-color: rgb(59 130 246) !important;
          color: white !important;
          font-weight: 600;
        }

        .react-datepicker__time-list-item--selected:hover {
          background-color: rgb(37 99 235) !important;
        }

        .react-datepicker__time-list-item--disabled {
          color: rgb(209 213 219) !important;
        }

        .dark .react-datepicker__time-list-item--disabled {
          color: rgb(75 85 99) !important;
        }

        /* Triangle */
        .react-datepicker__triangle {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DateTimePicker;
