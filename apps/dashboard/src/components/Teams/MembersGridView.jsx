import { useState } from "react";
import { Controller } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import defaultUserImage from "@/assets/pngs/default-user-3.jpg";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  LayoutGrid,
  List,
  Search,
  Eye,
  Users,
  Trash2,
  X,
  ChevronDown,
  MonitorIcon,
  EditIcon,
  Contact,
  ChartLine,
  LayoutTemplate,
  CircleOff,
  MousePointer2,
} from "lucide-react";
import MembersListView from "./MembersListView";
import { useNavigate } from "react-router-dom";

export default function MembersGridView({
  members,
  control,
  setEditMemberProfile,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  // const [membersState, setMembersState] = useState(members);
  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
        {members.map((member) => (
          <div key={member.id} className="max-w-[380px]! w-full!">
            <Card
              className={`relative bg-[#3A3A3A] border-neutral-700 rounded-t-2xl! overflow-hidden p-4! max-w-[380px]! w-full! gap-0! 
                    ${openMenu === member.id ? "rounded-b-none!" : "rounded-b-2xl!"}
                    `}
            >
              <div className="z-10">
                {/* BANNER */}
                <div
                  className="relative h-38 bg-cover rounded-2xl -z-10"
                  style={{ backgroundImage: `url(${member.banner})` }}
                >
                  <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-2xl bg-white text-[#344054] font-semibold">
                    {member.status}
                  </span>

                  <label className="absolute top-3 right-3 flex items-center gap-1 text-xs ">
                    <Controller
                      name={`member_${member.id}`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={
                            "border-2! border-white! bg-transparent! text-white!"
                          }
                        />
                      )}
                    />
                    Select
                  </label>
                </div>
                <div className="relative w-fit mx-auto">
                  {/* user image */}
                  {/* {member.image ? ( */}
                    <img
                      src={member.image || defaultUserImage}
                      className="w-24 h-24 rounded-full border-2 border-black object-cover -mt-13 z-50"
                    />
                    {/* ) : (
                      <div className="w-24 h-24 rounded-full border-2 border-black bg-zinc-600 -mt-13 z-50" />
                    )} */}
                </div>
              </div>

              {/* CONTENT */}
              <div className="relative mb-4 text-center">
                <div>
                  <h3 className="text-2xl font-bold  text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-white mt-1">{member.email}</p>

                  <div className="flex justify-center gap-4 text-xs text-neutral-400 mt-2">
                    <span className="flex items-center gap-1 text-white">
                      <Eye size={16} /> {member.total_views || 0}
                    </span>
                    <span className="flex items-center gap-1 text-white">
                      <MousePointer2 size={16} /> {member.total_clicks || 0}
                    </span>
                  </div>
                </div>

                <ChevronDown
                  onClick={() =>
                    setOpenMenu(openMenu === member.id ? null : member.id)
                  }
                  className={`absolute bottom-0 right-0 cursor-pointer text-[#A4A4A4] ${
                    openMenu === member.id ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </Card>
            {/* BOTTOM MENU (EXACT LIKE IMAGE) */}
            {openMenu === member.id && (
              <div className=" relative  bg-black rounded-b-2xl p-4 text-sm max-w-[380px]! w-full!">
                <div className="space-y-3">
                  <div className="flex flex-wrap justify-between gap-4 ">
                    <div
                      onClick={() => navigate("/devices")}
                      className="flex items-center gap-2 cursor-pointer "
                    >
                      <MonitorIcon size={14} /> Devices 
                    </div>
                    <div
                      // onClick={() => setEditMemberProfile(true)}
                      className="flex items-center gap-2 cursor-pointer "
                    >
                      <EditIcon size={14} /> Edit Profile
                    </div>
                    <div
                      onClick={() => navigate("/teams/templates")}
                      className="flex items-center gap-2 cursor-pointer "
                    >
                      <LayoutTemplate size={14} /> Assign Template
                    </div>
                    <div
                      onClick={() => navigate("/contacts")}
                      className="flex items-center gap-2 cursor-pointer "
                    >
                      <Contact size={14} /> Contacts
                    </div>

                    <div
                      onClick={() => navigate("/analytics")}
                      className="flex items-center gap-2 cursor-pointer "
                    >
                      <ChartLine size={14} /> Analytics
                    </div>

                    <div className="flex items-center gap-2 cursor-pointer ">
                      <Trash2 size={14} /> Delete Member
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setOpenMenu(null)}
                  className="mt-2 ml-auto w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
