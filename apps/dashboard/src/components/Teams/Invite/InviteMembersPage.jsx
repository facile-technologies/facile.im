"use client";

import { useState } from "react";
import InviteViaEmailForm from "./InviteViaEmailForm";
import InviteViaCsvForm from "./InviteViaCsvForm";
import MembersPreview from "./MembersPreview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import { addTeamMembers } from "@/services/teams";

export default function InviteMembersPage() {
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("email");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isSubmittingMembers, setIsSubmittingMembers] = useState(false);
  const {
    register,
    trigger,
    getValues,
    reset,

    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async () => {
    setSubmitError("");
    setSubmitSuccess("");

    const mappedMembers = members.map((m) => ({
      full_name: (m.fullName || "").trim(),
      email: (m.email || "").trim(),
    }));

    // Submit should only send members already added to the invite card
    const uniqueMembers = Array.from(
      new Map(
        mappedMembers
          .filter((m) => m.full_name && m.email)
          .map((m) => [m.email.toLowerCase(), m]),
      ).values(),
    );

    if (uniqueMembers.length === 0) {
      setSubmitError(
        "Please add members using Add More (or CSV upload) first.",
      );
      return;
    }

    try {
      setIsSubmittingMembers(true);
      await addTeamMembers(uniqueMembers);
      setSubmitSuccess("Members invited successfully.");
      setMembers([]);
      reset({ fullName: "", email: "" });
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Failed to invite members.",
      );
    } finally {
      setIsSubmittingMembers(false);
    }
  };

  const handleAddMore = async () => {
    setSubmitError("");

    const valid = await trigger(["fullName", "email"]);
    if (!valid) return;

    const values = getValues();
    const newMember = {
      id: Date.now(),
      fullName: values.fullName?.trim(),
      email: values.email?.trim(),
      status: "New user",
    };

    setMembers((prev) => [...prev, newMember]);
    reset({ fullName: "", email: "" });
  };
  return (
    <div className="min-h-screen bg-[#262626] p-10 rounded-[10px]">
      <Card className="shadow-none! border-none rounded-3xl p-0!">
        <CardContent className="p-0!">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {/* Tabs */}
            <Tabs
              defaultValue="email"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-8 flex w-full rounded-full bg-[#3F3F3F]! p-0 h-[52px] overflow-hidden">
                <TabsTrigger
                  value="email"
                  className="flex-1 rounded-full h-full text-base font-bold transition-all data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-[#FFFFFF85]! border-none!"
                >
                  Invite via Email
                </TabsTrigger>
                <TabsTrigger
                  value="csv"
                  className="flex-1 rounded-full h-full text-base font-bold transition-all data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent!  text-[#FFFFFF85]! border-none!"
                >
                  Invite via CSV
                </TabsTrigger>
              </TabsList>

              {/* Content */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <TabsContent value="email">
                    <InviteViaEmailForm
                      register={register}
                      errors={errors}
                      onAddMore={handleAddMore}
                    />
                  </TabsContent>

                  <TabsContent value="csv">
                    <InviteViaCsvForm setMembers={setMembers} />
                  </TabsContent>

                  <div className="flex items-center justify-end mt-5">
                    {submitError ? (
                      <p className="text-red-400 text-sm mr-4">{submitError}</p>
                    ) : null}
                    {submitSuccess ? (
                      <p className="text-green-400 text-sm mr-4">
                        {submitSuccess}
                      </p>
                    ) : null}
                    <Button
                      disabled={isSubmittingMembers}
                      type="submit"
                      className="bg-black! hover:bg-black/80! text-white! rounded-2xl"
                    >
                      <UserRoundPlus />{" "}
                      {isSubmittingMembers
                        ? "Adding Members..."
                        : "Add Members"}
                    </Button>
                  </div>
                </div>

                <MembersPreview members={members} setMembers={setMembers} />
              </div>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
