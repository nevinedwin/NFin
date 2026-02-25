'use client';

import React from 'react';
import ReactDatePicker from 'react-datepicker';

type PickerMode = 'date' | 'monthYear' | 'dateTime';

type CustomDatePickerProps = {
    label?: string;
    selected?: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    mode?: PickerMode;
    name?:string;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    label,
    selected,
    onChange,
    name,
    placeholder = 'Select date',
    className = '',
    required = false,
    disabled = false,
    mode = 'date', // default mode
}) => {
    // react-datepicker props depending on mode
    const datePickerProps =
        mode === 'dateTime'
            ? { showTimeSelect: true, timeFormat: 'HH:mm', timeIntervals: 15, dateFormat: 'dd/MM/yyyy HH:mm' }
            : mode === 'monthYear'
                ? { showMonthYearPicker: true, dateFormat: 'MM/yyyy' }
                : { dateFormat: 'dd/MM/yyyy' }; // date only

    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label className="text-slate-400 text-sm mb-1 font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <ReactDatePicker
                selected={selected}
                onChange={onChange}
                name={name}
                placeholderText={placeholder}
                className="w-full rounded-xl p-3 border border-gray-900 text-gray-50 bg-border outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-700"
                calendarClassName="rounded-xl border border-gray-300 bg-gray-50 shadow-lg p-2 text-gray-900"
                disabled={disabled}
                showPopperArrow={false}
                {...datePickerProps}
            />
        </div>
    );
};

export default CustomDatePicker;