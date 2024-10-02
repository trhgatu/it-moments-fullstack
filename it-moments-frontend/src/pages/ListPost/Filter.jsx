import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

const Filter = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        console.log("Bạn đã chọn:", selectedValue);
        setIsOpen(false);  
    };

    return (
        <div className="relative z-10">
            <button 
                onClick={toggleDropdown} 
                className="bg-[#007BFF] text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[#0056b3] transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                style={{ height: '48px', borderRadius: '10px' }}
            >
                <FaFilter className="mr-2" /> Bộ lọc
            </button>
            {isOpen && (
                <div 
                    className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg" 
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                    <select 
                        className="w-full p-3 bg-white text-blue-500 rounded-lg outline-none"
                        onChange={handleChange}
                        style={{ borderRadius: '10px', fontSize: '16px', padding: '12px' }}
                    >
                        <option value="all" className="p-3 hover:bg-blue-100">Tất cả</option>
                        <option value="recent" className="p-3 hover:bg-blue-100">Mới nhất</option>
                        <option value="popular" className="p-3 hover:bg-blue-100">Phổ biến</option>
                        <option value="viewed" className="p-3 hover:bg-blue-100">Được xem nhiều nhất</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default Filter;
