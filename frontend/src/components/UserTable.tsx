import { useState } from "react";
import { useFetchUser } from "../config/fetch";
import UsersPagination from "@/components/pagination/UserPagnation";
import UserCreateModal from "@/components/modal/UserCreate";
import UserEditModal from "@/components/modal/UserEdit";
import UserDeleteModal from "@/components/modal/UserDelete";
// import { Popover } from "@/components/ui/popover";
function UsersTable() {
    interface IUser {
        id: number;
        name: string;
        email: string;
    }

    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [dataUser, setDataUser] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [activePopover, setActivePopover] = useState<number | null>(null);

    const handleEditUser = (user: any) => {
        setDataUser(user);
        setIsOpenUpdateModal(true);
    };

    const handleDelete = (user: any) => {
        setDataUser(user);
        setIsOpenDeleteModal(true);
    };

    const { isPending, error, data: users, totalPages } = useFetchUser(currentPage);

    if (isPending) return <div className="text-center mt-6">Loading...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Table Users</h2>
                <button
                    onClick={() => setIsOpenCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add New
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-md shadow">
                <table className="min-w-full table-auto bg-white border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 text-sm font-medium">
                        <tr>
                            <th className="px-4 py-2 border">Id</th>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {users?.map((user: IUser) => (
                            <tr
                                key={user.id}
                                className="border-t hover:bg-gray-50 relative"
                            >
                                <td className="px-4 py-2 border relative">
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() =>
                                            setActivePopover(activePopover === user.id ? null : user.id)
                                        }
                                    >
                                        {user.id}
                                    </button>

                                    {/* Custom Popover */}
                                    {/* {activePopover === user.id && (
                                   <Popover id={user.id} onClose={() => setActivePopover(null)} />
                                    )} */}
                                </td>
                                <td className="px-4 py-2 border">{user.name}</td>
                                <td className="px-4 py-2 border">{user.email}</td>
                                <td className="px-4 py-2 border space-x-2">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user)}
                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <UsersPagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            {/* Modals */}
            <UserCreateModal
                isOpenCreateModal={isOpenCreateModal}
                setIsOpenCreateModal={setIsOpenCreateModal}
            />
            <UserEditModal
                isOpenUpdateModal={isOpenUpdateModal}
                setIsOpenUpdateModal={setIsOpenUpdateModal}
                dataUser={dataUser}
            />
            <UserDeleteModal
                dataUser={dataUser}
                isOpenDeleteModal={isOpenDeleteModal}
                setIsOpenDeleteModal={setIsOpenDeleteModal}
            />
        </div>
    );
}

export default UsersTable;
