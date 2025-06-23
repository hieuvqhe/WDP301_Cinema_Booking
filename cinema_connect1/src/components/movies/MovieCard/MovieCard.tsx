import { useState } from "react";
import { Button } from "../../ui/button";
import { Play, Star, Clock, Calendar, Ticket } from "lucide-react";
import { TrailerModal } from "../TrailerModal/TrailerModal";
import type { Movie } from "../../../types/Movie.type";
import { getCountryDisplay } from "../../../const/language";

interface MovieCardProps {
  movie: Movie;
  onBookTicket?: (movieId: string) => void; // Giữ lại cho button đặt vé chính
  variant?: 'default' | 'featured';
}

export const MovieCard = ({ movie, onBookTicket, variant = 'default' }: MovieCardProps) => {
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes} phút`;
  };

  // Format release date
  const formatReleaseDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Get status label in Vietnamese
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'now_showing':
        return 'Đang chiếu';
      case 'coming_soon':
        return 'Sắp chiếu';
      case 'ended':
        return 'Đã kết thúc';
      default:
        return status;
    }
  };
  if (variant === 'featured') {
    return (
      <div className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-75 transition-all duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x450/374151/ffffff?text=No+Image';
            }}
          />
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
            FEATURED
          </div>          <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded flex items-center shadow-md">
            <Star size={12} className="text-yellow-400 mr-1" />
            <span className="text-xs">
              {movie.average_rating > 0 ? movie.average_rating.toFixed(1) : 'Chưa có đánh giá'}
            </span>
          </div>{/* Quick book button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={() => setIsTrailerModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300"
              size="sm"
            >
              <Play size={14} className="mr-1" />
              Xem trailer
            </Button>
          </div>
        </div>        <div className="p-3">
          <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">
            {movie.title}
          </h4>
          <p className="text-gray-400 text-xs line-clamp-1">
            {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
          </p>
        </div>

        {/* Trailer Modal */}
        <TrailerModal
          isOpen={isTrailerModalOpen}
          onClose={() => setIsTrailerModalOpen(false)}
          movie={movie}
          onBookTicket={onBookTicket}
        />
      </div>
    );
  }
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-50 transition-all duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x450/374151/ffffff?text=No+Image';
          }}
        />        {/* Overlay button chỉ xuất hiện khi hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={() => setIsTrailerModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300"
            size="sm"
          >
            <Play size={16} className="mr-2" />
            Xem trailer
          </Button>
        </div>        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded flex items-center">
          <Star size={14} className="text-yellow-400 mr-1" />
          <span className="text-sm">
            {movie.average_rating > 0 ? movie.average_rating.toFixed(1) : 'N/A'}
          </span>
          {movie.ratings_count > 0 && (
            <span className="text-xs text-gray-300 ml-1">({movie.ratings_count})</span>
          )}
        </div>
        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
          {getStatusLabel(movie.status)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-sm mb-2 line-clamp-1">
          {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
        </p>

        <div className="flex items-center text-gray-400 text-sm mb-3">
          <Clock size={14} className="mr-1" />
          <span>{formatDuration(movie.duration)}</span>
          <span className="mx-2">•</span>
          <span className="text-orange-400 font-medium">
            {getCountryDisplay(movie.language)}
          </span>
        </div>

        <div className="flex items-center text-gray-400 text-sm mb-4">
          <Calendar size={14} className="mr-1" />
          <span>Khởi chiếu: {formatReleaseDate(movie.release_date)}</span>
        </div>        <Button
          onClick={() => onBookTicket?.(movie._id)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Ticket size={16} className="mr-2" />
          Đặt vé ngay
        </Button>
      </div>      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerModalOpen}
        onClose={() => setIsTrailerModalOpen(false)}
        movie={movie}
        onBookTicket={onBookTicket}
      />
    </div>
  );
};
