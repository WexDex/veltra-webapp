import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { DbEmployee } from "@/lib/types";

interface EmployeeCardProps {
  employee: DbEmployee;
  onEdit: (employee: DbEmployee) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  return (
    <tr className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={employee.name} size="sm" />
          <span className="text-gray-100 font-medium text-sm">{employee.name}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-gray-400 text-sm">{employee.role}</td>
      <td className="px-4 py-3.5 text-gray-400 text-sm">{employee.phone}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(employee.id)}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
