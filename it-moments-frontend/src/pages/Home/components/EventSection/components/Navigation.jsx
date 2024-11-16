// src/components/Navigation.js
import React from 'react';

const Navigation = ({ onPrev, onNext }) => {
    return (
        <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 z-10 px-4 md:px-8">
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 md:px-6 md:py-3"
                onClick={onPrev}
            >
                Prev
            </button>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 md:px-6 md:py-3"
                onClick={onNext}
            >
                Next
            </button>
        </div>
    );
};

export default Navigation;
