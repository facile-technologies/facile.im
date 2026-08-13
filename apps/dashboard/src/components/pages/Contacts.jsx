import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  ChevronDown,
  FileOutput,
  SlidersHorizontal,
  MoreVertical,
  Mail,
  BarChart,
  UserCog,
  Trash2,
  Smartphone,
  X,
  MonitorIcon,
  EditIcon,
  LayoutTemplate,
  Contact as ContactIcon,
  ChartLine,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "@/components/ui/badge";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { getDashboardData, getUserProfiles, getContacts } from "@/services/user";
import { getAllTeamMembers, getMemberProfiles } from "@/services/teams";
import { setDashboardData } from "@/app/stores/slices/dashboardSlice";

const ContactsPage = () => {
  const dispatch = useDispatch();
  const { data: dashboardData } = useSelector((state) => state.dashboard);

  const [activeTab, setActiveTab] = useState("facile");
  const [visibleColumns, setVisibleColumns] = useState({
    Email: true,
  });
  const [selectedContactId, setSelectedContactId] = useState("All");
  const [selectedProfileType, setSelectedProfileType] = useState("All Profiles");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userProfiles, setUserProfiles] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [contactsList, setContactsList] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);


  const profileTypes = ["All Profiles", "Personal", "Business", "Pet", "SOS"];

  const { watch, setValue } = useForm({
    defaultValues: {},
  });
  const values = watch();

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard data for contacts
      const dashRes = await getDashboardData();
      if (dashRes.data?.status === "success" || dashRes.data?.data) {
        dispatch(setDashboardData(dashRes.data.data || dashRes.data));
      }

      // Fetch user profiles for "facile" tab
      const profilesRes = await getUserProfiles();
      const profilesPayload = profilesRes.data;
      if (profilesPayload) {
        const rawProfiles = profilesPayload.data || profilesPayload.profiles || profilesPayload || [];
        setUserProfiles(Array.isArray(rawProfiles) ? rawProfiles : []);
      }

      // Fetch team members for "facile Teams" tab
      const teamRes = await getAllTeamMembers();
      const teamPayload = teamRes.data;
      if (teamPayload) {
        const rawMembers =
          teamPayload?.data?.members ||
          (Array.isArray(teamPayload?.data) ? teamPayload?.data : null) ||
          teamPayload?.data ||
          teamPayload?.members ||
          [];

        const normalizedMembers = Array.isArray(rawMembers)
          ? rawMembers.map((m, idx) => ({
            id: m.id || m.member_id || m._id || idx,
            name: m.full_name || m.name || `${m.first_name || ""} ${m.last_name || ""}`.trim() || "Unnamed Member"
          }))
          : [];

        setTeamMembers(normalizedMembers);
      }
    } catch (error) {
      console.error("Error fetching contacts related data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoadingContacts(true);
      try {
        const params = {
          context: activeTab,
          page,
          limit
        };

        if (activeTab === "facile") {
          if (selectedContactId !== "All") {
            params.profile_id = selectedContactId;
          }
          if (selectedProfileType !== "All Profiles") {
            params.profile_type = selectedProfileType;
          }
        } else if (activeTab === "facile-teams") {
          if (selectedContactId !== "All members") {
            params.member_id = selectedContactId;
          }
        }

        const res = await getContacts(params);
        // The expected response is: { status: "success", data: [...], totalPages: X }
        const contactsData = res.data?.data?.contacts || res.data?.data || res.data || [];
        setContactsList(Array.isArray(contactsData) ? contactsData : []);

        // Handle pagination response if available
        if (res.data?.totalPages) {
          setTotalPages(res.data.totalPages);
        } else if (res.data?.pagination?.totalPages) {
          setTotalPages(res.data.pagination.totalPages);
        } else {
          // Fallback if pagination is missing from response
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setContactsList([]);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    fetchContacts();
  }, [activeTab, selectedContactId, selectedProfileType, page]);

  // Derived data
  const contacts = dashboardData?.contacts || [];

  // Filter contacts based on active selection (fallback to API contacts directly, no local filtering needed since API does it)
  const filteredContacts = contactsList;

  const toggleSelectAll = (checked) => {
    filteredContacts.forEach((m) => {
      setValue(`contact_${m.id}`, checked, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });
    });
    setSelectedRows(checked ? filteredContacts.map((m) => m.id) : []);
  };

  const allSelected =
    filteredContacts.length > 0 && filteredContacts.every((m) => values?.[`contact_${m.id}`]);

  const someSelected =
    filteredContacts.some((m) => values?.[`contact_${m.id}`]) && !allSelected;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper to get dynamic columns from submitted_data
  const getDynamicColumns = () => {
    const keys = new Set();
    filteredContacts.forEach((c) => {
      const data = c.submitted_data || c.lead_data || {};
      Object.keys(data).forEach((key) => {
        if (key !== "Email" && key !== "email") { // email is standard
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  };

  const dynamicColumns = getDynamicColumns();

  const handleExportCSV = () => {
    const contactsToExport = selectedRows.length > 0
      ? filteredContacts.filter(c => selectedRows.includes(c.id))
      : filteredContacts;

    if (contactsToExport.length === 0) return;

    // Header Row
    const headers = ["Email", ...dynamicColumns];

    // Data Rows
    const rows = contactsToExport.map(c => {
      const leadData = c.submitted_data || c.lead_data || {};
      const email = c.email || leadData.Email || leadData.email || "-";

      const dynamicFields = dynamicColumns.map(col => {
        let val = leadData[col] || "-";
        // Escape quotes and wrap in quotes if contains comma
        if (typeof val === 'string') {
          val = val.replace(/"/g, '""');
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            val = `"${val}"`;
          }
        }
        return val;
      });

      const profileName = c.profile_name || c.addedBy || "Personal";
      const dateAdded = formatDate(c.created_at || c.dateAdded);

      return [
        email.includes(',') ? `"${email}"` : email,
        ...dynamicFields,
        profileName.includes(',') ? `"${profileName}"` : profileName,
        dateAdded.includes(',') ? `"${dateAdded}"` : dateAdded
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `contacts_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#262626] p-10 text-white rounded-[10px]">
      <div className="flex items-center justify-between gap-1 mb-5">
        <div>
          <h2 className="text-2xl font-semibold">Contacts</h2>
          <div className="flex items-center gap-2 mt-1 text-sm text-neutral-400">
            <Checkbox
              checked={allSelected}
              data-state={someSelected ? "indeterminate" : undefined}
              onCheckedChange={toggleSelectAll}
              className={
                "bg-transparent! border-2! border-[#A4A4A4]! text-[#A4A4A4]!"
              }
            />
            Select all
          </div>
        </div>
        <Button
          className="bg-black! hover:bg-black/80! text-white! rounded-2xl text-sm! h-10!"
          onClick={handleExportCSV}
          disabled={filteredContacts.length === 0}
        >
          <FileOutput /> Export CSV
        </Button>
      </div>

      <div className="flex items-center justify-between gap-1 ">
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            setSelectedContactId(val === "facile" ? "All" : "All members");
            setSelectedProfileType("All Profiles");
            setPage(1);
          }}
          className="max-w-2xs w-full "
        >
          <TabsList className=" flex w-full rounded-full bg-[#3F3F3F]! ">
            <TabsTrigger
              value="facile"
              className="flex-1 rounded-full text-base!  data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-[#FFFFFF85]! "
            >
              facile
            </TabsTrigger>
            <TabsTrigger
              value="facile-teams"
              className="flex-1 rounded-full text-base! data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent!  text-[#FFFFFF85]! border-none! "
            >
              facile Teams
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-x-3">
          <DropdownMenu>
            {/* Trigger Button */}
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full! bg-black! px-6! py-5! text-white! hover:bg-black/90!">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>

            {/* Dropdown */}
            <DropdownMenuContent
              align="center"
              className=" rounded-xl border-none bg-[#3F3F3F] p-2 text-white shadow-md"
            >
              <DropdownMenuCheckboxItem
                checked={visibleColumns["Email"] !== false}
                onCheckedChange={(value) =>
                  setVisibleColumns((prev) => ({ ...prev, Email: !!value }))
                }
                className="cursor-pointer"
              >
                Email
              </DropdownMenuCheckboxItem>

              {dynamicColumns.map((col) => (
                <React.Fragment key={col}>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns[col] !== false}
                    onCheckedChange={(value) =>
                      setVisibleColumns((prev) => ({ ...prev, [col]: !!value }))
                    }
                    className="cursor-pointer"
                  >
                    {col}
                  </DropdownMenuCheckboxItem>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dynamic Members/Profiles Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-lg bg-[#3F3F3F]! text-white! min-w-[142px]! w-auto! px-4! "
              asChild
            >
              <Button>
                {selectedContactId === "All" || selectedContactId === "All members"
                  ? (activeTab === "facile" ? "All Profiles" : "All members")
                  : (activeTab === "facile"
                    ? userProfiles.find(p => (p.profile_id || p.id) === selectedContactId)?.name
                    : teamMembers.find(m => m.id === selectedContactId)?.name) || "Select"
                }
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={"bg-[#3F3F3F]! text-white! min-w-[142px]! border-none! "}
            >
              <DropdownMenuItem
                className={`border-b border-[#b4abab2e] rounded-none cursor-pointer flex items-center justify-between ${(selectedContactId === "All" || selectedContactId === "All members") ? "font-semibold" : ""
                  }`}
                onSelect={() => {
                  setSelectedContactId(activeTab === "facile" ? "All" : "All members");
                  setPage(1);
                }}
              >
                <span>{activeTab === "facile" ? "All Profiles" : "All members"}</span>
                {(selectedContactId === "All" || selectedContactId === "All members") && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>

              {activeTab === "facile" ? (
                // Show User Profiles
                userProfiles.map((p) => {
                  const pId = p.profile_id || p.id;
                  return (
                    <DropdownMenuItem
                      key={pId}
                      className={`border-b border-[#b4abab2e] last:border-0 rounded-none cursor-pointer flex items-center justify-between ${selectedContactId === pId ? "font-semibold" : ""
                        }`}
                      onSelect={() => {
                        setSelectedContactId(pId);
                        setPage(1);
                      }}
                    >
                      <span>{p.name}</span>
                      {selectedContactId === pId && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  );
                })
              ) : (
                // Show Team Members
                teamMembers.map((member) => (
                  <DropdownMenuItem
                    key={member.id}
                    className={`border-b border-[#b4abab2e] last:border-0 rounded-none cursor-pointer flex items-center justify-between ${selectedContactId === member.id ? "font-semibold" : ""
                      }`}
                    onSelect={() => {
                      setSelectedContactId(member.id);
                      setPage(1);
                    }}
                  >
                    <span>{member.name}</span>
                    {selectedContactId === member.id && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Secondary dropdown removed as requested for facile Teams */}
        </div>
      </div>

      <div className=" text-white mt-9">
        <Table className={"border-separate! border-spacing-y-0!"}>
          <TableHeader>
            <TableRow className="pb-4! border-0! ">
              <TableHead></TableHead>
              {visibleColumns["Email"] !== false && <TableHead>Email</TableHead>}
              {dynamicColumns.filter(col => visibleColumns[col] !== false).map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingContacts ? (
              <TableRow>
                <TableCell
                  colSpan={5 + dynamicColumns.length}
                  className="text-center py-10 text-neutral-500"
                >
                  Loading contacts...
                </TableCell>
              </TableRow>
            ) : filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5 + dynamicColumns.length}
                  className="text-center py-10 text-neutral-500"
                >
                  No contacts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((m) => {
                const leadData = m.submitted_data || m.lead_data || {};
                return (
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
                            onCheckedChange={(checked) =>
                              setSelectedRows((prev) =>
                                checked
                                  ? [...prev, m.id]
                                  : prev.filter((x) => x !== m.id),
                              )
                            }
                            className={
                              "bg-transparent! text-[#A4A4A4]! border-2! border-[#A4A4A4]! "
                            }
                          />
                        </div>
                      </TableCell>

                      {visibleColumns["Email"] !== false && (
                        <TableCell className={"text-sm!"}>{m.email || leadData.Email || leadData.email || "-"}</TableCell>
                      )}

                      {dynamicColumns.filter(col => visibleColumns[col] !== false).map((col) => (
                        <TableCell key={col} className={"text-sm! max-w-[200px] truncate"}>
                          {leadData[col] || "-"}
                        </TableCell>
                      ))}


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
                              className={` cursor-pointer text-[#A4A4A4]! w-5! h-5! ${selected === m.id ? "rotate-180" : "rotate-0"
                                }`}
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {selected === m.id && (
                      <TableRow className={""}>
                        <TableCell className=" p-0! " colSpan={5 + dynamicColumns.length}>
                          <div className="rounded-b-2xl! flex flex-wrap items-center justify-between gap-4  bg-black py-4 px-6  w-full!">
                            <div className="flex items-center gap-x-8">
                              <div className="flex items-center gap-2  ">
                                <EditIcon size={20} /> Edit Contact
                              </div>

                              <div className="flex items-center gap-2 text-red-500">
                                <Trash2 size={20} /> Delete Contact
                              </div>
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
                      <TableCell colSpan={5 + dynamicColumns.length} className="h-4! p-0!" />
                    </TableRow>
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {!isLoadingContacts && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between px-2">
            <Button
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10 px-6 rounded-xl"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-neutral-400">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10 px-6 rounded-xl"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;
