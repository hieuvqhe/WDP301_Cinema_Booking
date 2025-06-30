import type { Movie } from "../../../types/Movie.type";

export default function CastList({ movie }: { movie: Movie }) {
  return (
    <div className="mb-4">
      <p className="text-lg font-semibold mb-2">Diễn viên</p>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {movie.cast.map((actor) => (
          <div key={actor.id} className="flex flex-col items-center p-1">
            <img
              src={actor.profile_image || "/default-avatar.png"}
              alt={actor.name}
              className="w-24 h-24 object-cover rounded-full mb-3 border-2 border-gray-600"
            />
            <div className="text-white font-semibold text-sm text-center">
              {actor.name}
            </div>
            <div className="text-gray-400 text-xs italic text-center">
              {actor.character}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
