"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import defaultUserImage from "@/assets/pngs/default-user-3.jpg";
import Footer from "@/components/shared/Footer";
import {
  assignTemplate,
  getMemberForAssignee,
  unAssignTemplate,
} from "@/services/teams";
import Loader from "@/store/utils/Loader";
import { showToast } from "@/store/utils/toast";

export default function Assignee() {
  const [assigned, setAssigned] = useState();
  const [unassigned, setUnassigned] = useState();
  const [loading, setLoading] = useState(false);

  const { control, watch, reset, setValue } = useForm();

  const values = watch();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);

        const res = await getMemberForAssignee();

        const assignedApi = res?.data?.data?.assignedMembers || [];
        const unassignedApi = res?.data?.data?.unassignedMembers || [];

        const mapUser = (user) => ({
          id: user.id,
          name: user.full_name,
          email: user.email,
          profileImage: `http://72.61.77.17/api/v1/${user.userProfile?.profile_image}`,
        });

        setAssigned(assignedApi.map(mapUser));
        setUnassigned(unassignedApi.map(mapUser));
      } catch (err) {
        console.error(err);
        showToast(
          "error",
          err?.response?.data?.message || "Failed to fetch team members",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  /* ---------------- Move Logic ---------------- */

  const moveLeft = async () => {
    const selected = unassigned.filter((u) => values?.[`un_${u.id}`]);

    try {
      setLoading(true);

      // 🔥 call API one by one
      await Promise.all(selected.map((user) => assignTemplate(user.id)));

      // update UI AFTER success
      setAssigned((prev) => [...prev, ...selected]);
      setUnassigned((prev) => prev.filter((u) => !values?.[`un_${u.id}`]));

      reset();
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        err?.response?.data?.message || "Failed to assign template",
      );
    } finally {
      setLoading(false);
    }
  };

  const moveRight = async () => {
    const selected = assigned.filter((a) => values?.[`as_${a.id}`]);

    try {
      setLoading(true);

      // 🔥 call API one by one
      await Promise.all(selected.map((user) => unAssignTemplate(user.id)));

      // update UI AFTER success
      setUnassigned((prev) => [...prev, ...selected]);
      setAssigned((prev) => prev.filter((a) => !values?.[`as_${a.id}`]));

      reset();
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        err?.response?.data?.message || "Failed to unassign template",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Counts ---------------- */

  const assignedSelected = assigned?.filter(
    (a) => values?.[`as_${a.id}`],
  ).length;

  const unassignedSelected = unassigned?.filter(
    (a) => values?.[`un_${a.id}`],
  ).length;

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="flex flex-col gap-6 bg-[#F5F5F5] dark:bg-[#3F3F3F] rounded-2xl p-4 md:p-6 transition-colors">
            <h3 className="text-lg font-semibold dark:text-white text-black">
              Assignees
            </h3>

            <div className="flex gap-6">
              {/* -------- Assigned -------- */}
              <ListBox
                title="Assigned to Template"
                items={assigned}
                prefix="as"
                selectedCount={assignedSelected}
                control={control}
                setValue={setValue}
              />

              {/* -------- Arrows -------- */}
              <div className="flex flex-col justify-center gap-4">
                <ArrowLeft
                  onClick={moveLeft}
                  className="text-[#FFFFFF7A]! cursor-pointer"
                />

                <ArrowRight
                  onClick={moveRight}
                  className="text-[#FFFFFF7A]! cursor-pointer"
                />
              </div>

              {/* -------- Unassigned -------- */}
              <ListBox
                title="Not Assigned to Template"
                items={unassigned}
                prefix="un"
                selectedCount={unassignedSelected}
                control={control}
                setValue={setValue}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================= */

function ListBox({ title, items, prefix, control, selectedCount, setValue }) {
  return (
    <div className="w-[320px] rounded-2xl border border-[#C0C0C017] p-5 h-fit">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-[#FFFFFF99] mb-4">
        {selectedCount}/{items?.length} selected
      </p>

      <div className="space-y-3 overflow-y-scroll max-h-[217px]">
        {items?.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 rounded-xl bg-[#3A3A3A] p-3"
          >
            <Controller
              control={control}
              name={`${prefix}_${user.id}`}
              render={({ field }) => (
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      items.forEach((item) => {
                        setValue(`${prefix}_${item.id}`, false);
                      });

                      setValue(`${prefix}_${user.id}`, true);
                    } else {
                      setValue(`${prefix}_${user.id}`, false);
                    }
                  }}
                  className="bg-transparent! border-2! border-[#A4A4A4]! text-[#A4A4A4]!"
                />
              )}
            />

            <img
              src={ defaultUserImage || user.profileImage }
              className="w-10 h-10 rounded-full object-cover"
            />
            {console.log(user.profile_image, "profile image")}

            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-[#A4A4A4]">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
