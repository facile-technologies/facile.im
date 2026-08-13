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
  saveContactForm,
  fetchContactForm,
  setEmailBtnText,
} from "@/app/stores/slices/profileSlice";
import ColorPickerPopUp from "../../shared/ColorPicker";
import { Label } from "@/components/ui/label";
import { ChevronUp, Plus, Scan } from "lucide-react";
import Footer from "@/components/shared/Footer";

export default function EmailContactForm() {
  const profileType = useSelector((state) => state.profile.profileType);
  const [selectedLayout, setSelectedLayout] = useState("left");
  const [buttonText, setButtonText] = useState("Connect");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [showCardColorPicker, setShowCardColorPicker] = useState(false);
  const [currentEmailColor, setCurrentEmailColor] = useState("#ffffff");
  const [currentButtonColor, setCurrentButtonColor] = useState("#ffffff");
  const [showAddFields, setShowAddFields] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [fields, setFields] = useState([]);
  const dispatch = useDispatch();
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

  const emailOn = emailFields.some(
    (f) => f.field_type === "EMAIL" && f.is_enabled
  );
  const phoneOn = emailFields.some(
    (f) => f.field_type === "CONTACT" && f.is_enabled
  );
  useEffect(() => {
    if (emailFields && emailFields.length > 0) {
      const emailFieldExists = emailFields.some(
        (field) => field.field_type === "EMAIL" && field.is_enabled
      );
      if (emailFieldExists) {
        dispatch(setEmailToggle(true));
      }
    }
  }, [emailFields, dispatch]);

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
  const handleAddField = (fieldType) => {
    dispatch(addField({ type: fieldType }));
  };
  const handleRemoveField = (fieldId) => {
    dispatch(removeField({ id: fieldId }));
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
    dispatch(setEmailToggle(!emailToggle));
  };

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
    dispatch(setEmailBtnBgColor(color.hex));
  };

  const toggleField = (field) => {
    setFields((prevFields) => {
      const updatedFields = {
        email: field === "email" ? !prevFields.email : false,
        phoneNumber: field === "phoneNumber" ? !prevFields.phoneNumber : false,
      };
      return updatedFields;
    });
  };

  const handleSave = () => {
    const payload = {
      title: emailFormTitle,
      description: emailFormDescription,
      layout: emailLayout === "right" ? "CARD" : "COMPACT",
      button_text: emailBtnText,
      button_corner_radius: Number(newsletterButtonRadius) || 0,
      button_bg_color: emailBtnBgColor,
      button_text_color: emailBtnTextColor,
      success_message: emailSuccessMessage,
      fields: emailFields
        .map((f, idx) => ({
          field_type: f.field_type,
          label: f.label,
          placeholder: f.placeholder,
          is_enabled: !!f.is_enabled,
          sort_order: f.sort_order ?? idx + 1,
        }))
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    };

    dispatch(saveContactForm({profileType,payload}));
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-[1100px] mx-auto">
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
                    className="w-full dark:bg-[#2B2B2B] dark:text-white text-white px-4 py-3 rounded-xl border border-[#C0C0C040] outline-none"
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
                    className="w-full dark:bg-[#2B2B2B] dark:text-white text-white px-4 py-3 rounded-xl border border-[#C0C0C040] outline-none"
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
              <div
                onClick={() => handleLayoutChange("left")}
                className={`cursor-pointer flex items-center bg-[#3F3F3F] rounded-xl p-2  ${
                  selectedEmailLayout === "left"
                    ? "border-[2px] border-white bg-[#3A3A3A]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 dark:bg-[#7C7C7C] rounded-xl">
                  <input
                    readOnly
                    value="Email"
                    className="bg-transparent p-4 h-11 text-white border-none outline-none text-sm w-full"
                    style={{ borderRadius: `${newsletterButtonRadius}px 0 0 ${newsletterButtonRadius}px` }}
                  />
                  <a
                    type="button"
                    className="bg-black h-11 text-white text-sm px-4 py-3"
                    style={{ borderRadius: `0 ${newsletterButtonRadius}px ${newsletterButtonRadius}px 0` }}
                  >
                    Connect
                  </a>
                </div>
              </div>

              <div
                onClick={() => handleLayoutChange("right")}
                className={`cursor-pointer rounded-xl p-4 ${
                  selectedEmailLayout === "right"
                    ? "border-2 border-white bg-[#3A3A3A]"
                    : ""
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div
                    className="dark:bg-[#7C7C7C] px-4 py-3 rounded-xl text-left text-sm"
                    style={{ borderRadius: `${newsletterButtonRadius}px` }}
                  >
                    Email
                  </div>
                  <a
                    type="button"
                    className="bg-black items-center flex justify-center text-white text-sm px-4 py-2"
                    style={{ borderRadius: `${newsletterButtonRadius}px` }}
                  >
                    Connect
                  </a>
                </div>
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
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="inside w-[150px] rounded-3xl p-3 flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#262626] hover:bg-[#2B2B2B]"
                  >
                    {openDropdown ? (
                      <ChevronUp size={16} />
                    ) : (
                      <Plus size={16} />
                    )}{" "}
                    Add Field
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-[180px] bg-[#262626] rounded-lg shadow-xl z-50 border border-[#333] transition-all duration-200 ease-out ${
                      openDropdown
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    } origin-top-right`}
                  >
                    <div className="absolute w-full">
                      <a
                        type="button"
                        className="w-full text-left px-4 py-3 text-sm text-white dark:bg-[#262626] flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          dispatch(
                            addField({
                              field_type: "NAME",
                              label: "Full Name",
                              placeholder: "Your name",
                            })
                          );
                          setDynamicFields([...dynamicFields, "Name"]);
                          setOpenDropdown(false);
                        }}
                      >
                        <Plus size={14} /> Name
                      </a>
                      <a
                        type="button"
                        className="w-full text-left px-4 py-3 text-sm text-white dark:bg-[#262626] flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          dispatch(
                            addField({
                              field_type: "EMAIL",
                              label: "Email",
                              placeholder: "your@email.com",
                            })
                          );

                          setDynamicFields([...dynamicFields, "Email"]);
                          setOpenDropdown(false);
                        }}
                      >
                        <Plus size={14} /> Email
                      </a>

                      <a
                        type="button"
                        className="w-full text-left px-4 py-3 text-sm text-white dark:bg-[#262626] flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          dispatch(
                            addField({
                              field_type: "CONTACT",
                              label: "Phone",
                              placeholder: "Your phone number",
                            })
                          );
                          setDynamicFields([...dynamicFields, "Contact Field"]);
                          setOpenDropdown(false);
                        }}
                      >
                        <Plus size={14} /> Contact Field
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm opacity-70 mb-4">
                Customize the fields you'd like to collect from users.
              </p>
              <div className="bg-[#2B2B2B] rounded-2xl p-3 flex flex-col gap-3">
                {dynamicFields.length === 0 && (
                  <p className="text-center text-white/40 text-sm">
                    No fields added yet
                  </p>
                )}
                {emailFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between bg-[#3A3A3A] rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="cursor-grab text-[#A1A1A1]">⋮⋮</div>
                      <p className="text-white text-[15px] font-medium">
                        {field.type === "name"
                          ? "Name"
                          : field.type === "email"
                          ? "Email"
                          : "Contact"}
                      </p>
                    </div>

                    <a
                      type="button"
                      onClick={() => {
                        dispatch(removeField(field.id));
                      }}
                      className="text-white/60 hover:text-white"
                    >
                      ✕
                    </a>
                  </div>
                ))}
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
                <div className="flex items-center justify-between w-full dark:bg-[#2B2B2B] p-4 rounded-xl">
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
                <div className="flex items-center justify-between w-full dark:bg-[#2B2B2B] p-4 rounded-xl">
                  <label className="ml-2 text-sm text-black dark:text-white">
                    Phone Number
                  </label>
                  <Switch
                    checked={phoneOn}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        dispatch(
                          addField({
                            field_type: "CONTACT",
                            label: "Phone",
                            placeholder: "Your phone number",
                          })
                        );
                      } else {
                        dispatch(
                          setFieldEnabled({
                            field_type: "CONTACT",
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
                  className="w-full dark:bg-[#2B2B2B] dark:text-white text-white px-4 py-3 rounded-xl border border-[#C0C0C040] outline-none"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-sm text-black dark:text-white mb-2">
                  Button Corner Radius
                </label>
                <div className="flex items-center  dark:bg-[#2B2B2B] bg-[#2B2B2B] px-3 py-3 rounded-xl border border-[#C0C0C040]">
                  <Scan className="w-4 h-4 text-[#9CA3AF]" />

                  <input
                    type="number"
                    min={0}
                    value={newsletterButtonRadius}
                    onChange={(e) => {
                      dispatch(setNewsletterButtonRadius(e.target.value));
                    }}
                    className=" flex-1 bg-transparent border-none outline-none ml-3 text-left dark:text-white text-white text-sm"
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
                        ${
                          buttonTab === tab
                            ? "bg-black text-white font-medium"
                            : "dark:text-white/60 text-black/60 dark:hover:text-white"
                        }`}
                >
                  {tab}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4 flex-wrap">
              {colors.map((c) => (
                <div
                  key={c}
                  onClick={() => {
                    setCurrentEmailColor(c), setShowCardColorPicker("email");
                  }}
                  style={{ backgroundColor: c }}
                  className="w-8 h-8 rounded-full cursor-pointer border border-white/20"
                />
              ))}
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
              className="w-full dark:bg-[#2B2B2B] dark:text-white text-white px-4 py-3 rounded-xl border border-[#C0C0C040] outline-none"
            />
          </div>
          <Footer onSave={handleSave} />
        </div>
      )}
      {showCardColorPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="relative">
            <ColorPickerPopUp
              currentColor={currentColor}
              onSelect={handleColorChange}
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
                } else if (showCardColorPicker === "save") {
                  setCurrentButtonColor(newColor);
                  activeTab === "Background"
                    ? dispatch(setSaveBtnBgColor(newColor))
                    : dispatch(setSaveBtnTextColor(newColor));
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
