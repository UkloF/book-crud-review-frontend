export interface Review {
  id: number;
  rating: number;
  content: string;
  bookId: number;
}
export interface Book {
  id: number;
  title: string;
  author: string;
  publishedAt: string;
  coverUrl: string | null;
  reviews: Review[];
}
export function average(reviews: Review[]) {
  return reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : null;
}
