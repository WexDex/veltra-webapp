"use client";

import { useState } from "react";
import { employees as initialEmployees, Employee } from "@/lib/mock-data";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmployeeCard from "@/components/employees/EmployeeCard";
import EmployeeForm from "@/components/employees/EmployeeForm";

export default function AdminEmployeesPage() {
  const [employeeList, setEmployeeList] = useState(initialEmployees);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Employee> | null>(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (e: Employee) => {
    setEditing(e);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = (data: Partial<Employee>) => {
    if (editing?.id) {
      setEmployeeList((prev) =>
        prev.map((e) =>
          e.id === editing.id ? ({ ...e, ...data } as Employee) : e
        )
      );
    } else {
      const newEmp: Employee = {
        id: String(Date.now()),
        name: data.name ?? "",
        role: data.role ?? "",
        phone: data.phone ?? "",
        created_at: new Date().toISOString(),
      };
      setEmployeeList((prev) => [newEmp, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    setEmployeeList((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Employees</h1>
          <p className="text-gray-400 text-sm mt-1">
            {employeeList.length} team members
          </p>
        </div>
        <Button onClick={openAdd}>+ Add Employee</Button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {employeeList.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing?.id ? "Edit Employee" : "Add Employee"}
      >
        <EmployeeForm
          employee={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
