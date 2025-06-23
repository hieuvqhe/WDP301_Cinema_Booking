import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import MainLayout from "../../components/layout/MainLayout";
import {
  TrendingUp
} from "lucide-react";
import { 
  getAllMovies, 
  getMoviesByStatus,
  searchMovies 
} from "../../apis/movie.api";
import { getHomeSliderBanners } from "../../apis/banner.api";
import type { Movie } from "../../types/Movie.type";
import type { Banner } from "../../types/Banner.type";
import { toast } from "sonner";
import { SearchAndFilter, MovieGrid } from "../../components/movies";
import { HeroBannerCarousel } from "../../components/banners";

const HomePage = () => {
  const navigate = useNavigate();
    // States for movie and banner data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBannersLoading, setIsBannersLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
    // Filter and search states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
    // Refs for debouncing
  const searchTimeoutRef = useRef<number | null>(null);
  // Fetch movies and banners data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsBannersLoading(true);        // Fetch banners and now showing movies in parallel
        console.log('Starting to fetch data...');        const [bannersData, nowShowingData] = await Promise.all([
          // Chỉ sử dụng API endpoint thật
          getHomeSliderBanners().catch(err => {
            console.error('Banner fetch failed:', err);
            return []; // Return empty array if API fails
          }),
          getMoviesByStatus('now_showing', 12)
        ]);
        
        console.log('Banners data:', bannersData);
        console.log('Movies data:', nowShowingData);
        
        setBanners(bannersData);
        setMovies(nowShowingData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu');
      } finally {
        setIsLoading(false);
        setIsBannersLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle category filter
  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    try {
      setIsLoading(true);
      let filteredMovies: Movie[] = [];
      
      if (categoryId === 'all') {
        filteredMovies = await getMoviesByStatus('now_showing', 12);
      } else {
        // Filter by genre
        const response = await getAllMovies({
          genre: categoryId,
          status: 'now_showing',
          limit: 12
        });
        filteredMovies = response.result.movies;
      }
      
      setMovies(filteredMovies);
    } catch (error) {
      console.error('Error filtering movies:', error);
      toast.error('Không thể lọc phim theo thể loại');
    } finally {
      setIsLoading(false);
    }
  };
  // Handle search with debounce
  const handleSearchChange = (searchValue: string) => {
    setSearchTerm(searchValue);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchValue);
    }, 500);
  };

  // Handle search
  const handleSearch = async (searchValue: string) => {    
    if (!searchValue.trim()) {
      // Reset to default movies if search is cleared
      handleCategoryChange(selectedCategory);
      return;
    }
    
    try {
      setIsSearching(true);
      const searchResults = await searchMovies(searchValue, 12);
      setMovies(searchResults);
    } catch (error) {
      console.error('Error searching movies:', error);
      toast.error('Không thể tìm kiếm phim');
    } finally {
      setIsSearching(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    handleCategoryChange('all');
  };
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "Action", name: "Hành động" },
    { id: "Drama", name: "Chính kịch" },
    { id: "Comedy", name: "Hài kịch" },
    { id: "Horror", name: "Kinh dị" },
    { id: "Romance", name: "Lãng mạn" },
    { id: "Sci-Fi", name: "Khoa học viễn tưởng" },
  ];

  const handleBookTicket = (movieId: string) => {
    navigate(`/booking/${movieId}`);
  };  return (
    <MainLayout>
      {/* Hero Banner Carousel - thay thế phần hero cũ và phim nổi bật */}
      <HeroBannerCarousel 
        banners={banners}
        isLoading={isBannersLoading}
        autoSlide={true}
        slideInterval={6000}
      />

      {/* Search and Filter - di chuyển xuống dưới banner */}
      <SearchAndFilter
        categories={categories}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        isLoading={isLoading}
        isSearching={isSearching}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />      {/* Movies Section - Đang chiếu */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <TrendingUp className="mr-3 text-orange-400" size={28} />
              Phim đang hot
            </h2>
            <Button
              onClick={() => navigate("/movies")}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              Xem tất cả
            </Button>
          </div>          {/* Movie Grid */}
          <MovieGrid
            movies={movies}
            isLoading={isLoading}
            onBookTicket={handleBookTicket}
            searchTerm={searchTerm}
            onResetFilters={handleResetFilters}
          />
        </div>
      </section>

      {/* Phim sắp chiếu */}
      <section>
        
      </section>

      <section className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Đối tác rạp chiếu phim
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {["CGV", "Galaxy", "Lotte", "BHD Star", "Beta", "Cinestar"].map(
              (brand) => (
                <div key={brand} className="text-center">
                  <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors cursor-pointer">
                    <h3 className="text-white font-semibold">{brand}</h3>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
export default HomePage;
