import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TeamCreated from "./TeamCreated";
import {  useState } from "react";
import { createTeam } from "@/services/teams";

export default function CreateTeam({setTeam}) {
  const [teamCreated, setTeamCreated] = useState(false);
  const [submitError, setSubmitError] = useState("");



  console.log(teamCreated, "teamCreated");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      teamName: "",
      teamDescription: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitError("");
    try {
      const payload = {
        team_name: data.teamName,
        team_description: data.teamDescription,
      };
      await createTeam(payload);
      setTeam(payload);
   

      reset();
      setTeamCreated(true);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          "Failed to create team. Please try again.",
      );
    }
  };

  return (
    <>
      {teamCreated ? (
        <TeamCreated />
      ) : (
        <div className="min-h-screen bg-[#262626] p-10 text-white rounded-[10px]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Create New Team</h1>
            <p className="text-sm text-gray-600 dark:text-[#FFFFFFA3]">
              Setup your agency to manage users
            </p>
          </div>

          {/* Layout */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Form Card */}
              <Card className="lg:col-span-2 lg:order-1 order-2 bg-[#303030] border-none rounded-3xl p-0!">
                <CardContent className="p-6 space-y-6">
                  {/* Team Name */}
                  <div>
                    <label className="text-sm mb-2 block">Team Name</label>
                    <Input
                      className="bg-[#373636] border-none focus-visible:ring-0 rounded-2xl w-full!"
                      {...register("teamName", {
                        required: "Team name is required",
                      })}
                    />
                    {errors.teamName && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.teamName.message}
                      </p>
                    )}
                  </div>

                  {/* Team Description */}
                  <div>
                    <label className="text-sm mb-2 block">
                      Team Description
                    </label>
                    <Textarea
                      rows={6}
                      className="bg-[#373636] border-none!  focus-visible:ring-0 rounded-2xl"
                      {...register("teamDescription", {
                        required: "Description is required",
                      })}
                    />
                    {errors.teamDescription && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.teamDescription.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Right Info Card */}
              <Card className="lg:order-2 order-1 bg-[#303030] border-none rounded-3xl p-6! lg:max-w-[370px]! w-full!">
                <CardHeader className={"p-0!"}>
                  <CardTitle className="">Why create team?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed p-0!">
                  Create a team to manage members, assign roles, and collaborate
                  efficiently. Teams help you organize projects and control
                  access across your agency.
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Submit Button */}
              <div className="flex justify-end mt-6 lg:col-span-2">
                {submitError ? (
                  <p className="text-red-400 text-sm mr-4 self-center">
                    {submitError}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 bg-black! hover:bg-black/80! rounded-xl text-white! text-base!"
                >
                  {isSubmitting ? "Creating..." : "Create Team"}
                </Button>
              </div>
              <div className="" />
            </div>
          </form>
        </div>
      )}
    </>
  );
}
