import React from 'react';

const Category = ({ onCategoryChange }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Sự kiện</h3>
            <ul className="space-y-2">
                <li>
                    <button
                        onClick={() => onCategoryChange("ongoing")}
                        className="text-blue-600 hover:underline"
                    >
                        Sự kiện đang diễn ra
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => onCategoryChange("upcoming")}
                        className="text-blue-600 hover:underline"
                    >
                        Sự kiện sắp diễn ra
                    </button>
                </li>

            </ul>
        </div>
    );
};

export default Category;
