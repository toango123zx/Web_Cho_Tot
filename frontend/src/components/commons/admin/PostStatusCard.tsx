import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type IPostStatus = 'ALL' | 'PENDING' | 'PUBLISHED' | 'EXPIRED' | 'DELETED' | string;

type Props = {
	status: IPostStatus;
	onChange: (value: IPostStatus) => void;
};

export function PostStatusTabs({ status, onChange }: Props) {
	return (
		<Tabs value={status} onValueChange={onChange} className="w-full">
			<TabsList className="flex flex-wrap gap-2">
				{['ALL', 'PENDING', 'PUBLISHED', 'EXPIRED', 'DELETED'].map((s) => (
					<TabsTrigger
						key={s}
						value={s}
						className="text-xs sm:text-sm px-4 py-2 rounded-full border shadow-sm cursor-pointer"
					>
						{s === 'ALL' ? 'Tất cả' : s}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
