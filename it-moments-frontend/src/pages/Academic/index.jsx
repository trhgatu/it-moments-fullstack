import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import MainNotifications from './MainNotifications';
import NewAnnouncements from './NewAnnouncements';
import UpcomingEvents from './UpcomingEvents';

const Academic = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-6 grid grid-cols-12 gap-8">
        
        {/* Breadcrumbs */}
        <div className="col-span-12 mb-6">
          <Breadcrumbs />
        </div>
        
        {/* Main Notifications Section */}
        <div className="col-span-12 md:col-span-8 bg-white p-6 rounded-lg shadow-lg">
          <MainNotifications />
        </div>

        {/* Side Sections */}
        <div className="col-span-12 md:col-span-4 space-y-8">
          {/* New Announcements Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <NewAnnouncements />
          </div>

          {/* Upcoming Events Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academic;
