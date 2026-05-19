import { API_ROUTES } from "@/constants";
import { apiClient } from "@/lib/axios";
import type {
	ApiResponse,
	Booking,
	CreateBookingDto,
	PaginatedBookings,
} from "@/types";

interface BookingListParams {
	page?: number;
	per_page?: number;
	status?: string;
	resource_id?: number;
	from?: string;
	to?: string;
}

export const bookingService = {
	list: async (params?: BookingListParams): Promise<PaginatedBookings> => {
		const { data } = await apiClient.get<PaginatedBookings>(
			API_ROUTES.BOOKINGS.LIST,
			{ params },
		);
		return data;
	},

	myBookings: async (
		params?: BookingListParams,
	): Promise<PaginatedBookings> => {
		const { data } = await apiClient.get<PaginatedBookings>(
			API_ROUTES.BOOKINGS.MY,
			{ params },
		);
		return data;
	},

	get: async (id: number): Promise<Booking> => {
		const { data } = await apiClient.get<ApiResponse<Booking>>(
			API_ROUTES.BOOKINGS.DETAIL(id),
		);
		return data.data;
	},

	create: async (payload: CreateBookingDto): Promise<Booking> => {
		const { data } = await apiClient.post<ApiResponse<Booking>>(
			API_ROUTES.BOOKINGS.CREATE,
			payload,
		);
		return data.data;
	},

	cancel: async (id: number): Promise<Booking> => {
		const { data } = await apiClient.post<ApiResponse<Booking>>(
			API_ROUTES.BOOKINGS.CANCEL(id),
		);
		return data.data;
	},

	approve: async (id: number): Promise<Booking> => {
		const { data } = await apiClient.post<ApiResponse<Booking>>(
			API_ROUTES.BOOKINGS.APPROVE(id),
		);
		return data.data;
	},

	reject: async (id: number, reject_reason?: string): Promise<Booking> => {
		const { data } = await apiClient.post<ApiResponse<Booking>>(
			API_ROUTES.BOOKINGS.REJECT(id),
			{ reject_reason },
		);
		return data.data;
	},

	update: async (
		id: number,
		payload: Partial<CreateBookingDto>,
	): Promise<Booking> => {
		const { data } = await apiClient.put<ApiResponse<Booking>>(
			API_ROUTES.BOOKINGS.UPDATE(id),
			payload,
		);
		return data.data;
	},
};
