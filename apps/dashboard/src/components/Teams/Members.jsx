import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MembersGridView from "./MembersGridView";
import MembersListView from "./MembersListView";
import { Checkbox } from "../ui/checkbox";
import { LayoutGrid, List, Search } from "lucide-react";
import { Input } from "../ui/input";
import { getAllTeamMembers } from "@/services/teams";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loader from "@/store/utils/Loader";

const DEFAULT_BANNER =
  "https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small/abstract-polygonal-banner-background.jpg";
const MEMBERS_PER_PAGE = 9;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const normalizeMember = (member, index) => {
  const id =
    member?.id ??
    member?.member_id ??
    member?._id ??
    member?.user_id ??
    index + 1;

  const fullName = member?.full_name || member?.name;
  const fallbackName =
    `${member?.first_name || ""} ${member?.last_name || ""}`.trim();

  return {
    id,
    name: fullName || fallbackName || "Unnamed Member",
    email: member?.email || member?.user?.email || "-",
    status:
      member?.status ||
      member?.member_status ||
      member?.invitation_status ||
      member?.invite_status ||
      (member?.is_active ? "Active" : "Pending"),
    image:
      member?.image ||
      member?.profile_image ||
    
      member?.user?.profile_image ||
      null,
    profileImage:
      member?.profile_image ||
      member?.image ||
     
      member?.user?.profile_image ||
      null,
    banner: member?.banner || DEFAULT_BANNER,
    allowEdit: Boolean(member?.allowEdit ?? member?.allow_edit_profile),
    views: member?.views ?? member?.view_count ?? member?.analytics?.views ?? 0,
    leads: member?.leads ?? member?.lead_count ?? member?.analytics?.leads ?? 0,
    total_views:
      member?.total_views ??
      member?.views ??
      member?.view_count ??
      member?.analytics?.views ??
      0,
    total_clicks:
      member?.total_clicks ??
      member?.clicks ??
      member?.lead_count ??
      member?.leads ??
      member?.analytics?.leads ??
      0,
    date: formatDate(
      member?.created_at || member?.createdAt || member?.added_at,
    ),
  };
};

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
};

const Members = ({ setEditMemberProfile }) => {
  const [view, setView] = useState("grid");
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [hasMembersData, setHasMembersData] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: MEMBERS_PER_PAGE,
    total: 0,
    totalPages: 1,
  });

  const { watch, setValue, control, reset } = useForm({ defaultValues: {} });
  const values = watch();

  const fetchMembers = async ({ searchText = "", page = 1 } = {}) => {
    setLoadingMembers(true);
    setMembersError("");

    try {
      const response = await getAllTeamMembers({
        search: searchText || undefined,
        page,
        limit: MEMBERS_PER_PAGE,
      });
      const payload = response?.data;
      const rawMembers =
        payload?.data?.members ||
        (Array.isArray(payload?.data) ? payload?.data : null) ||
        payload?.data ||
        payload?.members ||
        payload?.result ||
        [];
      const paginationPayload =
        payload?.pagination || payload?.data?.pagination || {};

      const parsedMembers = Array.isArray(rawMembers)
        ? rawMembers.map((member, index) => normalizeMember(member, index))
        : [];

      setMembers(parsedMembers);
      setPagination((prev) => ({
        page: Number(paginationPayload?.page) || page,
        limit:
          Number(paginationPayload?.limit) || prev.limit || MEMBERS_PER_PAGE,
        total: Number(paginationPayload?.total) || 0,
        totalPages: Math.max(Number(paginationPayload?.totalPages) || 1, 1),
      }));
      if (
        parsedMembers.length > 0 ||
        (Number(paginationPayload?.total) || 0) > 0
      ) {
        setHasMembersData(true);
      }
    } catch (err) {
      setMembersError(
        err?.response?.data?.message || "Failed to load team members.",
      );
      setMembers([]);
    } finally {
      setHasFetchedOnce(true);
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchMembers({
      searchText: debouncedSearch,
      page: pagination.page,
    });
  }, [debouncedSearch, pagination.page]);

  useEffect(() => {
    setPagination((prev) => {
      if (prev.page === 1) return prev;
      return {
        ...prev,
        page: 1,
      };
    });
  }, [debouncedSearch]);

  useEffect(() => {
    reset(
      members.reduce((acc, member) => {
        acc[`member_${member.id}`] = false;
        return acc;
      }, {}),
    );
  }, [members, reset]);

  const selectedRows = members
    .filter((member) => values?.[`member_${member.id}`])
    .map((member) => member.id);

  const allSelected =
    view === "grid"
      ? members.length > 0 && members.every((m) => values?.[`member_${m.id}`])
      : members.length > 0 && selectedRows.length === members.length;

  const someSelected =
    view === "grid"
      ? members.some((m) => values?.[`member_${m.id}`]) && !allSelected
      : selectedRows.length > 0 && !allSelected;

  const toggleSelectAll = (checked) => {
    const isChecked = checked === true;

    members.forEach((m) => {
      setValue(`member_${m.id}`, isChecked, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });
    });
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages || page === pagination.page) {
      return;
    }

    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  if (hasFetchedOnce && !loadingMembers && !hasMembersData) {
    return null;
  }

  return (
    <div className=" text-white mt-8">
      {/* HEADER */}
      <div className="flex  justify-between mb-9">
        <div>
          <h2 className="text-lg font-semibold">
            Members ({pagination.total || members.length})
          </h2>
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

        <div className="flex items-center gap-3">
          <div className="flex bg-[#373636] rounded-full border border-[#373636] h-12">
            <button
              onClick={() => setView("grid")}
              className={`px-5 py-2 rounded-full ${
                view === "grid" ? "bg-black!" : "bg-transparent!"
              }`}
            >
              <LayoutGrid size={16} className={"text-white!"} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-5 py-2 rounded-full ${
                view === "list" ? "bg-black!" : "bg-transparent!"
              }`}
            >
              <List size={16} className={"text-white!"} />
            </button>
          </div>

          <div className="relative">
            <Search
              className="absolute left-5 top-4 text-[#CFCFCF]"
              size={16}
            />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11  bg-[#373636]! border! border-[#C0C0C040]! rounded-full! max-w-[324px]! w-full! h-12 placeholder:text-[#CFCFCF]"
            />
          </div>
        </div>
      </div>
      {membersError ? (
        <p className="text-red-400 text-sm mb-4">{membersError}</p>
      ) : null}
      {/* {loadingMembers ? <p className="text-sm text-neutral-400">Loading members...</p> : null} */}
      {loadingMembers && <Loader />}
      {/* GRID VIEW */}
      {!loadingMembers && view === "grid" && (
        <MembersGridView
          members={members}
          control={control}
          setEditMemberProfile={setEditMemberProfile}
        />
      )}
      {!loadingMembers && view === "list" && (
        <MembersListView
          members={members}
          selectedRows={selectedRows}
          setEditMemberProfile={setEditMemberProfile}
          toggleRow={(id) =>
            setValue(`member_${id}`, !values?.[`member_${id}`], {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: false,
            })
          }
        />
      )}
      {!loadingMembers && pagination.totalPages > 1 ? (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className={
                    pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {getVisiblePages(pagination.page, pagination.totalPages).map(
                (page, index) => (
                  <PaginationItem key={`${page}-${index}`}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={pagination.page === page}
                        onClick={() => goToPage(page)}
                        className={` border-none! ${
                          pagination.page === page
                            ? "bg-black! text-white!" // selected page color
                            : "bg-[#373636] text-gray-300 hover:bg-[#4a4a4a]" // normal page color
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className={
                    pagination.page >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
};

export default Members;
