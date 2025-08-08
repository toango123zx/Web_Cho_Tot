import { PostCard } from '@/components/commons/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce.hook';
import provincesData from '@/json/provinces.json';
import { useGetAllCategories } from '@/services/query/category';
import { usePostQueryWithPagination } from '@/services/query/post';
import {
	ChevronDown,
	ChevronUp,
	Filter,
	Grid,
	List as ListIcon,
	Search,
	SlidersHorizontal,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AGE_OPTIONS, SIZE_OPTIONS, SORT_OPTIONS } from './admin/PostManagement';

const ITEMS_PER_PAGE = 20;

export default function SearchResults() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [page, setPage] = useState(1);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

	// Basic filters from URL params
	const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
	const [selectedProvince, setSelectedProvince] = useState(
		searchParams.get('province') || '',
	);

	// Advanced filters - separate applied and input states
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [appliedCategory, setAppliedCategory] = useState<string>('');

	// Price inputs (not applied immediately)
	const [minPriceInput, setMinPriceInput] = useState<string>('');
	const [maxPriceInput, setMaxPriceInput] = useState<string>('');
	// Applied price filters
	const [appliedMinPrice, setAppliedMinPrice] = useState<string>('');
	const [appliedMaxPrice, setAppliedMaxPrice] = useState<string>('');

	const [selectedAge, setSelectedAge] = useState<string>('');
	const [appliedAge, setAppliedAge] = useState<string>('');

	const [selectedSize, setSelectedSize] = useState<string>('');
	const [appliedSize, setAppliedSize] = useState<string>('');

	const [sortBy, setSortBy] = useState<string>('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	// For load more functionality
	const [allPosts, setAllPosts] = useState<any[]>([]);

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const { data: postResponse, isFetching: loading } = usePostQueryWithPagination({
		page,
		limit: ITEMS_PER_PAGE,
		status: 'PUBLISHED',
		search: debouncedSearchTerm || undefined,
		categoryId: appliedCategory || undefined,
		minPrice: appliedMinPrice ? parseInt(appliedMinPrice) : undefined,
		maxPrice: appliedMaxPrice ? parseInt(appliedMaxPrice) : undefined,
		age: appliedAge === 'all' ? undefined : appliedAge,
		size: appliedSize === 'all' ? undefined : appliedSize,
		province: selectedProvince === 'all' ? undefined : selectedProvince,
		sortBy: sortBy as 'createdAt' | 'price' | 'title',
		sortOrder,
	});

	const { data: categoriesResponse, isLoading: categoriesLoading } =
		useGetAllCategories();

	// Extract URL params for effect dependencies
	const urlSearchTerm = searchParams.get('q') || '';
	const urlProvince = searchParams.get('province') || '';

	// Sync search term with URL params on mount
	useEffect(() => {
		console.log('URL changed:', {
			urlSearchTerm,
			urlProvince,
			currentSearchTerm: searchTerm,
		});
		setSearchTerm(urlSearchTerm);
		setSelectedProvince(urlProvince);
		// Reset posts immediately when URL search term changes
		setAllPosts([]);
		setPage(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [urlSearchTerm, urlProvince]);

	// Update all posts when new data is fetched
	useEffect(() => {
		console.log('Post response changed:', {
			success: postResponse?.success,
			dataLength: postResponse?.success ? postResponse.data?.length : 0,
			page,
			debouncedSearchTerm,
		});
		if (postResponse?.success) {
			if (page === 1) {
				// First page - replace all posts
				setAllPosts(postResponse.data);
			} else {
				// Subsequent pages - append to existing posts
				setAllPosts((prev) => [...prev, ...postResponse.data]);
			}
		}
	}, [postResponse, page, debouncedSearchTerm]);

	// Reset page and posts when applied filters change (not including search term which is handled above)
	useEffect(() => {
		setPage(1);
		setAllPosts([]);
	}, [
		appliedCategory,
		appliedMinPrice,
		appliedMaxPrice,
		appliedAge,
		appliedSize,
		selectedProvince,
		sortBy,
		sortOrder,
	]);

	const handleApplyFilters = () => {
		setAppliedCategory(selectedCategory);
		setAppliedMinPrice(minPriceInput);
		setAppliedMaxPrice(maxPriceInput);
		setAppliedAge(selectedAge);
		setAppliedSize(selectedSize);
		setPage(1);
		setAllPosts([]);
	};

	const handleLoadMore = () => {
		if (
			postResponse?.success &&
			postResponse.pagination.currentPage < postResponse.pagination.totalPages
		) {
			setPage((prev) => prev + 1);
		}
	};

	const handleClearFilters = () => {
		setSearchTerm('');
		setSelectedProvince('');
		setSelectedCategory('');
		setMinPriceInput('');
		setMaxPriceInput('');
		setSelectedAge('');
		setSelectedSize('');
		setSortBy('createdAt');
		setSortOrder('desc');
		setPage(1);
		setAllPosts([]);
		// Clear applied filters
		setAppliedCategory('');
		setAppliedMinPrice('');
		setAppliedMaxPrice('');
		setAppliedAge('');
		setAppliedSize('');
		setSearchParams({});
	};

	const handleProvinceChange = (value: string) => {
		setSelectedProvince(value);
		setPage(1);
	};

	const formatPrice = (price: string) => {
		if (!price) return '';
		return parseInt(price).toLocaleString('vi-VN');
	};

	const hasActiveFilters =
		debouncedSearchTerm ||
		selectedProvince ||
		appliedCategory ||
		appliedMinPrice ||
		appliedMaxPrice ||
		appliedAge ||
		appliedSize;

	return (
		<div className="container mx-auto px-4 py-6 space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold">Kết quả tìm kiếm</h1>
					{debouncedSearchTerm && (
						<p className="text-gray-600 mt-1">
							Kết quả cho: "<span className="font-semibold">{debouncedSearchTerm}</span>"
							{selectedProvince && <span> tại {selectedProvince}</span>}
						</p>
					)}
				</div>

				{/* View Mode Toggle */}
				<div className="flex items-center gap-2">
					<Button
						variant={viewMode === 'grid' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setViewMode('grid')}
					>
						<Grid className="h-4 w-4" />
					</Button>
					<Button
						variant={viewMode === 'list' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setViewMode('list')}
					>
						<ListIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Search and Filter Section */}
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row gap-4">
					{/* Search Input */}
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Tìm kiếm bài đăng..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
						{loading && (
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
							</div>
						)}
					</div>

					{/* Province Filter */}
					<div className="w-full sm:w-64">
						<Select value={selectedProvince} onValueChange={handleProvinceChange}>
							<SelectTrigger>
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Chọn tỉnh/thành" />
							</SelectTrigger>
							<SelectContent className="max-h-[300px] overflow-y-auto">
								<SelectItem value="all">Tất cả tỉnh/thành</SelectItem>
								{provincesData.map((province) => (
									<SelectItem key={province.code} value={province.name}>
										{province.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Category Filter */}
					<div className="w-full sm:w-64">
						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
							disabled={categoriesLoading}
						>
							<SelectTrigger>
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue
									placeholder={categoriesLoading ? 'Đang tải...' : 'Lọc theo danh mục'}
								/>
							</SelectTrigger>
							<SelectContent className="max-h-[300px] overflow-y-auto">
								<SelectItem value="all">Tất cả danh mục</SelectItem>
								{categoriesResponse?.success &&
									categoriesResponse.data.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					{/* Clear Filters */}
					{hasActiveFilters && (
						<Button variant="outline" onClick={handleClearFilters} className="shrink-0">
							<X className="h-4 w-4 mr-2" />
							Xóa bộ lọc
						</Button>
					)}
				</div>

				{/* Advanced Filters Toggle */}
				<div className="flex items-center justify-between">
					<Button
						variant="outline"
						onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
						className="flex items-center gap-2"
					>
						<SlidersHorizontal className="h-4 w-4" />
						Bộ lọc nâng cao
						{showAdvancedFilters ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</Button>
				</div>

				{/* Advanced Filters */}
				{showAdvancedFilters && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
						{/* Price Range */}
						<div className="space-y-2">
							<label className="text-sm font-medium">Khoảng giá</label>
							<div className="flex gap-2">
								<Input
									placeholder="Từ"
									type="number"
									value={minPriceInput}
									onChange={(e) => setMinPriceInput(e.target.value)}
									className="text-sm"
								/>
								<Input
									placeholder="Đến"
									type="number"
									value={maxPriceInput}
									onChange={(e) => setMaxPriceInput(e.target.value)}
									className="text-sm"
								/>
							</div>
						</div>

						{/* Age Filter */}
						<div className="space-y-2">
							<label className="text-sm font-medium">Độ tuổi</label>
							<Select value={selectedAge} onValueChange={setSelectedAge}>
								<SelectTrigger className="text-sm">
									<SelectValue placeholder="Chọn độ tuổi" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả</SelectItem>
									{AGE_OPTIONS.map((age) => (
										<SelectItem key={age.value} value={age.value}>
											{age.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Size Filter */}
						<div className="space-y-2">
							<label className="text-sm font-medium">Kích thước</label>
							<Select value={selectedSize} onValueChange={setSelectedSize}>
								<SelectTrigger className="text-sm">
									<SelectValue placeholder="Chọn kích thước" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả</SelectItem>
									{SIZE_OPTIONS.map((size) => (
										<SelectItem key={size.value} value={size.value}>
											{size.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Sort Options */}
						<div className="space-y-2">
							<label className="text-sm font-medium">Sắp xếp theo</label>
							<div className="flex gap-2">
								<Select value={sortBy} onValueChange={setSortBy}>
									<SelectTrigger className="text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SORT_OPTIONS.map((sort) => (
											<SelectItem key={sort.value} value={sort.value}>
												{sort.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select
									value={sortOrder}
									onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
								>
									<SelectTrigger className="text-sm w-24">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="desc">Giảm dần</SelectItem>
										<SelectItem value="asc">Tăng dần</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Apply Filters Button */}
						<div className="col-span-full flex justify-end pt-4">
							<Button onClick={handleApplyFilters} className="px-6">
								Áp dụng bộ lọc
							</Button>
						</div>
					</div>
				)}

				{/* Active Filters Display */}
				{hasActiveFilters && (
					<div className="flex flex-wrap gap-2 text-sm text-gray-600">
						<span>Bộ lọc đang áp dụng:</span>
						{debouncedSearchTerm && (
							<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
								Tìm kiếm: "{debouncedSearchTerm}"
							</span>
						)}
						{selectedProvince && (
							<span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
								Tỉnh: {selectedProvince}
							</span>
						)}
						{appliedCategory && categoriesResponse?.success && (
							<span className="bg-green-100 text-green-800 px-2 py-1 rounded">
								Danh mục:{' '}
								{categoriesResponse.data.find((cat) => cat.id === appliedCategory)?.name}
							</span>
						)}
						{(appliedMinPrice || appliedMaxPrice) && (
							<span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
								Giá: {formatPrice(appliedMinPrice) || '0'} -{' '}
								{formatPrice(appliedMaxPrice) || '∞'} VNĐ
							</span>
						)}
						{appliedAge && (
							<span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
								Tuổi: {AGE_OPTIONS.find((age) => age.value === appliedAge)?.label}
							</span>
						)}
						{appliedSize && (
							<span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
								Kích thước:{' '}
								{SIZE_OPTIONS.find((size) => size.value === appliedSize)?.label}
							</span>
						)}
						{(sortBy !== 'createdAt' || sortOrder !== 'desc') && (
							<span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
								Sắp xếp: {SORT_OPTIONS.find((sort) => sort.value === sortBy)?.label} (
								{sortOrder === 'desc' ? 'Giảm dần' : 'Tăng dần'})
							</span>
						)}
					</div>
				)}
			</div>

			{/* Results Section */}
			<div className="space-y-4">
				{/* Results Summary */}
				{!loading && postResponse?.success && allPosts.length > 0 && (
					<div className="flex items-center justify-between">
						<div className="text-sm text-gray-600">
							Hiển thị {allPosts.length} trong tổng số
							{postResponse.pagination.totalItems} kết quả
							{hasActiveFilters && ' phù hợp với bộ lọc'}
						</div>
					</div>
				)}

				{/* Loading Skeleton */}
				{loading && (
					<div
						className={
							viewMode === 'grid'
								? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
								: 'space-y-4'
						}
					>
						{Array.from({ length: 8 }).map((_, index) => (
							<div
								key={index}
								className={`rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse ${
									viewMode === 'list' ? 'h-32 flex' : 'h-[400px]'
								}`}
							>
								<div
									className={
										viewMode === 'list'
											? 'w-32 bg-gray-200 rounded-l-lg'
											: 'h-48 bg-gray-200 rounded-t-lg'
									}
								/>
								<div className="p-4 space-y-3 flex-1">
									<div className="h-4 bg-gray-200 rounded w-3/4" />
									<div className="h-4 bg-gray-200 rounded w-1/2" />
									<div className="h-4 bg-gray-200 rounded w-1/4" />
								</div>
							</div>
						))}
					</div>
				)}

				{/* Error State */}
				{!loading && !postResponse?.success && (
					<div className="text-center py-12">
						<div className="text-red-500 mb-2">
							{postResponse?.message || 'Có lỗi xảy ra khi tải dữ liệu'}
						</div>
						<Button variant="outline" onClick={() => window.location.reload()}>
							Thử lại
						</Button>
					</div>
				)}

				{/* No Results */}
				{!loading && postResponse?.success && allPosts.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-500 mb-4">
							{hasActiveFilters
								? 'Không tìm thấy kết quả nào phù hợp với bộ lọc của bạn'
								: 'Không có bài đăng nào để hiển thị'}
						</div>
						{hasActiveFilters && (
							<Button variant="outline" onClick={handleClearFilters}>
								Xóa tất cả bộ lọc
							</Button>
						)}
					</div>
				)}

				{/* Results Grid/List */}
				{allPosts.length > 0 && (
					<div
						className={
							viewMode === 'grid'
								? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
								: 'space-y-4'
						}
					>
						{allPosts.map((post) => (
							<PostCard key={post.id} post={post} viewMode={viewMode} />
						))}
					</div>
				)}

				{/* Load More Button */}
				{!loading && postResponse?.success && allPosts.length > 0 && (
					<div className="flex items-center justify-center gap-4 pt-6">
						<div className="text-sm text-muted-foreground">
							Hiển thị {allPosts.length} trong tổng số{' '}
							{postResponse.pagination.totalItems} kết quả
						</div>
						{postResponse.pagination.currentPage < postResponse.pagination.totalPages && (
							<Button variant="outline" onClick={handleLoadMore} disabled={loading}>
								{loading ? 'Đang tải...' : 'Tải thêm'}
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
