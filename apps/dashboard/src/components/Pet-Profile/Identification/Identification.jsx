import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIdentificationField } from "@/app/stores/slices/petprofileSlice";
import IdentificationCustomization from "./IdentificationCustomization";

export default function Identification() {
  const dispatch = useDispatch();
  const identification = useSelector(
    (state) => state.petprofile.identification
  );

  const handleIdentificationChange = (e) => {
    const { name, value } = e.target;
    dispatch(setIdentificationField({ name, value }));
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-4 border border-[#C0C0C017] w-full">
        <h3 className="dark:text-white text-black text-[16px] font-semibold mb-4">
          Identification
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <h3 className="dark:text-white text-black text-[15px]">Chipped</h3>
            <div className="grid items-center gap-3">
              <select
                name="chipped"
                value={identification.chipped}
                onChange={(e) => handleIdentificationChange(e)}
                className="w-full dark:bg-[#2B2B2B] dark:text-white text-white px-4 py-3 rounded-2xl border  border-[#5B5B5B] outline-none"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <h3 className="dark:text-white text-black text-[15px]">Collar</h3>
            <div className="grid items-center gap-3">
              <input
                type="text"
                name="collar"
                value={identification.collar}
                onChange={handleIdentificationChange}
                className="w-full dark:bg-[#2B2B2B] dark:text-white text-white px-4 py-3 rounded-xl border border-[#5B5B5B] outline-none"
              />
            </div>
          </div>
        </div>
        <div className="relative mt-4">
          <h3 className="dark:text-white text-black text-[15px] mb-2">
            Special Feature
          </h3>
          <div className="grid items-center gap-3">
            <input
              type="text"
              name="specialFeature"
              value={identification.specialFeature}
              onChange={handleIdentificationChange}
              className="w-full dark:bg-[#2B2B2B] dark:text-white text-white px-4 py-3 rounded-xl border border-[#5B5B5B] outline-none"
            />
          </div>
        </div>
      </div>
      <IdentificationCustomization />
    </div>
  );
}
