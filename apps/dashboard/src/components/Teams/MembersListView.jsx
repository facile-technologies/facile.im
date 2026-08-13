import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Trash2,
  X,
  ChevronDown,
  MonitorIcon,
  EditIcon,
  LayoutTemplate,
  Contact,
  ChartLine,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MembersListView({
  members,
  selectedRows,
  toggleRow,
  setEditMemberProfile,
}) {
  const [selected, setSelected] = React.useState(null);
  const navigate = useNavigate();

  return (
    <div className=" text-white">
      <Table className={"border-separate! border-spacing-y-0!"}>
        <TableHeader>
          <TableRow className="pb-4! border-0! ">
            <TableHead></TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Leads</TableHead>
            <TableHead>Added</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <React.Fragment key={m.id}>
              <TableRow
                className={`bg-[#3A3A3A]! border-none hover:bg-zinc-700/50!  h-[72px]! w-full! rounded-t-2xl!  ${selected === m.id ? "rounded-b-0!" : "rounded-b-2xl!"}`}
              >
                <TableCell
                  className={`w-15! rounded-tl-2xl!  ${selected === m.id ? "rounded-bl-0!" : "rounded-bl-2xl!"}  `}
                >
                  <div className="flex justify-center">
                    <Checkbox
                      checked={selectedRows.includes(m.id)}
                      onCheckedChange={() => toggleRow(m.id)}
                      className={
                        "bg-transparent! text-[#A4A4A4]! border-2! border-[#A4A4A4]! "
                      }
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-4 ">
                    {m.profileImage ? (
                      <img
                        src={m.profileImage}
                        className="h-13 w-13 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-13 w-13 rounded-full bg-zinc-600 flex items-center justify-center object-cover"></div>
                    )}
                    <span className="font-bold">{m.name}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    className={`h-[21px]! text-xs! flex items-center
                    ${
                      String(m.status).toLowerCase() === "accepted"
                        ? "bg-[#28813382]! text-[#94FFA2]!"
                        : "bg-[#7C480070]! text-[#FFB34A]!"
                    } 
                    `}
                  >
                    {m.status}
                  </Badge>
                </TableCell>

                <TableCell className={"text-sm!"}>{m.email}</TableCell>
                <TableCell className={"text-sm!"}>
                  {m.total_views || 0}
                </TableCell>
                <TableCell className={"text-sm!"}>
                  {m.total_clicks || 0}
                </TableCell>
                <TableCell className={"text-sm!"}>{m.date || "-"}</TableCell>

                <TableCell
                  className={`rounded-tr-2xl! ${selected === m.id ? "rounded-br-0!" : "rounded-br-2xl!"} `}
                >
                  <div className="flex justify-center items-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setSelected(selected !== m.id ? m.id : null)
                      }
                      className={" w-fit! h-fit! bg-transparent!"}
                    >
                      <ChevronDown
                        className={` cursor-pointer text-[#A4A4A4]! w-5! h-5! ${
                          selected === m.id ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {selected === m.id && (
                <TableRow className={""}>
                  <TableCell className=" p-0! " colSpan={8}>
                    <div className="rounded-b-2xl! flex flex-wrap items-center justify-between gap-4  bg-black py-4 px-6  w-full!">
                      <div
                        onClick={() => navigate("/devices")}
                        className="flex items-center gap-2 cursor-pointer "
                      >
                        <MonitorIcon size={20} /> Devices
                      </div>
                      <div
                        // onClick={() => setEditMemberProfile(true)}
                        className="flex items-center gap-2 cursor-pointer  "
                      >
                        <EditIcon size={20} /> Edit Profile
                      </div>
                      <div
                        onClick={() => navigate("/teams/templates")}
                        className="flex items-center gap-2 cursor-pointer "
                      >
                        <LayoutTemplate size={20} /> Assign Template
                      </div>
                      <div
                        onClick={() => navigate("/contacts")}
                        className="flex items-center gap-2 cursor-pointer "
                      >
                        <Contact size={20} /> Contacts
                      </div>

                      <div className="flex items-center gap-2 cursor-pointer ">
                        <ChartLine size={20} /> Analytics
                      </div>

                      <div className="flex items-center gap-2 cursor-pointer ">
                        <Trash2 size={20} /> Delete Member
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelected(null)}
                        className={
                          "bg-transparent! rounded-full! border border-white"
                        }
                      >
                        <X className="text-white!" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={8} className="h-4! p-0!" />
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
