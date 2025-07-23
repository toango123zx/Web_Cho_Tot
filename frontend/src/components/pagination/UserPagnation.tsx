interface IProps {
	totalPages: number;
	currentPage: number;
	setCurrentPage: (v: number) => void;
}

const UsersPagination = ({ totalPages, currentPage, setCurrentPage }: IProps) => {
	if (totalPages <= 0) return null;

	return (
		<div className="flex justify-center mt-6">
			<nav className="inline-flex items-center space-x-1">
				{/* Prev button */}
				<button
					onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
					disabled={currentPage === 1}
					className={`px-3 py-1 rounded-md border text-sm ${
						currentPage === 1
							? 'bg-gray-100 text-gray-400 cursor-not-allowed'
							: 'bg-white text-gray-700 hover:bg-gray-100'
					}`}
				>
					Prev
				</button>

				{/* Page numbers */}
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
					<button
						key={page}
						onClick={() => setCurrentPage(page)}
						className={`px-3 py-1 rounded-md border text-sm ${
							currentPage === page
								? 'bg-blue-500 text-white'
								: 'bg-white text-gray-700 hover:bg-gray-100'
						}`}
					>
						{page}
					</button>
				))}

				{/* Next button */}
				<button
					onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`px-3 py-1 rounded-md border text-sm ${
						currentPage === totalPages
							? 'bg-gray-100 text-gray-400 cursor-not-allowed'
							: 'bg-white text-gray-700 hover:bg-gray-100'
					}`}
				>
					Next
				</button>
			</nav>
		</div>
	);
};

export default UsersPagination;
