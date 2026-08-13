import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveMedicalDetails,
  updateMediaclinfobyID,
  fetchSOSProfile,
} from "@/app/stores/slices/Sosprofile/thunk";
import { X } from "lucide-react";
import { showToast } from "@/store/utils/toast";
import {
  setMedicalInfoField,
  setMedicaDatalInfo,
} from "@/app/stores/slices/sosprofileSlice";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function AddMedicalInfo({ onClose, onSave, medicalInfodata }) {
  const dispatch = useDispatch();
  const mediaclInfo = useSelector((state) => state.sosprofile.medicalInfo);
  const [medaicalData, setMedicaldata] = useState(mediaclInfo);
  useEffect(() => {
    if (medicalInfodata) {
      setMedicaldata({
        disease_name: medicalInfodata.disease_name,
        disease_detail: medicalInfodata.disease_detail,
      });
    }
  }, [medicalInfodata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicaldata({
      ...medaicalData,
      [name]: value,
    });
    dispatch(setMedicaDatalInfo({ name, value }));
  };
  const handleSave = () => {
    const formData = {
      disease_name: medaicalData.disease_name,
      disease_detail: medaicalData.disease_detail,
    };
    if (medicalInfodata && medicalInfodata.id) {
      dispatch(
        updateMediaclinfobyID({
          id: medicalInfodata.id,
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
      dispatch(saveMedicalDetails(formData))
        .then(() => {
          showToast("success", "Emergency contact added successfully!");
          dispatch(fetchSOSProfile());
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
      <DialogContent
        showCloseButton={false}
        className="max-w-[640px]! w-full! rounded-2xl shadow-xl p-8  border transition-colors bg-[#F5F5F5] dark:bg-[#262626] border-[#333]"
      >
        <a
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </a>

        <h2 className="text-black dark:text-white text-lg font-semibold mb-8">
          {medicalInfodata && medicalInfodata.id ? "Edit Medical Information" : "Add Medical Information"}
        </h2>

        <div className="space-y-10">
          <div className="relative">
            <label className="absolute -top-2 left-5 px-1 text-[12px] text-gray-400  transition bg-[#F5F5F5] dark:bg-[#262626]">
              Disease Name
            </label>
            <input
              type="text"
              name="disease_name"
              value={medaicalData.disease_name || ""}
              onChange={handleChange}
              className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
            />
          </div>
          <div className="relative">
            <label className="absolute -top-2 left-5 px-1 text-gray-400 text-[12px] transition bg-[#F5F5F5] dark:bg-[#262626]">
              Disease Detail
            </label>
            <input
              type="text"
              name="disease_detail"
              value={medaicalData.disease_detail || ""}
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
            {medicalInfodata && medicalInfodata.id ? "Update" : "Add Disease"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
