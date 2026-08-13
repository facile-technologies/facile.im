import { useEffect, useState } from "react";
import { Switch } from "../../ui/switch";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  EyeOff,
  LocationEditIcon,
  Pencil,
  PhoneCall,
  Trash,
} from "lucide-react";
import AddEmergencyContact from "./AddEmergencyContact";
import AddDoctorContact from "./AddDoctorContact";
import AddEmergergencyAddress from "./AddEmergencyAddress";
import {
  deleteSosContact,
  fetchSOSProfile,
  saveSosSequenceVisibility,
} from "@/app/stores/slices/Sosprofile/thunk";
import ConfirmModal from "@/components/shared/ConfirmModal";
import Loader from "@/store/utils/Loader";
import { selectSOSLoading } from "@/app/stores/selectors/sosProfileSelector";
import { setVisibilityByType } from "@/app/stores/slices/sosprofileSlice";

export default function ContactDetail() {
  const dispatch = useDispatch();
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [isDoctorPopupOpen, setIsDoctorPopupOpen] = useState(false);
  const [isEmergencyAddress, setIsEmergencyAddress] = useState(false);
  const contactInfo = useSelector((state) => state.sosprofile.contactInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editContactInfo, setEditContactInfo] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isEmergencyEditModalOpen, setIsEmergencyEditModalOpen] =
    useState(false);
  const [isDoctorEditModalOpen, setIsDoctorEditModalOpen] = useState(false);
  const [isAddressEditModalOpen, setIsAddressEditModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const doctorContactInfo = useSelector(
    (state) => state.sosprofile.doctorContactInfo
  );
  const emmergencyAddressDetail = useSelector(
    (state) => state.sosprofile.emmergencyAddress
  );
  const visibilityByType = useSelector(
    (state) => state.sosprofile.visibilityByType
  );
  const [emergencyList, setEmergencyList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [addressList, setAddressList] = useState([]);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedType, setDraggedType] = useState(null);
  const loading = useSelector(selectSOSLoading);

  useEffect(() => {
    setEmergencyList(
      (contactInfo || []).map((c) => {
        const override = visibilityByType?.emergency?.[c.id];
        return {
          ...c,
          is_visible: override ?? c.is_visible ?? true,
        };
      })
    );
  }, [contactInfo, visibilityByType]);

  useEffect(() => {
    setDoctorList(
      (doctorContactInfo || []).map((c) => {
        const override = visibilityByType?.doctor?.[c.id];
        return {
          ...c,
          is_visible: override ?? c.is_visible ?? true,
        };
      })
    );
  }, [doctorContactInfo, visibilityByType]);

  useEffect(() => {
    setAddressList(
      (emmergencyAddressDetail || []).map((c) => {
        const override = visibilityByType?.address?.[c.id];
        return {
          ...c,
          is_visible: override ?? c.is_visible ?? true,
        };
      })
    );
  }, [emmergencyAddressDetail, visibilityByType]);

  const getList = (type) => {
    if (type === "emergency") return emergencyList;
    if (type === "doctor") return doctorList;
    return addressList;
  };

  const setList = (type, next) => {
    if (type === "emergency") return setEmergencyList(next);
    if (type === "doctor") return setDoctorList(next);
    return setAddressList(next);
  };
  const handleDragStart = (type, index) => {
    setDraggedType(type);
    setDraggedIndex(index);
  };
  const handleDragOver = (type, index) => {
    if (draggedIndex === null || draggedIndex === index || draggedType !== type)
      return;

    const current = [...getList(type)];
    const draggedItem = current.splice(draggedIndex, 1)[0];
    current.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setList(type, current);
  };
  const handleDragEnd = (type) => {
    const current = getList(type);

    dispatch(
      saveSosSequenceVisibility({
        type,
        contacts: current.map((c, idx) => ({
          id: c.id,
          sequence: idx + 1,
          is_visible: c.is_visible ?? true,
        })),
      })
    );

    setDraggedType(null);
    setDraggedIndex(null);
  };
  const handleToggleVisibility = (type, item) => {
    const current = getList(type);

    const nextVisible = !(item.is_visible ?? true);

    const updated = current.map((c) =>
      c.id === item.id ? { ...c, is_visible: nextVisible } : c
    );
    setList(type, updated);
    dispatch(
      setVisibilityByType({
        type,
        id: item.id,
        value: nextVisible,
      })
    );
    dispatch(
      saveSosSequenceVisibility({
        type,
        contacts: updated.map((c, idx) => ({
          id: c.id,
          sequence: idx + 1,
          is_visible: c.is_visible ?? true,
        })),
      })
    );
  };

  const handleSaveContact = () => {
    setShowAddProductPopup(false);
  };
  const handleSaveDoctorContact = () => {
    setIsDoctorPopupOpen(false);
  };
  const handleSaveEmergencyAddress = () => {
    setIsEmergencyAddress(false);
  };
  const handleDeleteClick = (type, id) => {
    setContactToDelete({ type, id });
    setIsModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (contactToDelete) {
      await dispatch(deleteSosContact(contactToDelete));
    }
    dispatch(fetchSOSProfile());
    setIsModalOpen(false);
  };
  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };
  const handleEditClick = (type, item) => {
    setEditContactInfo(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      {loading && <Loader />}
      <ConfirmModal
        open={isModalOpen}
        title="Confirm Delete?"
        message="This action can't be undone."
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      {isModalOpen && modalType === "emergency" && (
        <AddEmergencyContact
          onClose={() => setIsModalOpen(false)}
          onSave={() => setIsModalOpen(false)}
          contactInfo={editContactInfo}
        />
      )}

      {isModalOpen && modalType === "doctor" && (
        <AddDoctorContact
          open={isModalOpen && modalType === "doctor"}
          onClose={() => setIsModalOpen(false)}
          onSave={() => setIsModalOpen(false)}
          contactInfo={editContactInfo}
        />
      )}

      {isModalOpen && modalType === "address" && (
        <AddEmergergencyAddress
          onClose={() => setIsModalOpen(false)}
          onSave={() => setIsModalOpen(false)}
          contactInfo={editContactInfo}
        />
      )}

      <div className="flex flex-col gap-2 w-full mx-auto">
        {showAddProductPopup && (
          <AddEmergencyContact
            onClose={() => setShowAddProductPopup(false)}
            onSave={handleSaveContact}
          />
        )}
        {isDoctorPopupOpen && (
          <AddDoctorContact
            open={isDoctorPopupOpen}
            onClose={() => setIsDoctorPopupOpen(false)}
            onSave={handleSaveDoctorContact}
          />
        )}
        {isEmergencyAddress && (
          <AddEmergergencyAddress
            onClose={() => setIsEmergencyAddress(false)}
            onSave={handleSaveEmergencyAddress}
          />
        )}
        <div className="flex flex-col gap-0 dark:bg-[#303030]  bg-[#F5F5F5] rounded-2xl px-3 py-2  border border-[#C0C0C017] w-full">
          <div className="flex flex-col items-start justify-between w-full ">
            <h2 className="dark:text-white text-black text-[16px] font-bold mb-0">
              Emergency Contacts
            </h2>
            <div className="flex items-center justify-between w-full">
              <p className="dark:text-white text-black opacity-70 text-[12px] mb-0">
                Provide details of someone who should be notified when you’re in
                trouble.
              </p>
              <a
                type="button"
                onClick={() => setShowAddProductPopup(true)}
                className="bg-black text-white text-sm px-4 py-2 mb-3 rounded-3xl"
              >
                + Add Contact
              </a>
            </div>
          </div>
          {emergencyList && emergencyList.length > 0 && (
            <div className="space-y-2">
              {emergencyList.map((item, index) => (
                <div
                  key={item.id || index}
                  draggable
                  onDragStart={() => handleDragStart("emergency", index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver("emergency", index);
                  }}
                  onDragEnd={() => handleDragEnd("emergency")}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#F5F5F5] dark:bg-[#3F3F3F]"
                >
                  
                  <div className="flex flex-col justify-center items-center mr-4 cursor-grab">
                    <div className="grid grid-cols-2 gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </div>
                  </div>

                  {/* content */}
                  <div className="flex flex-col gap-0 flex-1">
                    <p className="font-medium text-black dark:text-white">
                      {item.contact_name || "No Name"}
                    </p>
                    <div className="flex items-center gap-1 text-sm opacity-60 text-black dark:text-white">
                      <PhoneCall size={16} />
                      <span>{item.whatsapp_number || "No WhatsApp"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm opacity-60 text-black dark:text-white">
                      <PhoneCall size={16} />
                      <span>{item.phone_number || "No Phone"}</span>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="flex items-center gap-4">
                    <button
                      className="actionBtn p-2 rounded-full"
                      type="button"
                      onClick={() => handleToggleVisibility("emergency", item)}
                    >
                      {item.is_visible === true ? (
                        <Eye size={18} className="text-white" />
                      ) : (
                        <EyeOff size={18} className="text-white" />
                      )}
                    </button>

                    <button
                      className="actionBtn p-2 rounded-full"
                      onClick={() => handleEditClick("emergency", item)}
                      type="button"
                    >
                      <Pencil size={18} className="text-white" />
                    </button>

                    <button
                      className="actionBtn p-2 rounded-full"
                      onClick={() => handleDeleteClick("emergency", item.id)}
                      type="button"
                    >
                      <Trash size={18} className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div></div>
        <div className="flex flex-col gap-2 dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl px-3 py-2 border border-[#C0C0C017] w-full">
          <div className="flex flex-col items-start justify-between w-full">
            <h2 className="dark:text-white text-black text-[16px] font-bold mb-0">
              Doctors
            </h2>
            <div className="flex items-center justify-between w-full">
              <p className="dark:text-white text-black opacity-70 text-[12px] mb-0">
                Provide details of someone who should be notified when you’re in
                trouble.
              </p>
              <a
                type="button"
                onClick={() => setIsDoctorPopupOpen(true)}
                className="bg-black text-white text-sm px-4 py-2 mb-3 rounded-3xl"
              >
                + Add Doctor
              </a>
            </div>
          </div>
          {doctorList && doctorList.length > 0 && (
            <div className="space-y-2">
              {doctorList.map((item, index) => (
                <div
                  key={item.id || index}
                  draggable
                  onDragStart={() => handleDragStart("doctor", index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver("doctor", index);
                  }}
                  onDragEnd={() => handleDragEnd("doctor")}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#F5F5F5] dark:bg-[#3F3F3F]"
                >
                  <div className="flex flex-col justify-center items-center mr-4 cursor-grab">
                    <div className="grid grid-cols-2 gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0 flex-1">
                    <p className="font-medium text-black dark:text-white">
                      {item.doctor_name || "No Name"}
                    </p>
                    <div className="flex items-center gap-1 text-sm opacity-60 text-black dark:text-white">
                      <PhoneCall size={16} />
                      <span>{item.whatsapp_number || "No WhatsApp"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm opacity-60 text-black dark:text-white">
                      <PhoneCall size={16} />
                      <span>{item.phone_number || "No Phone"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      className="actionBtn p-2 rounded-full"
                      onClick={() => handleToggleVisibility("doctor", item)}
                      type="button"
                    >
                      {item.is_visible ?? true ? (
                        <Eye size={18} className="text-white" />
                      ) : (
                        <EyeOff size={18} className="text-white" />
                      )}
                    </button>

                    <button
                      className="actionBtn p-2 rounded-full"
                      onClick={() => handleEditClick("doctor", item)}
                      type="button"
                    >
                      <Pencil size={18} className="text-white" />
                    </button>

                    <button
                      className="actionBtn p-2 rounded-full"
                      onClick={() => handleDeleteClick("doctor", item.id)}
                      type="button"
                    >
                      <Trash size={18} className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl px-3 py-2 border border-[#C0C0C017] w-full">
          <div className="flex flex-col items-start justify-between w-full">
            <h2 className="dark:text-white text-black text-[16px] font-bold mb-0">
              Address
            </h2>
            <div className="flex items-center justify-between w-full">
              <p className="dark:text-white text-black opacity-70 text-[12px] mb-0">
                Provide the address of the person who should be notified when
                you’re in trouble.
              </p>
              <a
                type="button"
                onClick={() => setIsEmergencyAddress(true)}
                className="bg-black text-white text-sm px-4 py-2 mb-3 rounded-3xl"
              >
                + Add Address
              </a>
            </div>
          </div>
          {addressList && addressList.length > 0 && (
            <div className="space-y-2">
              {addressList.map((item, index) => (
                <div
                  key={item.id || index}
                  draggable
                  onDragStart={() => handleDragStart("address", index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver("address", index);
                  }}
                  onDragEnd={() => handleDragEnd("address")}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#F5F5F5] dark:bg-[#3F3F3F]"
                >
                  <div className="flex flex-col justify-center items-center mr-4 cursor-grab">
                    <div className="grid grid-cols-2 gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0 flex-1">
                    <p className="font-medium text-black dark:text-white">
                      {item?.address_description || "No Address Description"}
                    </p>
                    <div className="flex items-center gap-1 text-sm opacity-60 text-black dark:text-white">
                      <LocationEditIcon size={16} />
                      <span>{item?.house_number || "No House Number"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      className="actionBtn p-2 rounded-full"
                      onClick={() => handleToggleVisibility("address", item)}
                      type="button"
                    >
                      {item.is_visible ?? true ? (
                        <Eye size={18} className="text-white" />
                      ) : (
                        <EyeOff size={18} className="text-white" />
                      )}
                    </button>

                    <button
                      className="actionBtn p-2 rounded-full"
                      onClick={() => handleEditClick("address", item)}
                      type="button"
                    >
                      <Pencil size={18} className="text-white" />
                    </button>

                    <button
                      className="actionBtn p-2 rounded-full"
                      onClick={() => handleDeleteClick("address", item.id)}
                      type="button"
                    >
                      <Trash size={18} className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
