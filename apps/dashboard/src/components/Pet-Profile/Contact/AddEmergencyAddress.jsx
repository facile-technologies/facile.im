import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPETProfile,
  saveAddressContact,
  setContactInfoField,
  setEmmergencyAddress,
  updateConatcbyID,
} from "@/app/stores/slices/petprofileSlice";
import { X } from "lucide-react";
import { showToast } from "@/store/utils/toast";
import { selectPetLoading } from "@/app/stores/selectors/petProfileSelector";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Loader from "@/store/utils/Loader";

export default function AddEmergergencyAddress({
  onClose,
  onSave,
  contactInfo,
}) {
  const dispatch = useDispatch();
  const loading = useSelector(selectPetLoading);
  const emmergencyAddressDetail = useSelector(
    (state) => state.sosprofile.emmergencyAddress
  );
  const [contactData, setContactData] = useState({
    addressDescription: "",
    streetNumber: "",
    houseNumber: "",
    zipcode: "",
    country: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData({
      ...contactData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (contactInfo) {
      setContactData({
        addressDescription: contactInfo.address_description || "",
        streetNumber: contactInfo.street_numbe || "",
        houseNumber: contactInfo.house_number || "",
        zipcode: contactInfo.zipcode || "",
        country: contactInfo.country || "",
        state: contactInfo.state || "",
      });
    }
  }, [contactInfo]);

  const handleSave = () => {
    const formData = {
      address_description: contactData.addressDescription,
      street_numbe: contactData.streetNumber,
      house_number: contactData.houseNumber,
      zipcode: contactData.zipcode,
      country: contactData.country,
      state: contactData.state,
    };
    if (contactInfo && contactInfo.id) {
      dispatch(
        updateConatcbyID({
          type: "address",
          id: contactInfo.id,
          data: formData,
        })
      )
        .then(() => {
          showToast("success", "Emergency contact updated successfully!");
          dispatch(fetchPETProfile());
        })
        .catch((err) => {
          showToast("error", "Failed to update Emergency contact!");
        });
    } else {
      dispatch(saveAddressContact(formData))
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
          className="max-w-[640px]! w-full! rounded-2xl shadow-xl p-8  border-0 transition-colors bg-[#F5F5F5] dark:bg-[#262626] border-[#333]"
        >
          <a
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </a>
          <div className="flex flex-col gap-0 mb-5">
            <h2 className="text-black dark:text-white text-lg font-semibold ">
              Add Address
            </h2>
            <p className="text-[12px]  opacity-50">
              Provide the address of the person who should be notified when
              you’re in trouble.
            </p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <label className="absolute -top-2 left-5 px-1 text-[12px] text-gray-400  transition bg-[#F5F5F5] dark:bg-[#262626]">
                Address Description
              </label>
              <input
                type="text"
                name="addressDescription"
                value={contactData.addressDescription || ""}
                onChange={handleChange}
                className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
              />
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-5 px-1 text-gray-400 text-[12px] transition bg-[#F5F5F5] dark:bg-[#262626]">
                Street Number
              </label>
              <input
                type="text"
                name="streetNumber"
                value={contactData.streetNumber || ""}
                onChange={handleChange}
                className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <label className="absolute -top-2 left-5 px-1 text-gray-400 text-[12px] transition bg-[#F5F5F5] dark:bg-[#262626]">
                  House Number
                </label>
                <input
                  type="text"
                  name="houseNumber"
                  value={contactData.houseNumber || ""}
                  onChange={handleChange}
                  className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
                />
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-5 px-1 text-gray-400 text-[12px] transition bg-[#F5F5F5] dark:bg-[#262626]">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={contactData.zipCode || ""}
                  onChange={handleChange}
                  className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <label className="absolute -top-2 left-5 px-1 text-gray-400 text-[12px] transition bg-[#F5F5F5] dark:bg-[#262626]">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={contactData.city || ""}
                  onChange={handleChange}
                  className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
                />
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-5 px-1 text-gray-400 text-[12px] transition bg-[#F5F5F5] dark:bg-[#262626]">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={contactData.country || ""}
                  onChange={handleChange}
                  className="w-full rounded-full border border-[#5A5A5A] dark:border-[#555] bg-transparent text-black dark:text-white px-5 py-3 text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:border-white transition"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
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
              Add Address
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
