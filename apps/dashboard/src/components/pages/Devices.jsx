import React, { useState, useEffect } from "react";
import NotConnected from "../Devices/NotConnected";
import ConnectedDevices from "../Devices/ConnectedDevices";
import ActivateDevice from "../Devices/ActivateDevice";
import { getDevices, generateDeviceCode, checkActivationStatus } from "../../services/device";
import Loader from "../../store/utils/Loader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { showToast } from "../../store/utils/toast";
import { useSelector } from "react-redux";

export default function DevicesPage() {
  const [activeTab, setActiveTab] = useState("facile");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [activationCode, setActivationCode] = useState(null);
  const [activationStatus, setActivationStatus] = useState("PENDING"); // PENDING, SCANNED, COMPLETED
  const profileMode = useSelector((state) => state.user.profileMode);
  const isRescue = profileMode === "rescue";

  const fetchDevices = async (tab) => {
    setLoading(true);
    try {
      const response = await getDevices(tab === "facile-teams", isRescue ? "rescue" : undefined);
      if (response.data.success) {
        setDevices(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices(activeTab);
  }, [activeTab, isRescue]);

  useEffect(() => {
    let interval;
    if (isAddingDevice && activationCode && activationStatus !== "COMPLETED") {
      interval = setInterval(async () => {
        try {
          const response = await checkActivationStatus(activationCode);
          if (response.data.success) {
            const newStatus = response.data.status;
            setActivationStatus(newStatus);

            if (newStatus === "COMPLETED") {
              showToast("success", "Device activated successfully!");
              setIsAddingDevice(false);
              fetchDevices(activeTab);
              setActivationCode(null);
              setActivationStatus("PENDING");
            }
          }
        } catch (error) {
          console.error("Status check error:", error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAddingDevice, activationCode, activationStatus, activeTab]);

  // Refresh code every 15 minutes
  useEffect(() => {
    let refreshInterval;
    if (isAddingDevice && activationStatus === "PENDING") {
      refreshInterval = setInterval(() => {
        handleAddDevice();
      }, 900000); // 15 minutes
    }
    return () => clearInterval(refreshInterval);
  }, [isAddingDevice, activationStatus]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setIsAddingDevice(false); // Reset add state when switching tabs
  };

  const handleAddDevice = async () => {
    setLoading(true);
    try {
      const response = await generateDeviceCode();
      if (response.data.success) {
        setActivationCode(response.data.code);
        setActivationStatus("PENDING");
        setIsAddingDevice(true);
      } else {
        showToast("error", response.data.message || "Failed to generate activation code.");
      }
    } catch (error) {
      console.error("Generate code error:", error);
      showToast("error", "Failed to generate activation code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#262626] p-10 text-black dark:text-white rounded-[10px]">
      {/* Shared Header Section */}
      <div className="flex items-center justify-between gap-1 mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Devices</h2>
          <p className="text-sm text-gray-600 dark:text-[#FFFFFFA3]">
            Manage, edit, or view all your created profiles in one place.
          </p>
        </div>
        {!isAddingDevice && (
          <Button
            className="bg-black! hover:bg-black/80! text-white! rounded-2xl text-sm! h-10!"
            onClick={handleAddDevice}
          >
            + Add Devices
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="max-w-2xs w-full">
          <TabsList className="flex w-full rounded-full bg-gray-100 dark:bg-[#3F3F3F]">
            <TabsTrigger
              value="facile"
              onClick={() => setIsAddingDevice(false)}
              className="flex-1 rounded-full text-base! transition-all data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-gray-500! dark:text-white!"
            >
              facile
            </TabsTrigger>
            <TabsTrigger
              value="facile-teams"
              onClick={() => setIsAddingDevice(false)}
              className="flex-1 rounded-full text-base! transition-all data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-gray-500! dark:text-white! border-none!"
            >
              facile Teams
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : isAddingDevice ? (
        <ActivateDevice
          activationCode={activationCode}
          activationStatus={activationStatus}
        />
      ) : devices.length === 0 ? (
        <NotConnected />
      ) : (
        <ConnectedDevices
          devices={devices}
          onRefresh={() => fetchDevices(activeTab)}
        />
      )}
    </div>
  );
}
