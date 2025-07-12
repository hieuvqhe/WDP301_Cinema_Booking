import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  Users,
  AlertTriangle,
  X,
  MonitorPlay
} from "lucide-react";
import { toast } from 'sonner';

// Import APIs
import { 
  getMyShowtimes,
  createShowtime,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
  formatShowtimeDate,
  formatShowtimeTime,
  getShowtimeStatusDisplay,
  getShowtimeStatusColor,
  calculateShowtimeOccupancy,
  formatPrice,
  validateShowtimeData,
  generateTimeSlots,
  type Showtime,
  type ShowtimeCreateRequest
} from '../../../apis/showtime_staff.api';

import { 
  getMyTheater,
  type TheaterResponse 
} from '../../../apis/staff.api';

import { 
  getMyMovies,
  type Movie 
} from '../../../apis/staff.api';

import { 
  getTheaterScreens,
  type Screen 
} from '../../../apis/staff_screen.api';

const Showtimes = () => {
  // State management
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [theater, setTheater] = useState<TheaterResponse | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [showtimeToDelete, setShowtimeToDelete] = useState<{id: string, movie: string} | null>(null);

  // Form states for modals
  const [formData, setFormData] = useState<ShowtimeCreateRequest>({
    movie_id: '',
    screen_id: '',
    theater_id: '',
    start_time: '',
    end_time: '',
    price: { regular: 50000, premium: 70000 },
    available_seats: 0
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for create/edit
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [showDate, setShowDate] = useState('');
  const [showTime, setShowTime] = useState('');
  const [timeSlots] = useState(generateTimeSlots(8, 23, 30));

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get theater info first
      const theaterResponse = await getMyTheater();
      setTheater(theaterResponse);
      
      if (theaterResponse.result?._id) {
        // Get movies, screens, and showtimes in parallel
        const [moviesResponse, screensResponse, showtimesResponse] = await Promise.all([
          getMyMovies(1, 100), // Get all movies
          getTheaterScreens(theaterResponse.result._id, 1, 100), // Get all screens
          getMyShowtimes(page, limit, undefined, undefined, undefined, undefined)
        ]);
        
        setMovies(moviesResponse.result.movies);
        setScreens(screensResponse.result.screens);
        setShowtimes(showtimesResponse.result.showtimes);
        setTotalPages(showtimesResponse.result.total_pages);
        setTotal(showtimesResponse.result.total);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleFormChange = (field: keyof ShowtimeCreateRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear related errors
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  // Handle movie selection
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    handleFormChange('movie_id', movie._id);
    
    // Auto-calculate end time when movie and start time are selected
    if (showDate && showTime) {
      updateEndTime(movie.duration);
    }
  };

  // Handle screen selection
  const handleScreenSelect = (screen: Screen) => {
    setSelectedScreen(screen);
    handleFormChange('screen_id', screen._id);
    handleFormChange('available_seats', screen.capacity);
  };

  // Handle date and time changes
  const handleDateTimeChange = (date: string, time: string) => {
    setShowDate(date);
    setShowTime(time);
    
    if (date && time) {
      const startDateTime = new Date(`${date}T${time}:00.000Z`);
      handleFormChange('start_time', startDateTime.toISOString());
      
      if (selectedMovie) {
        updateEndTime(selectedMovie.duration);
      }
    }
  };

  // Update end time based on movie duration
  const updateEndTime = (movieDuration: number) => {
    if (showDate && showTime) {
      const startDateTime = new Date(`${showDate}T${showTime}:00.000Z`);
      const endDateTime = new Date(startDateTime.getTime() + (movieDuration * 60 * 1000)); // duration in minutes
      handleFormChange('end_time', endDateTime.toISOString());
    }
  };

  // Handle showtime deletion
  const handleDeleteShowtime = (showtimeId: string, movieTitle: string) => {
    setShowtimeToDelete({ id: showtimeId, movie: movieTitle });
    setShowDeleteModal(true);
  };

  // Confirm delete showtime
  const confirmDeleteShowtime = async () => {
    if (!showtimeToDelete) return;

    try {
      setIsSubmitting(true);
      await deleteShowtime(showtimeToDelete.id);
      toast.success('Showtime deleted successfully');
      setShowDeleteModal(false);
      setShowtimeToDelete(null);
      await fetchData(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete showtime';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel delete showtime
  const cancelDeleteShowtime = () => {
    setShowDeleteModal(false);
    setShowtimeToDelete(null);
  };

  // Modal handlers
  const handleAddShowtime = () => {
    setFormData({
      movie_id: '',
      screen_id: '',
      theater_id: theater?.result?._id || '',
      start_time: '',
      end_time: '',
      price: { regular: 50000, premium: 70000 },
      available_seats: 0
    });
    setSelectedMovie(null);
    setSelectedScreen(null);
    setShowDate('');
    setShowTime('');
    setFormErrors([]);
    setIsSubmitting(false);
    setShowAddModal(true);
  };

  const handleEditShowtime = async (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setFormData({
      movie_id: showtime.movie_id,
      screen_id: showtime.screen_id,
      theater_id: showtime.theater_id,
      start_time: showtime.start_time,
      end_time: showtime.end_time,
      price: showtime.price,
      available_seats: showtime.available_seats
    });
    
    // Set selected movie and screen
    const movie = movies.find(m => m._id === showtime.movie_id);
    const screen = screens.find(s => s._id === showtime.screen_id);
    setSelectedMovie(movie || null);
    setSelectedScreen(screen || null);
    
    // Set date and time from start_time
    const startDate = new Date(showtime.start_time);
    setShowDate(startDate.toISOString().split('T')[0]);
    setShowTime(startDate.toTimeString().substring(0, 5));
    
    setFormErrors([]);
    setIsSubmitting(false);
    setShowEditModal(true);
  };

  const handleViewDetails = async (showtime: Showtime) => {
    try {
      const response = await getShowtimeById(showtime._id);
      setSelectedShowtime(response.result);
      setShowViewModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch showtime details';
      toast.error(errorMessage);
    }
  };

  const openEditModal = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setShowEditModal(true);
    // Pre-populate form data - we'll fetch the full movie and screen data when needed
    const startTime = new Date(showtime.start_time);
    setShowDate(startTime.toISOString().split('T')[0]);
    setShowTime(startTime.toTimeString().slice(0, 5));
    setFormData({
      ...formData,
      movie_id: showtime.movie_id,
      screen_id: showtime.screen_id,
      start_time: showtime.start_time,
      end_time: showtime.end_time,
      price: showtime.price,
      available_seats: showtime.available_seats
    });
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setSelectedShowtime(null);
    setShowtimeToDelete(null);
    setSelectedMovie(null);
    setSelectedScreen(null);
    setShowDate('');
    setShowTime('');
    setFormErrors([]);
    setIsSubmitting(false);
  };

  // Form validation
  const validateForm = (): string[] => {
    const errors = validateShowtimeData(formData);
    
    if (!selectedMovie) errors.push('Please select a movie');
    if (!selectedScreen) errors.push('Please select a screen');
    if (!showDate) errors.push('Please select a date');
    if (!showTime) errors.push('Please select a time');
    
    // Check if start time is in the future
    if (formData.start_time) {
      const startTime = new Date(formData.start_time);
      const now = new Date();
      if (startTime <= now) {
        errors.push('Start time must be in the future');
      }
    }
    
    return errors;
  };

  // Handle form submission for creating showtime
  const handleCreateShowtime = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormErrors([]);
      
      await createShowtime(formData);
      toast.success('Showtime created successfully');
      closeModals();
      await fetchData(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create showtime';
      toast.error(errorMessage);
      setFormErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission for updating showtime
  const handleUpdateShowtime = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!selectedShowtime) {
      toast.error('Showtime information not available');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormErrors([]);
      
      const updateData = {
        start_time: formData.start_time,
        end_time: formData.end_time,
        price: formData.price,
        available_seats: formData.available_seats
      };
      
      await updateShowtime(selectedShowtime._id, updateData);
      toast.success('Showtime updated successfully');
      closeModals();
      await fetchData(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update showtime';
      toast.error(errorMessage);
      setFormErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [page]);

  // Filter showtimes based on search term
  const filteredShowtimes = showtimes.filter(showtime => 
    showtime.movie?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    showtime.screen?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Showtime Management</h2>
            <p className="text-slate-400 text-sm">
              {theater?.result ? `${theater.result.name} - ${total} showtime${total !== 1 ? 's' : ''} found` : 'Loading theater info...'}
            </p>
          </div>
          <motion.button
            onClick={handleAddShowtime}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || !theater?.result}
          >
            <Plus size={18} className="mr-2" />
            Add Showtime
          </motion.button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search showtimes by movie or screen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-500/20 border border-red-500/30 p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center">
              <AlertTriangle size={20} className="text-red-400 mr-2" />
              <p className="text-red-300">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Movie</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Screen</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Seats</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="border-t border-slate-700/50 animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-700/50 rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-700/50 rounded w-28"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-700/50 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-700/50 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-700/50 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            {/* Showtimes Table */}
            {filteredShowtimes.length > 0 ? (
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                          Movie
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                          Screen
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                          Seats
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShowtimes.map((showtime, index) => (
                        <motion.tr
                          key={showtime._id}
                          className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {showtime.movie?.poster_url && (
                                <img 
                                  src={showtime.movie.poster_url} 
                                  alt={showtime.movie.title}
                                  className="w-12 h-16 object-cover rounded mr-3"
                                />
                              )}
                              <div>
                                <div className="font-medium text-white">
                                  {showtime.movie?.title || 'Unknown Movie'}
                                </div>
                                <div className="text-sm text-slate-400">
                                  {showtime.movie?.genre?.join(', ')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-300">{showtime.screen?.name}</div>
                            <div className="text-sm text-slate-400">
                              Capacity: {showtime.screen?.capacity}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-300">{formatShowtimeDate(showtime.start_time)}</div>
                            <div className="text-sm text-slate-400">
                              {formatShowtimeTime(showtime.start_time)} - {formatShowtimeTime(showtime.end_time)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-orange-400 font-medium">
                              {formatPrice(showtime.price.regular)}
                            </div>
                            {showtime.price.premium && (
                              <div className="text-sm text-slate-400">
                                Premium: {formatPrice(showtime.price.premium)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-300">
                              {showtime.available_seats}/{showtime.screen?.capacity || 0}
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${calculateShowtimeOccupancy(showtime)}%`,
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getShowtimeStatusColor(showtime.status)}`}>
                              {getShowtimeStatusDisplay(showtime.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => handleEditShowtime(showtime)}
                                className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-1 rounded text-sm font-medium transition-colors duration-300 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Edit size={14} className="mr-1" />
                                Edit
                              </motion.button>
                              <motion.button
                                onClick={() => handleViewDetails(showtime)}
                                className="bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-3 py-1 rounded text-sm font-medium transition-colors duration-300 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Eye size={14} className="mr-1" />
                                View
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteShowtime(showtime._id, showtime.movie?.title || 'Unknown')}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Trash2 size={14} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              !loading && (
                <motion.div
                  className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Calendar size={64} className="text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Showtimes Found
                  </h3>
                  <p className="text-slate-300 mb-6">
                    {searchTerm 
                      ? "No showtimes match your search criteria. Try adjusting your search."
                      : "You haven't created any showtimes yet. Create your first showtime to get started."
                    }
                  </p>
                  <motion.button
                    onClick={handleAddShowtime}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!theater?.result}
                  >
                    <Plus size={18} className="mr-2" />
                    Add Showtime
                  </motion.button>
                </motion.div>
              )
            )}

            {/* Pagination */}
            {filteredShowtimes.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/60 transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === pageNum
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-700/60'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/60 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Add Showtime Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Add New Showtime</h3>
              <button
                onClick={closeModals}
                className="text-slate-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateShowtime} className="p-6 space-y-6">
              {/* Error Messages */}
              {formErrors.length > 0 && (
                <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-300 font-medium mb-2">Please fix the following errors:</p>
                      <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
                        {formErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Movie Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Select Movie <span className="text-red-400">*</span>
                    </label>
                    <div className="max-h-48 overflow-y-auto bg-slate-700/30 rounded-lg border border-slate-600">
                      {movies.map((movie) => (
                        <div
                          key={movie._id}
                          onClick={() => handleMovieSelect(movie)}
                          className={`p-3 cursor-pointer border-b border-slate-600/50 last:border-b-0 transition-colors ${
                            selectedMovie?._id === movie._id 
                              ? 'bg-orange-500/20 border-orange-500/30' 
                              : 'hover:bg-slate-600/30'
                          }`}
                        >
                          <div className="flex items-center">
                            <img 
                              src={movie.poster_url} 
                              alt={movie.title}
                              className="w-12 h-16 object-cover rounded mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{movie.title}</h4>
                              <p className="text-slate-400 text-sm">{movie.duration} minutes</p>
                              <p className="text-slate-400 text-xs">{movie.genre.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Screen Selection */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Select Screen <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-2">
                      {screens.map((screen) => (
                        <div
                          key={screen._id}
                          onClick={() => handleScreenSelect(screen)}
                          className={`p-3 cursor-pointer rounded-lg border transition-colors ${
                            selectedScreen?._id === screen._id 
                              ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' 
                              : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{screen.name}</h4>
                              <p className="text-sm opacity-70">Capacity: {screen.capacity} seats</p>
                            </div>
                            <MonitorPlay size={20} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Date, Time & Pricing */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Show Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={showDate}
                      onChange={(e) => handleDateTimeChange(e.target.value, showTime)}
                      min={getMinDate()}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Show Time <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={showTime}
                      onChange={(e) => handleDateTimeChange(showDate, e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                      disabled={isSubmitting}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Configuration */}
                  <div className="space-y-3">
                    <label className="block text-slate-300 text-sm font-medium">
                      Ticket Pricing <span className="text-red-400">*</span>
                    </label>
                    
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Regular Seats</label>
                      <input
                        type="number"
                        value={formData.price.regular}
                        onChange={(e) => handleFormChange('price', { 
                          ...formData.price, 
                          regular: parseInt(e.target.value) || 0 
                        })}
                        min="0"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                        disabled={isSubmitting}
                        placeholder="Price in VND"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Premium Seats</label>
                      <input
                        type="number"
                        value={formData.price.premium}
                        onChange={(e) => handleFormChange('price', { 
                          ...formData.price, 
                          premium: parseInt(e.target.value) || 0 
                        })}
                        min="0"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                        disabled={isSubmitting}
                        placeholder="Price in VND"
                      />
                    </div>

                    {formData.price.vip !== undefined && (
                      <div>
                        <label className="block text-slate-400 text-xs mb-1">VIP Seats</label>
                        <input
                          type="number"
                          value={formData.price.vip || 0}
                          onChange={(e) => handleFormChange('price', { 
                            ...formData.price, 
                            vip: parseInt(e.target.value) || 0 
                          })}
                          min="0"
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                          disabled={isSubmitting}
                          placeholder="Price in VND"
                        />
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  {selectedMovie && selectedScreen && showDate && showTime && (
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Showtime Summary</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-300">
                          <span className="text-slate-400">Movie:</span> {selectedMovie.title}
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-400">Screen:</span> {selectedScreen.name}
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-400">Duration:</span> {selectedMovie.duration} minutes
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-400">Available Seats:</span> {formData.available_seats}
                        </p>
                        {formData.end_time && (
                          <p className="text-slate-300">
                            <span className="text-slate-400">End Time:</span> {formatShowtimeTime(formData.end_time)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" />
                      Create Showtime
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && showtimeToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-400" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Delete Showtime
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Are you sure you want to delete the showtime for "{showtimeToDelete.movie}"? This action cannot be undone and will permanently remove the showtime.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteShowtime}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteShowtime}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" />
                      Delete Showtime
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Showtime Modal */}
      {showEditModal && selectedShowtime && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Edit Showtime</h3>
              <button
                onClick={closeModals}
                className="text-slate-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateShowtime} className="p-6 space-y-6">
              {/* Error Messages */}
              {formErrors.length > 0 && (
                <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-300 font-medium mb-2">Please fix the following errors:</p>
                      <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
                        {formErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Movie Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Select Movie <span className="text-red-400">*</span>
                    </label>
                    <div className="max-h-48 overflow-y-auto bg-slate-700/30 rounded-lg border border-slate-600">
                      {movies.map((movie) => (
                        <div
                          key={movie._id}
                          onClick={() => handleMovieSelect(movie)}
                          className={`p-3 cursor-pointer border-b border-slate-600/50 last:border-b-0 transition-colors ${
                            selectedMovie?._id === movie._id 
                              ? 'bg-orange-500/20 border-orange-500/30' 
                              : 'hover:bg-slate-600/30'
                          }`}
                        >
                          <div className="flex items-center">
                            <img 
                              src={movie.poster_url} 
                              alt={movie.title}
                              className="w-12 h-16 object-cover rounded mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{movie.title}</h4>
                              <p className="text-slate-400 text-sm">{movie.duration} minutes</p>
                              <p className="text-slate-400 text-xs">{movie.genre.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Screen Selection */}
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Select Screen <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-2">
                      {screens.map((screen) => (
                        <div
                          key={screen._id}
                          onClick={() => handleScreenSelect(screen)}
                          className={`p-3 cursor-pointer rounded-lg border transition-colors ${
                            selectedScreen?._id === screen._id 
                              ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' 
                              : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{screen.name}</h4>
                              <p className="text-sm opacity-70">Capacity: {screen.capacity} seats</p>
                            </div>
                            <MonitorPlay size={20} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Date, Time & Pricing */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Show Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={showDate}
                      onChange={(e) => handleDateTimeChange(e.target.value, showTime)}
                      min={getMinDate()}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Show Time <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={showTime}
                      onChange={(e) => handleDateTimeChange(showDate, e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                      disabled={isSubmitting}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Configuration */}
                  <div className="space-y-3">
                    <label className="block text-slate-300 text-sm font-medium">
                      Ticket Pricing <span className="text-red-400">*</span>
                    </label>
                    
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Regular Seats</label>
                      <input
                        type="number"
                        value={formData.price.regular}
                        onChange={(e) => handleFormChange('price', { 
                          ...formData.price, 
                          regular: parseInt(e.target.value) || 0 
                        })}
                        min="0"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                        disabled={isSubmitting}
                        placeholder="Price in VND"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Premium Seats</label>
                      <input
                        type="number"
                        value={formData.price.premium}
                        onChange={(e) => handleFormChange('price', { 
                          ...formData.price, 
                          premium: parseInt(e.target.value) || 0 
                        })}
                        min="0"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                        disabled={isSubmitting}
                        placeholder="Price in VND"
                      />
                    </div>

                    {formData.price.vip !== undefined && (
                      <div>
                        <label className="block text-slate-400 text-xs mb-1">VIP Seats</label>
                        <input
                          type="number"
                          value={formData.price.vip || 0}
                          onChange={(e) => handleFormChange('price', { 
                            ...formData.price, 
                            vip: parseInt(e.target.value) || 0 
                          })}
                          min="0"
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                          disabled={isSubmitting}
                          placeholder="Price in VND"
                        />
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  {selectedMovie && selectedScreen && showDate && showTime && (
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Showtime Summary</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-300">
                          <span className="text-slate-400">Movie:</span> {selectedMovie.title}
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-400">Screen:</span> {selectedScreen.name}
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-400">Duration:</span> {selectedMovie.duration} minutes
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-400">Available Seats:</span> {formData.available_seats}
                        </p>
                        {formData.end_time && (
                          <p className="text-slate-300">
                            <span className="text-slate-400">End Time:</span> {formatShowtimeTime(formData.end_time)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit size={18} className="mr-2" />
                      Update Showtime
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Showtime Modal */}
      {showViewModal && selectedShowtime && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Showtime Details</h3>
              <button
                onClick={closeModals}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Movie Info */}
                <div className="flex items-start space-x-4">
                  <img 
                    src={selectedShowtime.movie?.poster_url || '/placeholder-movie.jpg'} 
                    alt={selectedShowtime.movie?.title || 'Movie'}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{selectedShowtime.movie?.title}</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-300">
                        <span className="text-slate-400">Duration:</span> {selectedShowtime.movie?.duration} minutes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Showtime Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
                      Schedule Details
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center text-slate-300">
                        <Calendar size={16} className="mr-2 text-slate-400" />
                        <span className="text-slate-400 mr-2">Date:</span>
                        {formatShowtimeDate(selectedShowtime.start_time)}
                      </div>
                      <div className="flex items-center text-slate-300">
                        <Clock size={16} className="mr-2 text-slate-400" />
                        <span className="text-slate-400 mr-2">Time:</span>
                        {formatShowtimeTime(selectedShowtime.start_time)} - {formatShowtimeTime(selectedShowtime.end_time)}
                      </div>
                      <div className="flex items-center text-slate-300">
                        <MonitorPlay size={16} className="mr-2 text-slate-400" />
                        <span className="text-slate-400 mr-2">Screen:</span>
                        {selectedShowtime.screen?.name}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
                      Seating & Pricing
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center text-slate-300">
                        <Users size={16} className="mr-2 text-slate-400" />
                        <span className="text-slate-400 mr-2">Available:</span>
                        {selectedShowtime.available_seats} seats
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Regular:</span>
                          <span>{formatPrice(selectedShowtime.price.regular)}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Premium:</span>
                          <span>{formatPrice(selectedShowtime.price.premium)}</span>
                        </div>
                        {selectedShowtime.price.vip && (
                          <div className="flex justify-between text-slate-300">
                            <span className="text-slate-400">VIP:</span>
                            <span>{formatPrice(selectedShowtime.price.vip)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center">
                    <span className="text-slate-400 mr-2">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getShowtimeStatusColor(selectedShowtime.status)}`}>
                      {getShowtimeStatusDisplay(selectedShowtime.status)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(selectedShowtime)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Showtimes;
