package model

import (
	"encoding/json"
	"fmt"
)

type Movie struct {
	Id int `json:"_id" bson:"_id"`
	Title string `json:"title" bson:"title"`
	Type string `json:"type" bson:"type"`
	Cast [] string `json:"cast" bson:"cast"`
	Director_id int `json:"director_id" bson:"director_id"`
	Year int `json:"year" bson:"year"`
	Genre [] string `json:"genre" bson:"genre"`
	Language [] string `json:"language" bson:"language"`
	Description string `json:"description" bson:"description"`
	Runtime string `json:"runtime" bson:"runtime"`
	Rating float64 `json:"rating" bson:"rating"`
	Thumbnail string `json:"thumbnail" bson:"thumbnail"`
	Image string `json:"image" bson:"image"`
	TrailerUrl string `json:"trailerUrl" bson:"trailerUrl"`

}
type MyMovie struct {
	M Movie
}

func (mv MyMovie) MarshalJSON() ([]byte, error) {
	fmt.Println("MarshalJSON of Movie called")
	m, _ := json.Marshal(mv.M)
	var a interface{}
	json.Unmarshal(m, &a)
	b := a.(map[string]interface{})
	b["id"] = b["_id"]
	delete(b, "_id")
	return json.Marshal(b)
}