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
import { useInfinitePostQuery } from '@/services/query/post';
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

const ITEMS_PER_PAGE = 10;

export default function SearchResults() {
	const [searchParams, setSearchParams] = useSearchParams();

	// --- Local UI state & filters ---
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [showAdvanced, setShowAdvanced] = useState(false);

	// basic filters
	const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
	const [province, setProvince] = useState(searchParams.get('province') || '');

	// advanced inputs vs applied
	const [catInput, setCatInput] = useState('');
	const [catApplied, setCatApplied] = useState('');

	const [minInput, setMinInput] = useState('');
	const [maxInput, setMaxInput] = useState('');
	const [minApplied, setMinApplied] = useState('');
	const [maxApplied, setMaxApplied] = useState('');

	const [ageInput, setAgeInput] = useState('');
	const [ageApplied, setAgeApplied] = useState('');

	const [sizeInput, setSizeInput] = useState('');
	const [sizeApplied, setSizeApplied] = useState('');

	const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'title'>('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const debouncedSearch = useDebounce(searchTerm, 500);

	// --- Sync URL params → local state on mount/url-change ---
	useEffect(() => {
		const q = searchParams.get('q') || '';
		const p = searchParams.get('province') || '';
		setSearchTerm(q);
		setProvince(p);

		// reset applied + inputs
		setCatInput('');
		setCatApplied('');
		setMinInput('');
		setMaxInput('');
		setMinApplied('');
		setMaxApplied('');
		setAgeInput('');
		setAgeApplied('');
		setSizeInput('');
		setSizeApplied('');
	}, [searchParams]);

	// --- Infinite Query ---
	const {
		data,
		isFetching,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		status,
		error,
	} = useInfinitePostQuery({
		limit: ITEMS_PER_PAGE,
		search: debouncedSearch || undefined,
		province: province && province !== 'all' ? province : undefined,
		categoryId: catApplied || undefined,
		minPrice: minApplied ? parseInt(minApplied) : undefined,
		maxPrice: maxApplied ? parseInt(maxApplied) : undefined,
		age: ageApplied === 'all' ? undefined : ageApplied,
		size: sizeApplied === 'all' ? undefined : sizeApplied,
		sortBy,
		sortOrder,
	});

	const { data: catRes, isLoading: catLoading } = useGetAllCategories();

	// --- apply advanced filters ---
	const handleApply = () => {
		setCatApplied(catInput);
		setMinApplied(minInput);
		setMaxApplied(maxInput);
		setAgeApplied(ageInput);
		setSizeApplied(sizeInput);
	};

	// --- clear all ---
	const handleClear = () => {
		setSearchTerm('');
		setProvince('');
		setCatInput('');
		setCatApplied('');
		setMinInput('');
		setMaxInput('');
		setAgeInput('');
		setAgeApplied('');
		setSizeInput('');
		setSizeApplied('');
		setSortBy('createdAt');
		setSortOrder('desc');
		setSearchParams({});
	};

	// check if any filter active
	const hasFilters = !!(
		debouncedSearch ||
		province ||
		catApplied ||
		minApplied ||
		maxApplied ||
		ageApplied ||
		sizeApplied ||
		sortBy !== 'createdAt' ||
		sortOrder !== 'desc'
	);

	// flatten all pages
	const allPosts = data?.pages.flatMap((page) => (page.success ? page.data : [])) || [];

	return (
		<div className="max-w-[990px] mx-auto px-4 py-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold">Kết quả tìm kiếm</h1>
					{debouncedSearch && (
						<p className="text-gray-600 mt-1">
							Kết quả cho: "<span className="font-semibold">{debouncedSearch}</span>"
							{province && <span> tại {province}</span>}
						</p>
					)}
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant={viewMode === 'grid' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setViewMode('grid')}
					>
						<Grid className="w-4 h-4" />
					</Button>
					<Button
						variant={viewMode === 'list' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setViewMode('list')}
					>
						<ListIcon className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Filters */}
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row gap-4">
					{/* Search */}
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="Tìm kiếm bài đăng..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
						{isFetching && (
							<div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin w-4 h-4 border-b-2 border-gray-600 rounded-full" />
						)}
					</div>

					{/* Province */}
					<div className="w-full sm:w-64">
						<Select value={province} onValueChange={(v) => setProvince(v)}>
							<SelectTrigger>
								<Filter className="w-4 h-4 mr-2" />
								<SelectValue placeholder="Chọn tỉnh/thành" />
							</SelectTrigger>
							<SelectContent className="max-h-60 overflow-y-auto">
								<SelectItem value="all">Tất cả</SelectItem>
								{provincesData.map((p) => (
									<SelectItem key={p.code} value={p.name}>
										{p.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Category */}
					<div className="w-full sm:w-64">
						<Select value={catInput} onValueChange={setCatInput} disabled={catLoading}>
							<SelectTrigger>
								<Filter className="w-4 h-4 mr-2" />
								<SelectValue placeholder={catLoading ? 'Đang tải...' : 'Danh mục'} />
							</SelectTrigger>
							<SelectContent className="max-h-60 overflow-y-auto">
								<SelectItem value="all">Tất cả</SelectItem>
								{catRes?.success &&
									catRes.data.map((c) => (
										<SelectItem key={c.id} value={c.id}>
											{c.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					{/* Clear */}
					{hasFilters && (
						<Button variant="outline" onClick={handleClear} className="shrink-0">
							<X className="w-4 h-4 mr-2" />
							Xóa bộ lọc
						</Button>
					)}
				</div>

				{/* Advanced Toggle */}
				<div className="flex justify-between">
					<Button
						variant="outline"
						onClick={() => setShowAdvanced(!showAdvanced)}
						className="flex items-center gap-2"
					>
						<SlidersHorizontal className="w-4 h-4" /> Bộ lọc nâng cao
						{showAdvanced ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}
					</Button>
				</div>

				{/* Advanced */}
				{showAdvanced && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
						{/* Price */}
						<div>
							<label className="block text-sm">Khoảng giá</label>
							<div className="flex gap-2">
								<Input
									type="number"
									placeholder="Từ"
									value={minInput}
									onChange={(e) => setMinInput(e.target.value)}
									className="text-sm"
								/>
								<Input
									type="number"
									placeholder="Đến"
									value={maxInput}
									onChange={(e) => setMaxInput(e.target.value)}
									className="text-sm"
								/>
							</div>
						</div>
						{/* Age */}
						<div>
							<label className="block text-sm">Độ tuổi</label>
							<Select value={ageInput} onValueChange={setAgeInput}>
								<SelectTrigger className="text-sm">
									<SelectValue placeholder="Chọn độ tuổi" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả</SelectItem>
									{AGE_OPTIONS.map((a) => (
										<SelectItem key={a.value} value={a.value}>
											{a.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{/* Size */}
						<div>
							<label className="block text-sm">Kích thước</label>
							<Select value={sizeInput} onValueChange={setSizeInput}>
								<SelectTrigger className="text-sm">
									<SelectValue placeholder="Chọn kích thước" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả</SelectItem>
									{SIZE_OPTIONS.map((s) => (
										<SelectItem key={s.value} value={s.value}>
											{s.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{/* Sort */}
						<div>
							<label className="block text-sm">Sắp xếp</label>
							<div className="flex gap-2">
								<Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
									<SelectTrigger className="text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SORT_OPTIONS.map((o) => (
											<SelectItem key={o.value} value={o.value}>
												{o.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
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
						{/* Apply */}
						<div className="col-span-full flex justify-end">
							<Button onClick={handleApply}>Áp dụng</Button>
						</div>
					</div>
				)}
			</div>

			{/* Results */}
			<div className="space-y-4">
				{status === 'error' && (
					<div className="text-red-500">Có lỗi: {(error as any).message}</div>
				)}

				{/* No results */}
				{status === 'success' && allPosts.length === 0 && (
					<div className="text-center text-gray-500 py-12">Không có kết quả</div>
				)}

				{/* Grid/List */}
				<div
					className={
						viewMode === 'grid'
							? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
							: 'space-y-4'
					}
				>
					{allPosts.map((post) => (
						<PostCard key={post.id} post={post} viewMode={viewMode} />
					))}
					{isFetching &&
						Array.from({
							length: ITEMS_PER_PAGE - (allPosts.length % ITEMS_PER_PAGE),
						}).map((_, idx) => <PostCard.Skeleton key={idx} viewMode={viewMode} />)}
				</div>

				{/* Load more */}
				{hasNextPage && (
					<div className="flex justify-center pt-6">
						<Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
							{isFetchingNextPage ? 'Đang tải...' : 'Tải thêm'}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
