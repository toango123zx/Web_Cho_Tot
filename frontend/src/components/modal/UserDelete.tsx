import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '../../config/key';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { deleteUserAPI } from '@/services/api/user';

interface IUser {
	id: number;
}

const UserDeleteModal = (props: any) => {
	const queryClient = useQueryClient();
	const { dataUser, isOpenDeleteModal, setIsOpenDeleteModal } = props;

	const mutation = useMutation({
		mutationFn: (payload: IUser) => deleteUserAPI(payload.id),
		onSuccess: () => {
			toast.success('Delete thành công');
			setIsOpenDeleteModal(false);
			queryClient.invalidateQueries({ queryKey: QUERY_KEY.getAllUser() });
		},
	});

	const handleSubmit = () => {
		if (dataUser?.id) {
			mutation.mutate({ id: dataUser?.id });
		}
	};

	if (!isOpenDeleteModal) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-white rounded-xl shadow-lg w-full max-w-lg relative p-6">
				{/* Close Button */}
				<button
					onClick={() => setIsOpenDeleteModal(false)}
					className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
				>
					<X size={20} />
				</button>

				{/* Header */}
				<h2 className="text-xl font-semibold mb-4">Delete A User</h2>

				{/* Body */}
				<p className="text-gray-700">
					Are you sure you want to delete the user:{' '}
					<span className="font-semibold">{dataUser?.email ?? ''}</span>?
				</p>

				{/* Footer */}
				<div className="flex justify-end gap-2 mt-6">
					<button
						onClick={() => setIsOpenDeleteModal(false)}
						className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
					>
						Cancel
					</button>

					<button
						onClick={handleSubmit}
						disabled={mutation.isPending}
						className={`px-4 py-2 text-white rounded-md flex items-center gap-2 ${
							mutation.isPending
								? 'bg-red-400 cursor-not-allowed'
								: 'bg-red-600 hover:bg-red-700'
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
						{mutation.isPending ? 'Deleting...' : 'Confirm'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserDeleteModal;
