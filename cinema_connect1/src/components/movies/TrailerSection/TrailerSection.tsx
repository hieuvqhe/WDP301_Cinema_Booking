import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VideoPlayer from "../../VideoPlayer";
import { BiPlayCircle } from "react-icons/bi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { Movie } from "../../../types";
import { getPopularMovies } from "../../../apis/movie.api";
import BlurCircle from "../../layout/BlurCircle";

const TrailerSection = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
  };
  const [getShowingMovies, setGetShowingMovies] = useState<Movie[]>([]);
  const [currentTrailer, setCurrentTrailer] = useState<string | undefined>(
    undefined
  );
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movies = await getPopularMovies(10, 1);
        setGetShowingMovies(movies);
        if (movies.length > 0) {
          setCurrentTrailer(movies[0].trailer_url);
          setSelectedMovieId(movies[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch popular movies:", error);
      }
    };

    fetchData();
  }, []);

  const handleClickTrailer = (trailerUrl: string | undefined, movieId: string) => {
    setCurrentTrailer(trailerUrl);
    setSelectedMovieId(movieId);

    const trailerElement = document.getElementById("trailer-main");
    trailerElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="trailer-main" className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto"
      >
        Coming Soon Trailers
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mt-6"
      >
        <BlurCircle top="-100px" right="-100px" />
        <div className="mx-auto max-w-[960px] h-[540px]">
          {currentTrailer && (
            <VideoPlayer 
              src={currentTrailer} 
              classNames="w-full h-full"
              showGlow={true}
            />
          )}
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 max-w-3xl mx-auto"
      >
        <Slider {...settings}>
          {getShowingMovies.map((trailer, index) => {
            const isSelected = selectedMovieId === trailer._id;
            
            return (
              <motion.div
                key={trailer._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="px-2"
              >
                <motion.div
                  className={`relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ${
                    isSelected 
                      ? 'ring-4 ring-purple-500/60 ring-offset-2 ring-offset-gray-900 shadow-2xl shadow-purple-500/30' 
                      : 'hover:ring-2 hover:ring-white/30 hover:ring-offset-2 hover:ring-offset-gray-900'
                  }`}
                  onClick={() => handleClickTrailer(trailer.trailer_url, trailer._id)}
                  whileHover={{ 
                    scale: 1.05,
                    y: -8
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={isSelected ? {
                    scale: [1, 1.02, 1],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  } : {}}
                >
                  {/* Selected Glow Effect */}
                  {isSelected && (
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 rounded-xl blur-lg"
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}

                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-lg h-60 md:max-h-60">
                    <motion.img
                      src={trailer.poster_url}
                      alt={trailer.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isSelected 
                          ? 'brightness-100 saturate-110' 
                          : 'brightness-75 group-hover:brightness-90 group-hover:saturate-110'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 transition-all duration-500 ${
                      isSelected 
                        ? 'bg-gradient-to-t from-purple-900/50 via-transparent to-transparent' 
                        : 'bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-purple-900/40'
                    }`} />

                    {/* Play Icon */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: isSelected ? 1 : 0, 
                        opacity: isSelected ? 1 : 0 
                      }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BiPlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                    </motion.div>

                    {/* Hover Play Icon */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.2 }}
                    >
                      {!isSelected && (
                        <BiPlayCircle className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
                      )}
                    </motion.div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg"
                      >
                        Now Playing
                      </motion.div>
                    )}

                    {/* Border Animation */}
                    <motion.div
                      className="absolute inset-0 border-2 border-transparent rounded-lg"
                      animate={isSelected ? {
                        borderColor: ["rgba(168, 85, 247, 0.8)", "rgba(236, 72, 153, 0.8)", "rgba(168, 85, 247, 0.8)"],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      } : {}}
                    />
                  </div>

                  {/* Movie Title */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <h3 className={`text-sm font-medium transition-colors duration-300 ${
                      isSelected ? 'text-purple-200' : 'text-white group-hover:text-purple-200'
                    }`}>
                      {trailer.title}
                    </h3>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </Slider>
      </motion.div>
    </div>
  );
};

export default TrailerSection;
