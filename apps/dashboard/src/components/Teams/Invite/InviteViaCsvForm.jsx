import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { useState } from "react";

export default function InviteViaCsvForm({ setMembers }) {
  const [fileName, setFileName] = useState("Browse");
  const [parseError, setParseError] = useState("");

  const downloadCsvTemplate = () => {
    const templateRows = [
      ["Full Name", "Email"],
      ["Person 1", "person1@example.com"],
      ["Person 2", "person2@example.com"],
    ];

    const csvContent = templateRows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "team-members-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parseCsvLine = (line) => {
    const cols = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];

      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cols.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }

    cols.push(current.trim());
    return cols;
  };

  const normalizeHeader = (value) =>
    value.toLowerCase().replace(/\s+/g, "").replace(/_/g, "");

  const handleFile = async (file) => {
    setParseError("");

    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      setParseError("CSV must contain a header row and at least one member row.");
      return;
    }

    const headers = parseCsvLine(lines[0]).map(normalizeHeader);
    const fullNameIndex = headers.findIndex((h) =>
      ["fullname", "full_name", "name"].includes(h),
    );
    const emailIndex = headers.findIndex((h) => h === "email");

    if (fullNameIndex === -1 || emailIndex === -1) {
      setParseError(
        "CSV headers must include Full Name and Email columns.",
      );
      return;
    }

    const parsedMembers = lines
      .slice(1)
      .map((line, idx) => {
        const cols = parseCsvLine(line);
        const fullName = (cols[fullNameIndex] || "").trim();
        const email = (cols[emailIndex] || "").trim();

        if (!fullName || !email) return null;

        return {
          id: Date.now() + idx,
          fullName,
          email,
          status: "New user",
        };
      })
      .filter(Boolean);

    if (parsedMembers.length === 0) {
      setParseError("No valid members found in CSV.");
      return;
    }

    setMembers((prev) => [...prev, ...parsedMembers]);
  };

  return (
    <div className=" text-white">
      <h2 className="text-xl font-semibold">Import Members</h2>
      <p className="text-sm text-[#E0E0E0] mt-1">
        Download the CSV template, fill it up and upload it to add members to
        your team. If a facile user with that email already exists, the member
        will be pending until the user accepts the email invite.
      </p>

      <Button
        variant="outline"
        onClick={downloadCsvTemplate}
        className="bg-transparent! text-white! border! border-white!  rounded-2xl mt-4 flex items-center gap-1"
      >
        <Download className=" h-4 w-4" />
        Download CSV Template
      </Button>

      <label className="flex p-7  flex-col items-center justify-center rounded-lg border border-dashed border-[#FFFFFF78]  mt-11">
        <Upload className=" h-11 w-11" />
        <span className="text-white my-5 max-w-[268px] w-full text-center">
          Select CSV file to upload or drag and drop it here
        </span>

        <label className="relative inline-flex max-w-36 w-full cursor-pointer">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFileName(file.name);
                handleFile(file);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer file:hidden"
          />

          <div className="w-full bg-transparent border border-white text-white p-2 rounded-md text-center">
            {fileName}
          </div>
        </label>
      </label>

      {parseError ? (
        <p className="mt-3 text-sm text-red-400">{parseError}</p>
      ) : null}
    </div>
  );
}
