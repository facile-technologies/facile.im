import { Trash, Trash2, Trash2Icon } from "lucide-react";

export default function MembersPreview({ members, setMembers }) {
  return (
    <div className="rounded-2xl border border-[#C0C0C017] bg-[#303030] p-4 text-white">
      <h3 className="mb-4 text-lg font-semibold">Members to invite</h3>

      {members.length === 0 && (
        <p className="text-xs text-gray-400">No members added</p>
      )}

      <ul className="space-y-3">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-lg bg-transparent p-3 border border-[#3A3A3A]"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium ">{m.fullName}</p>
                {m.status && (
                  <span className="mt-1 inline-block rounded-full bg-black px-2 py-1 text-[10px] text-white">
                    {m.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A4A4A4]">{m.email}</p>
            </div>

            <button
              onClick={() =>
                setMembers((prev) => prev.filter((x) => x.id !== m.id))
              }
              className="bg-transparent!"
            >
              <Trash2Icon className="h-5 w-5 text-white hover:text-red-400 " />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
