package router
import(
	"github.com/gorilla/mux"
	MovieController "Netflix_V11/middleware/movies"
	UserController "Netflix_V11/middleware/users"
	NotificationController "Netflix_V11/middleware/notifications"
)

func GetRouter() *mux.Router {
	apiRouter := mux.NewRouter()
	movieHandler(apiRouter)
	userHandler(apiRouter)
	notificationHandler(apiRouter)
	return apiRouter
}

func movieHandler(router *mux.Router) {
	router.HandleFunc("/movies", MovieController.GetMovies).Methods("POST")
	router.HandleFunc("/movie", MovieController.GetSingleMovie).Methods("POST")
	router.HandleFunc("/latestMovies", MovieController.GetLatestMovies).Methods("POST")
	router.HandleFunc("/search", MovieController.SearchMovies).Methods("GET")
	router.HandleFunc("/watchlist", MovieController.GetWatchList).Methods("POST")
	router.HandleFunc("/language", MovieController.GetMovieByLang).Methods("POST")
}

func userHandler(router *mux.Router) {
	router.HandleFunc("/user", UserController.GetUserByUsernameOrPhoneNumber).Methods("POST")
	router.HandleFunc("/userone", UserController.GetSingleUser).Methods("POST")
	router.HandleFunc("/checkemail", UserController.CheckEmailHandler).Methods("POST")
	router.HandleFunc("/usersignup", UserController.CreateUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/users/{id}", UserController.UpdateUser).Methods("PUT", "OPTIONS")
	router.HandleFunc("/deluser/{id}", UserController.DeleteUser).Methods("DELETE", "OPTIONS")

}

func notificationHandler(router *mux.Router) {
	router.HandleFunc("/notifications", NotificationController.SendNotifications).Methods("GET")
}
