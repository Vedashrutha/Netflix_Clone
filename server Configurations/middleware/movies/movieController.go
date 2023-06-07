package movieController

import (
	conn "Netflix_V11/config"
	Generic "Netflix_V11/generic"
	model "Netflix_V11/model"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type RequestMovie struct {
    Genre string `json:"genre"`
	Type string `json:"type"`
    Skip int `json:"skip"`
    Limit int `json:"limit"`
}

type RequestWatchList struct {
	ArrayData []int `json:"watchListArray"`
}

type RequestLang struct{
	Skip int `json:"skip"`
    Limit int `json:"limit"`
	RequestData string `json:"language"`
}

type SingleMovieRequest struct {
	Id int `json:"id"`
}

type LatestMovRequest struct {
	Limit int `json:limit`
}

func GetMovies(w http.ResponseWriter, r *http.Request) {

    Generic.SetupResponse(&w, r)
    var requestBody RequestMovie
    err := json.NewDecoder(r.Body).Decode(&requestBody)
    if err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    var movies []model.Movie
    collection := conn.ConnectDB("movies")
	filter := bson.M{"type":requestBody.Type,"genre": requestBody.Genre}
    option := options.Find().SetSkip(int64((requestBody.Skip - 1) * requestBody.Limit)).SetLimit(int64(requestBody.Limit))

    cur, err := collection.Find(context.TODO(), filter,option)
	
    if err != nil {
        fmt.Println(err)
    }
    defer cur.Close(context.Background())
    for cur.Next(context.Background()) {
        var movie model.Movie

        err := cur.Decode(&movie)

        if err != nil {
            fmt.Println(err)

        }

        movies = append(movies, movie)
    }
    fmt.Println(len(movies))
    mymovies := make([]model.MyMovie, len(movies))
    for i, value := range movies {
        fmt.Println(i)
        mymovies[i] = model.MyMovie{value}
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(mymovies)

}

func GetWatchList(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)
	var requestBody RequestWatchList

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

    var movies []model.Movie

    collection := conn.ConnectDB("movies")
	filter := bson.M{"_id": bson.M{"$in": requestBody.ArrayData}}
	cur, err := collection.Find(r.Context(), filter)

    if err != nil {
        fmt.Println(err)
    }
    defer cur.Close(context.Background())

    for cur.Next(context.Background()) {
        var movie model.Movie
        err := cur.Decode(&movie)
        if err != nil {
            fmt.Println(err)

        }
        movies = append(movies, movie)
    }
    fmt.Println(len(movies))
    mymovies := make([]model.MyMovie, len(movies))
    for i, value := range movies {
        fmt.Println(i)
        mymovies[i] = model.MyMovie{value}
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(mymovies)

}

func GetMovieByLang(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)
	var requestBody RequestLang
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	fmt.Println(requestBody)
	var movies []model.Movie
	collection := conn.ConnectDB("movies")
	filter := bson.M{"language": requestBody.RequestData}
	option := options.Find().SetSkip(int64((requestBody.Skip - 1) * requestBody.Limit)).SetLimit(int64(requestBody.Limit))

	cur, err := collection.Find(context.Background(),filter,option)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer cur.Close(context.TODO())
	for cur.Next(context.TODO()) {

		var movie model.Movie
		err := cur.Decode(&movie)

		if err != nil {
			log.Fatal(err)
		}
		movies = append(movies, movie)
	}

	myMovies := make([]model.MyMovie, len(movies))
	for i, value := range movies {
		myMovies[i] = model.MyMovie{value}
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(myMovies)
}

func GetSingleMovie(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)
	var requestBody SingleMovieRequest
	err := json.NewDecoder(r.Body).Decode(&requestBody)
    if err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

	var movie model.Movie
	collection := conn.ConnectDB("movies")                    

	filter := bson.M{"_id": requestBody.Id}
	err2 := collection.FindOne(context.TODO(), filter).Decode(&movie)

	if err2 != nil {
		conn.GetError(err2, w)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(model.MyMovie{movie})
}

func GetLatestMovies(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)
	var requestBody LatestMovRequest

	error1 := json.NewDecoder(r.Body).Decode(&requestBody)
    if error1 != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

	var movies []model.Movie
	collection := conn.ConnectDB("movies")
	sort := options.Find().SetSort(bson.D{{"_id", -1}})
	limit := int64(requestBody.Limit)

	cur, err := collection.Find(context.TODO(), bson.D{}, sort, options.Find().SetLimit(limit))
	if err != nil {
		log.Fatal(err)
		return
	}
	defer cur.Close(context.TODO())
	for cur.Next(context.TODO()) {

		var movie model.Movie
		err := cur.Decode(&movie)

		if err != nil {
			log.Fatal(err)
		}
		movies = append(movies, movie)
	}
	myMovies := make([]model.MyMovie, len(movies))
	for i, value := range movies {
		myMovies[i] = model.MyMovie{value}
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(myMovies)
}

func SearchMovies(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)
	query := r.URL.Query().Get("query")
	w.Header().Set("Content-Type", "application/json")
	var movies []model.Movie
	collection := conn.ConnectDB("movies")

	filter := bson.M{"title": bson.M{"$regex": query, "$options": "i"}}
	cur, err := collection.Find(context.TODO(), filter)

	if err != nil {
		log.Fatal(err)
		return
	}
	defer cur.Close(context.TODO())
	for cur.Next(context.TODO()) {

		var movie model.Movie
		err := cur.Decode(&movie)

		if err != nil {
			log.Fatal(err)
		}
		movies = append(movies, movie)
	}

	fmt.Println(len(movies))
	myMovies := make([]model.MyMovie, len(movies))
	for i, value := range movies {
		fmt.Println(i)
		myMovies[i] = model.MyMovie{value}
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(myMovies)
}
