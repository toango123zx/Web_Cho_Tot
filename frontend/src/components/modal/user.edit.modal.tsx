import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../config/key";
import { X } from "lucide-react";
import { toast } from "sonner";

interface IUser {
  id: number;
  name: string;
  email: string;
}

const UserEditModal = (props: any) => {
  const queryClient = useQueryClient();
  const { isOpenUpdateModal, setIsOpenUpdateModal, dataUser } = props;

  const [id, setId] = useState<number | undefined>(undefined);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (dataUser?.id) {
      setId(dataUser.id);
      setEmail(dataUser.email);
      setName(dataUser.name);
    }
  }, [dataUser]);

  const mutation = useMutation({
    mutationFn: async (payload: IUser) => {
      const res = await fetch(`http://localhost:8000/users/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify({
          email: payload.email,
          name: payload.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Update thành công");
      setIsOpenUpdateModal(false);
      setEmail("");
      setName("");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllUser() });
    },
  });

  const handleSubmit = () => {
    if (!email) return alert("Email is empty");
    if (!name) return alert("Name is empty");
    if (id) {
      mutation.mutate({ id, email, name });
    }
  };

  if (!isOpenUpdateModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl relative p-6">
        {/* Close Button */}
        <button
          onClick={() => setIsOpenUpdateModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4">Update A User</h2>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setIsOpenUpdateModal(false)}
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
            {mutation.isPending ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
