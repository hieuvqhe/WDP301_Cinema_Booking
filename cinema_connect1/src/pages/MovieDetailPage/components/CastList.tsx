import type { Movie } from "../../../types/Movie.type";

export default function CastList({ movie }: { movie: Movie }) {
  return (
    <div className="mb-10">
      <p className="text-xl font-bold mb-4 text-white">Diễn viên</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
        {movie.cast.map((actor) => (
          <div
            key={actor.id}
            className="flex flex-col items-center p-3 rounded-xl bg-[#1E1E1E] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <img
              src={actor.profile_image || "/default-avatar.png"}
              alt={actor.name}
              className="w-20 h-20 object-cover rounded-full mb-3 border-2 border-orange-400 shadow-inner"
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
