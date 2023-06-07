package main

import (
	"Netflix_V11/router"
	"fmt"
	"net/http"
)

func main() {

    router := router.GetRouter()
    fmt.Println("Server is running \nPort : 4400")
    corsHandler := handleCORS(router)
    http.ListenAndServe(":4400", corsHandler)

}
func handleCORS(h http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        h.ServeHTTP(w, r)
    })
}