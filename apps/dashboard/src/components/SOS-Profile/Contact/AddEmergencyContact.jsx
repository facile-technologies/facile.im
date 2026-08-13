import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSOSProfile,
  saveEmergencyContact,
  updateConatcbyID,
} from "@/app/stores/slices/Sosprofile/thunk";
import { X } from "lucide-react";
import Loader from "@/store/utils/Loader";
import { selectSOSLoading } from "@/app/stores/selectors/sosProfileSelector";
import { showToast } from "@/store/utils/toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function AddEmergencyContact({ onClose, onSave, contactInfo }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectSOSLoading);

  // Initialize the state for form data
  const [contactData, setContactData] = useState({
    contact_name: "",
    phone_number: "",
    whatsapp_number: "",
  });
  useEffect(() => {
    if (contactInfo) {
      setContactData({
        contact_name: contactInfo.contact_name || "",
        phone_number: contactInfo.phone_number || "",
        whatsapp_number: contactInfo.whatsapp_number || "",
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
      contact_name: contactData.contact_name,
      phone_number: contactData.phone_number,
      whatsapp_number: contactData.whatsapp_number,
    };
    if (contactInfo && contactInfo.id) {
      dispatch(
        updateConatcbyID({
          type: "emergency",
          id: contactInfo.id,
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
      dispatch(saveEmergencyContact(formData))
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
    <Dialog open onOpenChange={onClose}>
      {loading && <Loader />}
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
        <div className="flex flex-col gap-0 mb-8">
          <h2 className="text-black dark:text-white text-lg font-semibold ">
            {contactInfo && contactInfo.id
              ? "Edit Emergency Contact"
              : "Add Emergency Contact"}
          </h2>
          <p className="text-[12px] opacity-50">
            Provide details of someone who should be notified when you’re in
            trouble.
          </p>
        </div>

        <div className="space-y-10">
          <div className="relative">
            <label className="absolute -top-2 left-5 px-1 text-[12px] text-gray-400 transition bg-[#F5F5F5] dark:bg-[#262626]">
              Contact Name
            </label>
            <input
              type="text"
              name="contact_name"
              value={contactData.contact_name}
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
              name="phone_number"
              value={contactData.phone_number}
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
              name="whatsapp_number"
              value={contactData.whatsapp_number}
              onChange={handleChange}
              className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-15">
          <button
            onClick={onClose}
            className=" px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="ecommerceBtn px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            {contactInfo && contactInfo.id ? "Update" : "Add Contact"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
