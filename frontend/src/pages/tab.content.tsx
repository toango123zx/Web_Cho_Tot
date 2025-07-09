import { useState } from "react";
import UsersTable from "pages/users.table";
function TabsContent() {
  const [activeTab, setActiveTab] = useState<"user">("user");

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Tabs Header */}
      <div className="flex space-x-4 border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("user")}
          className={`py-2 px-4 text-sm font-medium border-b-2 ${
            activeTab === "user"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Userss
        </button>
      </div>

      {/* Tabs Content */}
      <div>
        {activeTab === "user" && <UsersTable />}
      </div>
    </div>
  );
}

export default TabsContent;
