export interface Review{
   reviewId: number;
   productId: number;
   userId: number;
   rating: number;
   reviewText: string;
   createdAt: string;
}

export interface ReviewDTO{
   productId: number;
   userId: number;
   rating: number;
   reviewText: string;
}