export type Theater = {
  _id: string;
  name: string;
  location: string;
};

export type Screen = {
  _id: string;
  name: string;
  screen_type: string;
};

export type Showtime = {
  _id: string;
  movie_id: string;
  screen_id: string;
  theater_id: string;
  start_time: Date;
  end_time: Date;
  price: {
    regular: number;
    premium: number;
    recliner: number;
    couple: number;
  };
  available_seats: number;
  status: "booking_open" | "booking_closed" | "completed" | string;
  movie: any | null;
  theater: Theater | null;
  screen: Screen | null;
};