export type District = {
	name: string
	code: number
	codename: string
	division_type: string
	province_code: number
	wards: string | null
}

export type Province = {
	name: string
	code: number
	division_type: string
	province_code: number
	codename: string
	districts: District[]
}
