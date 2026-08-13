import React, { useState } from "react";
import { ManageDevicePopup } from "../Devices/Managedevice";
import { OneShare } from "../Devices/OneShare";
import braceletDevice from "@/assets/pngs/Bracelet-Device.png";

const ConnectedDevices = ({ devices = [], onRefresh }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenOneShare, setIsOpenOneShare] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleOpenModal = (device) => {
    setSelectedDevice(device);
    setIsOpenModal(true);
  };

  const handleOpenOneShare = (device) => {
    setSelectedDevice(device);
    setIsOpenOneShare(true);
  };

  return (
    <div className="text-black dark:text-white mt-6">
      {isOpenModal && (
        <ManageDevicePopup
          device={selectedDevice}
          onClose={() => setIsOpenModal(false)}
          onRefresh={onRefresh}
        />
      )}
      {isOpenOneShare && (
        <OneShare
          device={selectedDevice}
          onClose={() => setIsOpenOneShare(false)}
          onRefresh={onRefresh}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-white border border-gray-100 dark:bg-gradient-to-b dark:from-[#4A4A4A] dark:via-[#1F1F1F] dark:to-black rounded-2xl px-4 pt-9 pb-6 shadow-md hover:shadow-lg transition flex flex-col h-full dark:border-none"
          >
            <div className="w-full rounded-2xl mb-4 overflow-hidden flex items-center justify-center flex-1 min-h-[180px]">
              <img
                src={device.image ? `https://api.facile.im/uploads/${device.image}` : braceletDevice}
                alt={device.device_name}
                className="h-full object-contain max-h-[160px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = braceletDevice;
                }}
              />
            </div>

            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100 dark:border-[#515151]">
              <h3 className="text-[23px] font-bold">{device.device_name}</h3>
              <span className={`text-[15px] px-4 py-2 rounded-full ${device.status === 'ACTIVATED' ? 'bg-gray-100 text-gray-700 dark:bg-[#292929] dark:text-white' : 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400'
                }`}>
                {device.status == "ACTIVATED" ? "Linked" : "Unlinked"}
              </span>
            </div>

            {/* Profile/User Info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center overflow-hidden">
                <img
                  src={(device.user?.avatar || device.profile?.profile_image) ?
                    `https://api.facile.im/uploads/${device.user?.avatar || device.profile?.profile_image}` :
                    "/pro-image.jpg"}
                  alt="Profile"
                  className="w-[50px] h-[50px] object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/pro-image.jpg";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-[18px] text-black dark:text-white font-medium">
                  {device.user?.full_name || device.profile?.profile_name || "Unknown Profile"}
                </p>

              </div>
            </div>

            <div className="mt-auto space-y-3">
              <button
                className="w-full bg-white text-black py-2.5 rounded-[12px] font-semibold text-sm hover:opacity-90 transition-opacity"
                onClick={() => handleOpenModal(device)}
              >
                Manage Device
              </button>

              <button
                className="deviceBtn w-full py-2.5 rounded-[12px] text-sm font-medium transition-colors border border-gray-200 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
                onClick={() => handleOpenOneShare(device)}
              >
                {device.one_share_active ? "Edit One Share" : "Setup One Share"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedDevices;
