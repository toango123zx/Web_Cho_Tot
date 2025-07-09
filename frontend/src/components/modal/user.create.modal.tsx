import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../config/key";
import { X } from "lucide-react";
import { toast } from "sonner";

interface IUser {
  name: string;
  email: string;
}

const UserCreateModal = ({ isOpenCreateModal, setIsOpenCreateModal }: any) => {
  const queryClient = useQueryClient();

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async (payload: IUser) => {
      const res = await fetch("http://localhost:8000/users", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Thành công");
      setIsOpenCreateModal(false);
      setEmail("");
      setName("");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllUser() });
    },
  });

  const handleSubmit = () => {
    if (!email) return alert("Email is empty");
    if (!name) return alert("Name is empty");
    mutation.mutate({ email, name });
  };

  if (!isOpenCreateModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl relative p-6">
        {/* Close Button */}
        <button
          onClick={() => setIsOpenCreateModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4">Add A New User</h2>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setIsOpenCreateModal(false)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className={`px-4 py-2 text-white rounded-md flex items-center gap-2 ${
              mutation.isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {mutation.isPending && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCreateModal;
