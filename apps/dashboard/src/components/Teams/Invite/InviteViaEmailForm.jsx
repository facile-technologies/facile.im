import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";

export default function InviteViaEmailForm({ register, errors, onAddMore }) {
  return (
    <div className="space-y-4 text-white">
      <div className="border-b border-[#7D7D7D66] pb-5">
        <h2 className="text-xl font-semibold">Invite Member(s)</h2>
        <p className="text-sm text-[#E0E0E0] mt-1">
          Add members to your team via email. If a facile user with that email
          already exists, the member will be pending until the user accepts the
          email invite.
        </p>
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
            <div>
              <label className="text-sm mb-2 block text-[#FFFFFFCC] ">
                Full Name
              </label>
              <Input
                {...register("fullName", {
                  required: "Full name is required",
                })}
                className="bg-[#3a3a3a] border-none w-full!"
              />
              {errors?.fullName ? (
                <p className="text-red-400 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              ) : null}
              <p className="text-sm text-[#E0E0E0] mt-1">
                Please enter your first and last name. Avoid using titles or
                prefixes
              </p>
            </div>
            <div>
              <label className="text-sm mb-2 block text-[#FFFFFFCC]">
                Email
              </label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="bg-[#3a3a3a] border-none w-full!"
              />
              {errors?.email ? (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              ) : null}
              <p className="text-sm text-[#E0E0E0] mt-1">
                Please enter your valid email address. We'll send an invitation
                email to this email address.
              </p>
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={onAddMore}
          className="bg-transparent! text-white! border! border-white! rounded-2xl mt-4"
        >
          <UserRoundPlus /> Add More
        </Button>
      </div>
    </div>
  );
}
