import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Pencil, Trash } from "lucide-react";
import {
  deleteMedicalInfo,
  fetchSOSProfile,
  saveInsuranceDetails,
  saveSosMedicalSequenceVisibility,
} from "@/app/stores/slices/Sosprofile/thunk";
import AddMedicalInfo from "./AddMedicalInfo"; // Ensure this is the correct path
import MedicalCustomization from "./MedicalCustomization";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { selectSOSLoading } from "@/app/stores/selectors/sosProfileSelector";
import Loader from "@/store/utils/Loader";
import {
  setinsuranceCompanyName,
  setInsurnaceID,
  setVisibilityByType,
} from "@/app/stores/slices/sosprofileSlice";

export default function MedicalInformation() {
  const dispatch = useDispatch();
  const [isDoctorPopupOpen, setIsDoctorPopupOpen] = useState(false);
  const [editMedicalInfo, setEditMedicalInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medicalToDelete, setMedicalInfoToDelete] = useState(null);
  const loading = useSelector(selectSOSLoading);

  const mediaclInfo = useSelector((state) => state.sosprofile.medicalInfo);
  const insurancesCompanyName = useSelector(
    (state) => state.sosprofile.insurnacCompanyName
  );
  const insurancesID = useSelector((state) => state.sosprofile.insuranceID);
  const visibilityByType = useSelector(
    (state) => state.sosprofile.visibilityByType
  );
  const [medicalList, setMedicalList] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    // Filter out invalid items (undefined or null)
    const validMedicalList = (mediaclInfo || []).filter(
      (item) => item && item.id
    );

    // Set medicalList with visibility overrides if available
    const updatedMedicalList = validMedicalList.map((m) => {
      const override = visibilityByType?.medical?.[m.id];
      return {
        ...m,
        is_visible: override ?? m?.is_visible ?? true,
      };
    });

    setMedicalList(updatedMedicalList);
  }, [mediaclInfo, visibilityByType]);

  const handleInsuranceChange = (e) => {
    const { name, value } = e.target;

    if (name === "insurnacCompanyName") {
      dispatch(setinsuranceCompanyName(value));
    }
    if (name === "insuranceID") {
      dispatch(setInsurnaceID(value));
    }
  };

  const handleSaveDoctorContact = () => {
    setIsDoctorPopupOpen(false);
  };

  const handleEditClick = (item) => {
    setEditMedicalInfo(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setMedicalInfoToDelete({ id });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (medicalToDelete && medicalToDelete.id) {
      dispatch(deleteMedicalInfo(medicalToDelete.id));
    }
    dispatch(fetchSOSProfile());
    setIsDeleteModalOpen(false);
  };

  const handleSaveInsurance = () => {
    dispatch(
      saveInsuranceDetails({
        insurance_company: insurancesCompanyName,
        insurance_id: insurancesID,
      })
    );
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const current = [...medicalList];
    const draggedItem = current.splice(draggedIndex, 1)[0];
    current.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setMedicalList(current);
  };

  const handleDragEnd = () => {
    const payloadDetails = medicalList.map((m, idx) => ({
      id: m.id,
      sequence: idx + 1,
      is_visible: m?.is_visible ?? true,
    }));

    dispatch(saveSosMedicalSequenceVisibility({ details: payloadDetails }));

    setDraggedIndex(null);
  };

  const handleToggleMedicalVisibility = (item) => {
    const nextVisible = !(item.is_visible ?? true);

    const updated = medicalList.map((m) =>
      m.id === item.id ? { ...m, is_visible: nextVisible } : m
    );

    setMedicalList(updated);

    // ✅ keep redux override
    dispatch(
      setVisibilityByType({
        type: "medical",
        id: item.id,
        value: nextVisible,
      })
    );
    dispatch(
      saveSosMedicalSequenceVisibility({
        details: updated.map((m, idx) => ({
          id: m.id,
          sequence: idx + 1,
          is_visible: m?.is_visible ?? true,
        })),
      })
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full mx-auto">
      {isDoctorPopupOpen && (
        <AddMedicalInfo
          onClose={() => setIsDoctorPopupOpen(false)}
          onSave={handleSaveDoctorContact}
        />
      )}
      {isModalOpen && (
        <AddMedicalInfo
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveDoctorContact}
          medicalInfodata={editMedicalInfo}
        />
      )}
      {loading && <Loader />}
      {isDeleteModalOpen && (
        <ConfirmModal
          open={isDeleteModalOpen}
          title="Confirm Delete?"
          message="This action can't be undone."
          confirmText="Yes"
          cancelText="No"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
      <div className="flex flex-col gap-0 dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl px-3 py-2 border border-[#C0C0C017] w-full">
        <div className="flex flex-col items-start justify-between w-full ">
          <h2 className="dark:text-white text-black text-[16px] font-bold mb-0">
            Medical Details
          </h2>
          <div className="flex items-center justify-between w-full">
            <p className="dark:text-white text-black opacity-70 text-[12px] mb-0">
              Provide medical details
            </p>
            <a
              type="button"
              onClick={() => setIsDoctorPopupOpen(true)}
              className="bg-black text-white text-sm px-4 py-2 mb-3 rounded-3xl"
            >
              + Add Medical
            </a>
          </div>
        </div>
        {Array.isArray(medicalList) && medicalList.length > 0 && (
          <div className="space-y-2">
            {medicalList.map((item, index) => {
              if (item && item.disease_name && item.disease_detail) {
                return (
                  <div
                    key={item.id || index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      handleDragOver(index);
                    }}
                    onDragEnd={handleDragEnd}
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#F5F5F5] dark:bg-[#3F3F3F]"
                  >
                    {/* drag dots */}
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
                        {item.disease_name}
                      </p>
                      <div className="flex items-center gap-1 text-sm opacity-60 text-black dark:text-white">
                        <span>{item.disease_detail}</span>
                      </div>
                    </div>

                    {/* actions */}
                    <div className="flex items-center gap-4">
                      <button
                        className="actionBtn p-2 rounded-full"
                        type="button"
                        onClick={() => handleToggleMedicalVisibility(item)}
                      >
                        {item.is_visible ?? true ? (
                          <Eye size={18} className="text-white" />
                        ) : (
                          <EyeOff size={18} className="text-white" />
                        )}
                      </button>

                      <button
                        className="actionBtn p-2 rounded-full"
                        onClick={() => handleEditClick(item)}
                        type="button"
                      >
                        <Pencil size={18} className="text-white" />
                      </button>

                      <button
                        className="actionBtn p-2 rounded-full"
                        onClick={() => handleDeleteClick(item.id)}
                        type="button"
                      >
                        <Trash size={18} className="text-white" />
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 border border-[#C0C0C017] w-full">
        <h3 className="dark:text-white text-black text-[16px] font-semibold mb-4">
          Add Insurance Details
        </h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="relative">
            <label className="absolute -top-2 left-5 px-1 text-gray-400 text-[12px] transition bg-transparent dark:bg-transparent">
              Insurance Company
            </label>
            <input
              type="text"
              name="insurnacCompanyName"
              value={insurancesCompanyName}
              onChange={handleInsuranceChange}
              className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-[#3F3F3F] text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
            />
          </div>
          <div className="relative">
            <label className="absolute -top-2 left-5 px-1 text-gray-400 text-[12px] transition bg-transparent dark:bg-transparent">
              Insurance ID
            </label>
            <input
              type="text"
              name="insuranceID"
              value={insurancesID}
              onChange={handleInsuranceChange}
              className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-[#3F3F3F] text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSaveInsurance}
            className="ecommerceBtn px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            Update
          </button>
        </div>
      </div>

      {mediaclInfo && mediaclInfo.length > 0 && <MedicalCustomization />}
    </div>
  );
}
