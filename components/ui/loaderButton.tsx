import React from 'react'

const LoaderButton = ({ className }: { className: string }) => {
    return (
        // <button
        //     className="flex items-center justify-center gap-2   px-4 py-2 rounded-md disabled:opacity-60"
        //     disabled
        // >
        <svg
            className={`animate-spin ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
            ></path>
        </svg>

        //     Loading...
        // </button>
    )
}

export default LoaderButton