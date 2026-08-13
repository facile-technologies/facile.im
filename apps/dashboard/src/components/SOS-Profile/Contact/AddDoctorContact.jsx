import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { showToast } from "@/store/utils/toast";
import { selectSOSLoading } from "@/app/stores/selectors/sosProfileSelector";
import Loader from "@/store/utils/Loader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogPortal,
} from "@/components/ui/dialog";
import {
  saveDoctorContact,
  fetchSOSProfile,
  updateConatcbyID,
} from "@/app/stores/slices/Sosprofile/thunk";
export default function AddDoctorContact({
  open,
  onClose,
  onSave,
  contactInfo,
}) {
  const dispatch = useDispatch();
  const loading = useSelector(selectSOSLoading);
  const [contactData, setContactData] = useState({
    doctorContactName: "",
    phoneNumber: "",
    whatsAppNumber: "",
  });

  useEffect(() => {
    if (contactInfo) {
      setContactData({
        doctorContactName: contactInfo.doctor_name || "",
        phoneNumber: contactInfo.phone_number || "",
        whatsAppNumber: contactInfo.whatsapp_number || "",
      });
    }
  }, [contactInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData({
      ...contactData,
      [name]: value,
    });
  };

  const handleSave = () => {
    const formData = {
      doctor_name: contactData.doctorContactName,
      phone_number: contactData.phoneNumber,
      whatsapp_number: contactData.whatsAppNumber,
    };
    if (contactInfo && contactInfo.id) {
      // If contactInfo contains an id, it's an edit, so call the update API
      dispatch(
        updateConatcbyID({
          type: "doctor", // Always use "emergency" for emergency contacts
          id: contactInfo.id, // Pass the correct ID to update
          data: formData,
        })
      )
        .then(() => {
          showToast("success", "Emergency contact updated successfully!");
          dispatch(fetchSOSProfile());
        })
        .catch((err) => {
          showToast("error", "Failed to update Emergency contact!");
        });
    } else {
      // Otherwise, it's a new contact, so call the add API
      dispatch(saveDoctorContact(formData))
        .then(() => {
          showToast("success", "Emergency contact added successfully!");
        })
        .catch((err) => {
          showToast("error", "Failed to add Emergency contact!");
        });
    }
    onSave();
    onClose();
  };

  return (
    <>
      {loading && <Loader />}
      <Dialog open onOpenChange={onClose}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[640px]! w-full! rounded-2xl shadow-xl p-8  border-0 transition-colors bg-[#F5F5F5] dark:bg-[#262626] border-[#333] "
        >
          <a
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </a>
          <DialogHeader className="flex flex-col gap-0 mb-8">
            <h2 className="text-black dark:text-white text-lg font-semibold ">
              {contactInfo && contactInfo.id
                ? "Edit Doctor Contact"
                : "Add Doctor Contact"}
            </h2>
            <p className="text-[12px] opacity-50">
              Provide details of someone who should be notified when you’re in
              trouble.
            </p>
          </DialogHeader>
          <div className="space-y-10">
            <div className="relative">
              <label className="absolute -top-2 left-5 px-1 text-[12px] text-gray-400 transition bg-[#F5F5F5] dark:bg-[#262626]">
                Doctor Name
              </label>
              <input
                type="text"
                name="doctorContactName"
                value={contactData.doctorContactName || ""}
                onChange={handleChange}
                className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
              />
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-5 px-1 text-gray-400 text-[12px] transition bg-[#F5F5F5] dark:bg-[#262626]">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={contactData.phoneNumber || ""}
                onChange={handleChange}
                className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
              />
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-5 px-1 text-gray-400 text-[12px] transition bg-[#F5F5F5] dark:bg-[#262626]">
                WhatsApp Number
              </label>
              <input
                type="text"
                name="whatsAppNumber"
                value={contactData.whatsAppNumber || ""}
                onChange={handleChange}
                className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-10">
            <DialogClose className=" px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition">
              Cancel
            </DialogClose>
            <button
              onClick={handleSave}
              className="ecommerceBtn px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              {contactInfo && contactInfo.id
                ? "Update"
                : "Add Doctor"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
