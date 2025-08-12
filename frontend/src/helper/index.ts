export const trimData = <T>(data: Record<string, unknown>, removeEmpty = true) => {
	const result: Record<string, unknown> = {};

	Object.entries(data).forEach(([key, value]) => {
		if (removeEmpty && !value) {
			return;
		}

		if (typeof value !== 'string') {
			result[key] = value;
		} else {
			result[key] = value.trim();
		}
	});

	return result as T;
};

export const postStatusToText = (status: IPostStatus | string) => {
	switch (status) {
		case 'PENDING':
			return 'Chờ duyệt';
		case 'PUBLISHED':
			return 'Đang hiển thị';
		case 'EXPIRED':
			return 'Hết hạn';
		case 'DELETED':
			return 'Đã ẩn';
		default:
			return 'Tất cả';
	}
};

export function getRelativeTime(dateString: string) {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		return 'Ngày không hợp lệ';
	}
	const now = new Date();
	const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
	if (diff < 60) return 'Vừa xong';
	if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
	if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
	if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
	if (diff < 2419200) return `${Math.floor(diff / 604800)} tuần trước`;
	return date.toLocaleDateString('vi-VN');
}
