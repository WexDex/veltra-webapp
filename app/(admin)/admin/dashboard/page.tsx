import { dashboardStats, recentContacts } from "@/lib/mock-data";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <div className="w-9 h-9 rounded-xl bg-blue-700/15 flex items-center justify-center text-blue-400">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-100">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your Veltra store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatCard
          label="Total Products"
          value={dashboardStats.totalProducts}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          }
        />
        <StatCard
          label="Total Employees"
          value={dashboardStats.totalEmployees}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
        />
        <StatCard
          label="Registered Users"
          value={dashboardStats.totalUsers}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Recent Contact Submissions
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-5 py-3.5 text-gray-100 text-sm font-medium whitespace-nowrap">
                    {contact.name}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-sm max-w-xs">
                    <p className="truncate">{contact.message}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-sm whitespace-nowrap">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
