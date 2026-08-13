import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import InviteMembersPage from "./Invite/InviteMembersPage";
import Members from "./Members";
import ProfileSection from "./Edit-Profile/layout/EditprofileLayout/ProfileSection";

export default function TeamCreated({team}) {
  const [inviteMembers, setInviteMembers] = useState(false);
  console.log(inviteMembers, "inviteMembers");
  const [success, setSuccess] = useState(false);
  const [editMemberProfile, setEditMemberProfile] = useState(false);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setSuccess(false);
  //   }, 4000);

  //   return () => clearTimeout(timer);
  // }, []);
// const team = JSON.parse(localStorage.getItem("teams"));
  console.log("team",team);
  

  return (
    <>
      {inviteMembers ? (
        <InviteMembersPage />
      ) : editMemberProfile ? (
        <ProfileSection />
      ) : (
        <div className="min-h-screen bg-[#262626] p-10 text-white rounded-[10px]">
          {/* Top Summary Card */}
          <Card className="bg-[#303030] border-none rounded-2xl  p-0!">
            <CardContent className="p-6 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-medium">
                  {team?.data?.team_name ?? "Team Name"}
                </h2>
                <p className="text-sm text-muted-foreground text-[#FFFFFF85] ">
                  {team?.data?.team_description ?? "Team Description"}
                </p>
              </div>

              <Button
                onClick={() => setInviteMembers(true)}
                className="bg-black! hover:bg-black/80! text-white! rounded-2xl text-base! h-10!"
              >
                + Invite Members
              </Button>
            </CardContent>
          </Card>
          {success ? (
            <div className="flex flex-col items-center text-center mt-16">
              {/* Check Icon */}
              <div className="bg-[#2A2A2A] p-5 rounded-full mb-6">
                <div className="h-14 w-14 rounded-full border-4 border-[#00E656] flex items-center justify-center">
                  <Check className="text-[#00E656]! h-7 w-7 " strokeWidth={3} />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold mb-2">
                Your Team has been created!
              </h1>

              {/* Subtitle */}
              <p className=" text-muted-foreground max-w-[701px] text-[#FFFFFFDB]">
                Let's complete your setup. Choose one of the option below to get
                started with managing your team.
              </p>
            </div>
          ) : (
            <Members setEditMemberProfile={setEditMemberProfile} />
          )}
        </div>
      )}
    </>
  );
}
