import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const ContactsCard = ({ contacts = [], loading = false }) => {
  return (
    <Card className="bg-[#363636] border-none text-white rounded-xl p-6! w-full!">
      <CardContent className="p-0!">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Recent Contacts</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          {loading ? (
            <p className="text-white/40 text-sm">Loading...</p>
          ) : contacts.length === 0 ? (
            <p className="text-white/40 text-sm">No contacts yet</p>
          ) : (
            contacts.map((contact) => {
              // submitted_data may be an object with various fields
              const data = contact.submitted_data || {};
              const name = data.Name || data.name || data[Object.keys(data)[0]] || "—";
              const email = data.Email || data.email || "";
              return (
                <div key={contact.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {String(name).charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{name}</p>
                    {email && <p className="text-white/50 text-xs truncate">{email}</p>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
