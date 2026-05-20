"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Employee } from "@/lib/mock-data";

interface EmployeeFormProps {
  employee?: Partial<Employee>;
  onSubmit: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [form, setForm] = useState({
    name: employee?.name ?? "",
    role: employee?.role ?? "",
    phone: employee?.phone ?? "",
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <Input
        label="Full Name"
        id="name"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        placeholder="e.g. Sarah Bennett"
        required
      />
      <Input
        label="Role / Position"
        id="role"
        value={form.role}
        onChange={(e) => set("role", e.target.value)}
        placeholder="e.g. Head of Sales"
        required
      />
      <Input
        label="Phone Number"
        id="phone"
        value={form.phone}
        onChange={(e) => set("phone", e.target.value)}
        placeholder="+1 (555) 000-0000"
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Employee</Button>
      </div>
    </form>
  );
}
