import { Button } from "@/components/ui/button";
import { getAllTemplates } from "@/services/teams";
import defaultUserImage from "@/assets/pngs/default-user-3.jpg";
import {
  ChartLine,
  Check,
  ChevronDown,
  Contact,
  EditIcon,
  Eye,
  LayoutTemplate,
  MonitorIcon,
  MousePointer2,
  Trash2,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import Loader from "@/store/utils/Loader";

const SelectTemplate = ({ setCreateTemplate }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);

        const res = await getAllTemplates(page);

        const data = res?.data?.data || [];
        const pagination = res?.data?.pagination;

        // 🔥 map only what you need
        const mapped = data.map((t) => ({
          id: t.id,
          label: t.template_name,
          // image: "/Pet-1.png", // (static for now)
        }));

        setTemplates(mapped);
        setTotalPages(pagination?.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="flex items-center justify-between gap-1 mb-4">
            <div>
              <h2 className="text-2xl font-semibold">No Template Yet</h2>
              <p className="text-sm text-gray-600 dark:text-[#FFFFFFA3] ">
                Start by choosing a ready-made business layout or create one
                from scratch.
              </p>
            </div>
            <Button
              onClick={() => {
                localStorage.setItem("templateMode", "create");
                setCreateTemplate(true);
              }}
              className="bg-black! hover:bg-black/80! text-white! rounded-2xl text-sm! h-10!"
            >
              + Create Template
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6  mt-6">
            {[
              { label: "Simple Tag", image: "/Pet-2.png" },
              { label: "Bold Bark", image: "/Pet-3.png" },
              { label: "Alpha Mode", image: "/Pet-1.png" },
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedCard(index)}
                className={`relative w-full max-w-[280px] md:max-w-[350px] h-[330px] md:h-[353px] bg-[#3F3F3F] rounded-xl cursor-pointer transition
                      ${selectedCard === index ? "border-2 border-accent" : null}
                      ${selectedCard === null ? "opacity-90 cursor-not-allowed" : ""}
                    `}
              >
                {selectedCard === index && (
                  <div className="absolute top-0 right-0 bg-accent rounded-bl-2xl p-3 text-white shadow-md">
                    <Check size={20} />
                  </div>
                )}
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover scale-[1.5] pt-15 object-top"
                  />
                  <div
                    className="absolute bottom-0 left-0 w-full h-[90px]
                            bg-linear-to-t from-black/80 to-transparent
                            flex items-end justify-center pb-3"
                  >
                    <p className="text-white text-[29px] font-semibold">
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {templates.map((item, index) => {
              const realIndex = index + 3; // offset because 3 static cards

              return (
                <div key={realIndex} className="max-w-[380px]! w-full!">
                  <Card
                    className={`relative bg-[#3A3A3A] border-neutral-700 rounded-t-2xl! overflow-hidden p-4! max-w-[380px]! w-full! gap-0! 
                    ${openMenu === item.id ? "rounded-b-none!" : "rounded-b-2xl!"}
                    `}
                  >
                    <div className="z-10">
                      {/* BANNER */}
                      <div
                        className="relative h-38 bg-cover rounded-2xl -z-10"
                        style={{
                          backgroundImage: `url(https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small/abstract-polygonal-banner-background.jpg)`,
                        }}
                      ></div>
                      <div className="relative w-fit mx-auto">
                        {/* user image */}
                        {/* {item.image ? ( */}
                          <img
                            src={item.image || defaultUserImage}
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
                          {item.label}
                        </h3>
                        <p className="text-sm text-white mt-1">{item.email}</p>

                        <div className="flex items-center justify-center  text-xs  mt-2 gap-1 text-white">
                          <User size={16} /> 3 Members
                        </div>
                      </div>

                      <ChevronDown
                        onClick={() =>
                          setOpenMenu(openMenu === item.id ? null : item.id)
                        }
                        className={`absolute bottom-0 right-0 cursor-pointer text-[#A4A4A4] ${
                          openMenu === item.id ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </Card>
                  {/* BOTTOM MENU (EXACT LIKE IMAGE) */}
                  {openMenu === item.id && (
                    <div className=" relative  bg-black rounded-b-2xl p-4 text-sm max-w-[380px]! w-full!">
                      <div className="space-y-3">
                        <div className="flex flex-wrap justify-between gap-4 ">
                          <div
                            // onClick={() => navigate("/devices")}
                            className="flex items-center gap-2 cursor-pointer "
                          >
                            <MonitorIcon size={14} /> Set as Default
                          </div>
                          <div
                            // onClick={() => setEditMemberProfile(true)}
                            className="flex items-center gap-2 cursor-pointer "
                          >
                            <EditIcon size={14} /> Manage Members
                          </div>
                          <div
                            // onClick={() => navigate("/templates")}
                            className="flex items-center gap-2 cursor-pointer "
                          >
                            <LayoutTemplate size={14} /> Assign Template
                          </div>
                          <div
                            // onClick={() => setEditMemberProfile(true)}
                            className="flex items-center gap-2 cursor-pointer "
                          >
                            <EditIcon size={14} /> Edit Template
                          </div>

                          <div className="flex items-center gap-2 cursor-pointer ">
                            <Trash2 size={14} /> Remove Template
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
              );
            })}
          </div>
          <Pagination className="mt-8">
            <PaginationContent>
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(page + 1)}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default SelectTemplate;
