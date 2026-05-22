"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmployeeCard from "@/components/employees/EmployeeCard";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { DbEmployee } from "@/lib/types";

export default function AdminEmployeesPage() {
  const [employeeList, setEmployeeList] = useState<DbEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<DbEmployee> | null>(null);

  const fetchEmployees = () => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((data) => { setEmployeeList(data); setLoading(false); });
  };

  useEffect(() => { fetchEmployees(); }, []);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (e: DbEmployee) => { setEditing(e); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = async (data: Partial<DbEmployee>) => {
    if (editing?.id) {
      await fetch(`/api/employees/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    closeModal();
    fetchEmployees();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    fetchEmployees();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Employees</h1>
          <p className="text-gray-400 text-sm mt-1">{employeeList.length} team members</p>
        </div>
        <Button onClick={openAdd}>+ Add Employee</Button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-500 py-12 text-sm">Loading...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {employeeList.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing?.id ? "Edit Employee" : "Add Employee"}>
        <EmployeeForm employee={editing ?? undefined} onSubmit={handleSubmit} onCancel={closeModal} />
      </Modal>
    </div>
  );
}
