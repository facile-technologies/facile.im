import { useEffect, useState } from "react";
import { Switch } from "../../ui/switch";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmailLayout,
  setEmailToggle,
  setEmailBtnBgColor,
  setEmailBtnTextColor,
  setSaveBtnTextColor,
  setSaveBtnBgColor,
  addField,
  removeField,
  setEmailFormDescription,
  setEmailSuccessMessage,
  setEmailFormTitle,
  setNewsletterButtonRadius,
  setFieldLabel,
  toggleContactStatus,
  updateFieldOrder,
  saveContactForm,
  setEmailBtnText,
  setFieldEnabled,
} from "@/app/stores/slices/profileSlice";
import ColorPickerPopUp from "../../shared/ColorPicker";
import { Label } from "@/components/ui/label";
import { ChevronUp, Plus, Scan, Pipette, RotateCcw, Pencil, GripVertical } from "lucide-react";
import Footer from "@/components/shared/Footer";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableFieldItem({
  field,
  editingFieldId,
  editValue,
  setEditValue,
  setEditingFieldId,
  dispatch,
  setFieldLabel,
  removeField,
  isDarkMode,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between dark:bg-[#3A3A3A] bg-white rounded-xl px-4 py-3 border dark:border-transparent border-gray-200 shadow-sm ${isDragging ? "opacity-50 scale-[1.02] z-50 shadow-xl" : ""
        }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[#A1A1A1] p-1 hover:text-gray-300"
        >
          <GripVertical size={20} />
        </div>
        {editingFieldId === field.id ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => {
              dispatch(setFieldLabel({ id: field.id, label: editValue }));
              setEditingFieldId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                dispatch(setFieldLabel({ id: field.id, label: editValue }));
                setEditingFieldId(null);
              }
            }}
            className="dark:bg-[#2B2B2B] bg-white dark:text-white text-black text-[15px] font-medium px-2 py-1 rounded outline-none border dark:border-white/20 border-gray-300 w-full"
          />
        ) : (
          <p className="dark:text-white text-black text-[15px] font-medium">
            {field.label || field.field_type}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 ml-2">
        {field.field_type === "CUSTOM" && (
          <button
            onClick={() => {
              setEditingFieldId(field.id);
              setEditValue(field.label || "");
            }}
            className={`transition-colors !bg-transparent ${isDarkMode ? "!text-[#ECFCF9]" : "!text-black"
              } hover:opacity-80`}
          >
            <Pencil size={14} />
          </button>
        )}
        <a
          type="button"
          onClick={() => {
            dispatch(removeField(field.id));
          }}
          className="text-white/40 hover:text-white cursor-pointer"
        >
          ✕
        </a>
      </div>
    </div>
  );
}

export default function EmailContactForm() {
  const profileType = useSelector((state) => state.profile.profileType);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [showCardColorPicker, setShowCardColorPicker] = useState(false);
  const [currentEmailColor, setCurrentEmailColor] = useState("#ffffff");
  const [currentButtonColor, setCurrentButtonColor] = useState("#ffffff");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
  const emailToggle = useSelector((state) => state.profile.emailToggle);
  const selectedEmailLayout = useSelector((state) => state.profile.emailLayout);
  const [buttonTab, setButtonTab] = useState("Background");
  const emailFields = useSelector((state) => state.profile.fields);
  const emailFormTitle = useSelector((state) => state.profile.emailFormTitle);
  const newsletterButtonRadius = useSelector(
    (state) => state.profile.newsletterButtonRadius
  );
  const emailFormDescription = useSelector(
    (state) => state.profile.emailFormDescription
  );
  const emailBtnText = useSelector((state) => state.profile.emailBtnText);
  const emailLayout = useSelector((s) => s.profile.emailLayout);
  const emailBtnBgColor = useSelector((s) => s.profile.emailBtnBgColor);
  const emailBtnTextColor = useSelector((s) => s.profile.emailBtnTextColor);
  const emailSuccessMessage = useSelector((s) => s.profile.emailSuccessMessage);

  const emailOn = (emailFields || []).some(
    (f) => f.field_type === "EMAIL" && f.is_enabled
  );
  const phoneOn = (emailFields || []).some(
    (f) => f.field_type === "PHONE_NUMBER" && f.is_enabled
  );

  const colors = [
    "#FFFFFF",
    "#E0E6EF",
    "#A6AEC5",
    "#000000",
    "#E05A59",
    "#F4A63A",
    "#F7D858",
    "#4CAF50",
    "#6AA7FF",
    "#A469FF",
  ];

  const handleLayoutChange = (layout) => {
    dispatch(setEmailLayout(layout));
  };
  const handleAddField = (fieldType, label = "", placeholder = "") => {
    dispatch(addField({ field_type: fieldType, label, placeholder }));
  };
  const handleRemoveField = (fieldId) => {
    dispatch(removeField({ id: fieldId }));
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = emailFields.findIndex((f) => f.id === active.id);
      const newIndex = emailFields.findIndex((f) => f.id === over.id);
      const reorderedFields = arrayMove(emailFields, oldIndex, newIndex).map(
        (field, index) => ({
          ...field,
          sort_order: index + 1,
        }),
      );
      dispatch(updateFieldOrder(reorderedFields));
    }
  };

  const handleTitleChange = (e) => {
    dispatch(setEmailFormTitle(e.target.value));
  };

  const handleDescriptionChange = (e) => {
    dispatch(setEmailFormDescription(e.target.value));
  };
  const handleSuccessMessageChange = (e) => {
    dispatch(setEmailSuccessMessage(e.target.value));
  };
  const handleEmailToggle = () => {
    dispatch(toggleContactStatus({ profileType, is_enabled: !emailToggle }));
  };

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
    if (buttonTab === "Background") {
      dispatch(setEmailBtnBgColor(color.hex));
    } else {
      dispatch(setEmailBtnTextColor(color.hex));
    }
  };

  const getContrastColor = (hexColor) => {
    if (!hexColor) return "black";
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "black" : "white";
  };

  const activeColor =
    buttonTab === "Background" ? emailBtnBgColor : emailBtnTextColor;

  const handleSave = () => {
    // Re-assign sort_order based on current array position
    const syncedFields = (emailFields || []).map((field, index) => ({
      ...field,
      sort_order: index + 1,
    }));

    const data = {
      title: emailFormTitle,
      description: emailFormDescription,
      layout: emailLayout === "right" ? "CARD" : "COMPACT",
      button_text: emailBtnText,
      button_corner_radius: Number(newsletterButtonRadius) || 0,
      button_bg_color: emailBtnBgColor,
      button_text_color: emailBtnTextColor,
      success_message: emailSuccessMessage,
      fields: syncedFields.map((f) => ({
        id: typeof f.id === "number" ? f.id : undefined,
        field_type: f.field_type,
        label: f.label,
        placeholder: f.placeholder,
        is_enabled: !!f.is_enabled,
        sort_order: f.sort_order,
      })),
    };

    dispatch(saveContactForm({ profileType, data }));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-2 dark:bg-[#303030] bg-[#F5F5F5] rounded-2xl p-6 border border-[#C0C0C017] w-full max-w-[700px]">
        <h2 className="dark:text-white text-black text-[16px] font-bold">
          Email Contact Form
        </h2>

        <div className="flex items-center justify-between w-full">
          <p className="dark:text-white text-black opacity-50 text-[15px] font-medium">
            Let visitors share their email with you through a contact form
          </p>
          <Switch
            id="email-capture"
            checked={emailToggle}
            onCheckedChange={handleEmailToggle}
          />
        </div>
      </div>
      {emailToggle && (
        <div className="flex flex-col gap-6 rounded-2xl p-2 w-full max-w-[724px]">
          <div className=" w-full">
            <div className="dark:bg-[#3A3A3A] p-4 rounded-2xl">
              <h3 className="dark:text-white text-black text-[16px] font-semibold  mb-1">
                Title
              </h3>
              <p className="mb-1 text-sm opacity-52">
                Give title to the contact form
              </p>
              <div className="flex items-center gap-4">
                <div className="flex flex-col w-full">
                  <label className="text-sm text-black dark:text-white mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={emailFormTitle}
                    onChange={handleTitleChange}
                    className="w-full dark:bg-[#2B2B2B] bg-white dark:text-white text-black px-4 py-3 rounded-xl border dark:border-[#C0C0C040] border-gray-300 outline-none"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-sm text-black dark:text-white mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={emailFormDescription}
                    onChange={handleDescriptionChange}
                    className="w-full dark:bg-[#2B2B2B] bg-white dark:text-white text-black px-4 py-3 rounded-xl border dark:border-[#C0C0C040] border-gray-300 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="dark:bg-[#3A3A3A] p-4 rounded-2xl">
            <h3 className="dark:text-white text-black text-[16px] font-semibold mb-0">
              Layout
            </h3>
            <p className=" flex mb-2">
              Customize the fields you’d like to collect from users.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2">
                <div
                  onClick={() => handleLayoutChange("left")}
                  className={`cursor-pointer flex items-center dark:bg-[#3F3F3F] bg-[#F2F4F7] rounded-xl p-2 w-full h-[100px] ${selectedEmailLayout === "left"
                    ? "border-[2px] dark:border-white border-black dark:bg-[#3A3A3A] bg-white"
                    : "border border-transparent"
                    }`}
                >
                  <div
                    className="flex items-center gap-3 dark:bg-[#7C7C7C] bg-gray-300 w-full"
                    style={{ borderRadius: `${newsletterButtonRadius ?? 16}px` }}
                  >
                    <input
                      readOnly
                      value="Email"
                      className="bg-transparent p-4 h-11 text-white border-none outline-none text-sm w-full"
                    />
                    <a
                      type="button"
                      className="bg-black h-11 text-white text-sm px-4 py-3"
                      style={{ borderRadius: `0 ${newsletterButtonRadius ?? 16}px ${newsletterButtonRadius ?? 16}px 0` }}
                    >
                      Connect
                    </a>
                  </div>
                </div>
                <span className="text-sm dark:text-white/60 text-black/60">Compact</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div
                  onClick={() => handleLayoutChange("right")}
                  className={`cursor-pointer rounded-xl p-4 w-full h-[100px] dark:bg-[#3F3F3F] bg-[#F2F4F7] flex flex-col justify-center ${selectedEmailLayout === "right"
                    ? "border-2 dark:border-white border-black dark:bg-[#3A3A3A] bg-white"
                    : "border border-transparent"
                    }`}
                >
                  <div className="flex flex-col gap-3 p-2">
                    <div
                      className="dark:bg-[#7C7C7C] bg-gray-300 px-4 py-2 text-left text-sm dark:text-white text-black"
                      style={{ borderRadius: `${newsletterButtonRadius ?? 16}px` }}
                    >
                      Email
                    </div>
                    <a
                      type="button"
                      className="bg-black items-center flex justify-center text-white text-sm px-4 py-2"
                      style={{ borderRadius: `${newsletterButtonRadius ?? 16}px` }}
                    >
                      Connect
                    </a>
                  </div>
                </div>
                <span className="text-sm dark:text-white/60 text-black/60">Card</span>
              </div>
            </div>
          </div>
          {selectedEmailLayout === "right" ? (
            <div className="dark:bg-[#3A3A3A] p-4 rounded-2xl">
              <div className="relative flex justify-between items-center">
                <h3 className="dark:text-white text-black text-[16px] font-semibold mb-1">
                  Fields
                </h3>
                <div className="relative">
                  <button
                    onClick={() => {
                      setOpenDropdown(!openDropdown);
                      setIsAddingCustom(false);
                    }}
                    className="inside w-[150px] rounded-3xl p-3 flex items-center justify-center gap-2 px-4 py-2 text-white dark:bg-[#262626] bg-black dark:hover:bg-[#2B2B2B]"
                  >
                    {openDropdown ? (
                      <ChevronUp size={16} />
                    ) : (
                      <Plus size={16} />
                    )}{" "}
                    Add Field
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-[220px] dark:bg-[#262626] bg-white rounded-lg shadow-xl z-50 border dark:border-[#333] border-gray-200 transition-all duration-200 ease-out ${openDropdown
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      } origin-top-right overflow-hidden`}
                  >
                    {!isAddingCustom ? (
                      <div className="flex flex-col w-full">
                        <a
                          type="button"
                          className="w-full text-left px-4 py-3 text-sm dark:text-white text-black dark:hover:bg-[#333] hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                          onClick={() => {
                            handleAddField("NAME", "Full Name", "Your name");
                            setOpenDropdown(false);
                          }}
                        >
                          <Plus size={14} /> Name
                        </a>
                        <a
                          type="button"
                          className="w-full text-left px-4 py-3 text-sm dark:text-white text-black dark:hover:bg-[#333] hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                          onClick={() => {
                            handleAddField("EMAIL", "Email", "Enter your email");
                            setOpenDropdown(false);
                          }}
                        >
                          <Plus size={14} /> Email
                        </a>

                        <a
                          type="button"
                          className="w-full text-left px-4 py-3 text-sm dark:text-white text-black dark:hover:bg-[#333] hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                          onClick={() => {
                            setIsAddingCustom(true);
                            setCustomLabel("");
                          }}
                        >
                          <Plus size={14} /> Custom Field
                        </a>
                      </div>
                    ) : (
                      <div className="p-3 flex flex-col gap-2">
                        <input
                          autoFocus
                          placeholder="Enter label name"
                          value={customLabel}
                          onChange={(e) => setCustomLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && customLabel.trim()) {
                              handleAddField("CUSTOM", customLabel, "Enter " + customLabel);
                              setOpenDropdown(false);
                              setIsAddingCustom(false);
                            }
                          }}
                          className="w-full bg-[#333] text-white px-3 py-2 rounded text-sm outline-none border border-white/10"
                        />
                        <button
                          disabled={!customLabel.trim()}
                          onClick={() => {
                            handleAddField("CUSTOM", customLabel, "Enter " + customLabel);
                            setOpenDropdown(false);
                            setIsAddingCustom(false);
                          }}
                          className="bg-white text-black text-xs font-bold py-1.5 rounded disabled:opacity-50"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm opacity-70 mb-4">
                Customize the fields you'd like to collect from users.
              </p>
              <div className="dark:bg-[#2B2B2B] bg-[#F2F4F7] rounded-2xl p-3 flex flex-col gap-3">
                {(emailFields || []).filter((f) => f.is_enabled).length === 0 && (
                  <p className="text-center dark:text-white text-black opacity-40 text-sm">
                    No fields added yet
                  </p>
                )}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={(emailFields || []).filter((f) => f.is_enabled).map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-3">
                      {(emailFields || [])
                        .filter((f) => f.is_enabled)
                        .map((field) => (
                          <SortableFieldItem
                            key={field.id}
                            field={field}
                            editingFieldId={editingFieldId}
                            editValue={editValue}
                            setEditValue={setEditValue}
                            setEditingFieldId={setEditingFieldId}
                            dispatch={dispatch}
                            setFieldLabel={setFieldLabel}
                            removeField={removeField}
                            isDarkMode={isDarkMode}
                          />
                        ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          ) : (
            <div className="dark:bg-[#3A3A3A] p-4 rounded-2xl">
              <h3 className="dark:text-white text-black text-[16px] font-semibold mb-0">
                Fields
              </h3>
              <p className="mb-2 text-sm">
                Customize the fields you’d like to collect from users.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-between w-full dark:bg-[#2B2B2B] bg-[#F2F4F7] p-4 rounded-xl">
                  <p className="dark:text-white text-black text-[15px] font-medium">
                    Email
                  </p>
                  <Switch
                    checked={emailOn}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        dispatch(
                          addField({
                            field_type: "EMAIL",
                            label: "Email",
                            placeholder: "your@email.com",
                          })
                        );
                        // Exclusive: disable phone if email is enabled in compact
                        dispatch(
                          setFieldEnabled({
                            field_type: "PHONE_NUMBER",
                            is_enabled: false,
                          })
                        );
                      } else {
                        dispatch(
                          setFieldEnabled({
                            field_type: "EMAIL",
                            is_enabled: false,
                          })
                        );
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-between w-full dark:bg-[#2B2B2B] bg-[#F2F4F7] p-4 rounded-xl">
                  <label className="ml-2 text-sm text-black dark:text-white">
                    Phone Number
                  </label>
                  <Switch
                    checked={phoneOn}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        dispatch(
                          addField({
                            field_type: "PHONE_NUMBER",
                            label: "Phone Number",
                            placeholder: "Enter your phone number",
                          })
                        );
                        // Exclusive: disable email if phone is enabled in compact
                        dispatch(
                          setFieldEnabled({
                            field_type: "EMAIL",
                            is_enabled: false,
                          })
                        );
                      } else {
                        dispatch(
                          setFieldEnabled({
                            field_type: "PHONE_NUMBER",
                            is_enabled: false,
                          })
                        );
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="dark:bg-[#3A3A3A] p-4 rounded-2xl">
            <h3 className="dark:text-white text-black text-[16px] font-semibold mb-1">
              Button Customization
            </h3>
            <p className="dark:text-white text-black opacity-50 text-[12px] mb-4">
              Customize form button
            </p>
            <div className="flex items-center gap-4">
              <div className="flex flex-col w-full">
                <label className="text-sm text-black dark:text-white mb-2">
                  Button Text
                </label>
                <input
                  value={emailBtnText}
                  onChange={(e) => {
                    dispatch(setEmailBtnText(e.target.value));
                  }}
                  className="w-full dark:bg-[#2B2B2B] bg-white dark:text-white text-black px-4 py-3 rounded-xl border dark:border-[#C0C0C040] border-gray-300 outline-none"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-sm text-black dark:text-white mb-2">
                  Button Corner Radius
                </label>
                <div className="flex items-center dark:bg-[#2B2B2B] bg-white px-3 py-3 rounded-xl border dark:border-[#C0C0C040] border-gray-300">
                  <Scan className="w-4 h-4 text-[#9CA3AF]" />

                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={newsletterButtonRadius === 0 ? "" : newsletterButtonRadius}
                    onChange={(e) => {
                      const val = e.target.value;
                      dispatch(setNewsletterButtonRadius(val === "" ? 0 : Number(val)));
                    }}
                    className=" flex-1 bg-transparent border-none outline-none ml-3 text-left dark:text-white text-black text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center border border-[#EAECF04A] dark:bg-[#3A3A3A] bg-[#F9FAFB] rounded-full mt-4 mb-5">
              {["Background", "Name"].map((tab) => (
                <a
                  type="button"
                  key={tab}
                  onClick={() => setButtonTab(tab)}
                  className={`flex-1 text-center py-2 text-sm rounded-full transition
                        ${buttonTab === tab
                      ? "bg-black text-white font-medium"
                      : "dark:text-white/60 text-black/60 dark:hover:text-white"
                    }`}
                >
                  {tab}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4 flex-wrap">
              {/* Pipette icon for custom color picker */}
              <div
                onClick={() => {
                  setShowCardColorPicker("email");
                }}
                style={{
                  backgroundColor: activeColor || "#ffffff",
                  color: getContrastColor(activeColor || "#ffffff"),
                }}
                className={`w-8 h-8 rounded-full cursor-pointer border border-white/20 flex items-center justify-center transition-transform hover:scale-105 shadow-sm`}
              >
                <Pipette size={16} />
              </div>

              {colors.map((c) => (
                <div
                  key={c}
                  onClick={() => {
                    if (buttonTab === "Background") {
                      dispatch(setEmailBtnBgColor(c));
                    } else {
                      dispatch(setEmailBtnTextColor(c));
                    }
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full cursor-pointer border shadow-sm transition-transform hover:scale-105 ${
                    activeColor === c
                      ? "ring-2 ring-gray-400 ring-offset-2 dark:ring-offset-[#303030] border-transparent"
                      : "border-gray-200 dark:border-white/10"
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  dispatch(setEmailBtnBgColor("#4F2E86"));
                  dispatch(setEmailBtnTextColor("#ffffff"));
                }}
                className={`flex items-center gap-2 text-xs hover:text-white transition !bg-transparent ${isDarkMode ? "!text-[#C8C8C8]" : "!text-gray-500"}`}
              >
                <RotateCcw size={14} />
                Reset colors to default
              </button>
            </div>
          </div>
          <div className="dark:bg-[#3A3A3A] p-4 rounded-2xl">
            <h3 className="dark:text-white text-black text-[16px] font-semibold">
              Success Message
            </h3>
            <p className="dark:text-white text-black opacity-50 text-[12px] mb-2">
              After users submit their response, this message will appear.
            </p>
            <input
              type="text"
              value={emailSuccessMessage}
              onChange={handleSuccessMessageChange}
              className="w-full dark:bg-[#2B2B2B] bg-white dark:text-white text-black px-4 py-3 rounded-xl border dark:border-[#C0C0C040] border-gray-300 outline-none"
            />
          </div>
          <Footer onSave={handleSave} />
        </div>
      )}
      {showCardColorPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="relative">
            <ColorPickerPopUp
              currentColor={
                showCardColorPicker === "email"
                  ? currentEmailColor
                  : currentButtonColor
              }
              onSelect={(newColor) => {
                if (showCardColorPicker === "email") {
                  setCurrentEmailColor(newColor);
                  buttonTab === "Background"
                    ? dispatch(setEmailBtnBgColor(newColor))
                    : dispatch(setEmailBtnTextColor(newColor));
                }
              }}
              onClose={() => setShowCardColorPicker(false)}
            />
            <button
              onClick={() => setShowCardColorPicker(false)}
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-7 h-7 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
