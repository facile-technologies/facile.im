import React, { useState } from "react";
import SelectTemplate from "./SelectTemplate";
import TeamsProfileSection from "./Create-Template/layout/EditprofileLayout/ProfileSection";
import ProfileSection from "@/components/General-Profile/layout/EditprofileLayout/ProfileSection";


const TemplatesPage = () => {
  const [createTemplate, setCreateTemplate] = useState(false);
  return (
    <div className="w-full text-white">
      {createTemplate ? (
        <ProfileSection />
      ) : (
        <SelectTemplate setCreateTemplate={setCreateTemplate} />
      )}
    </div>
  );
};

export default TemplatesPage;
