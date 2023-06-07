package userController

import (
	conn "Netflix_V11/config"
	Generic "Netflix_V11/generic"
	model "Netflix_V11/model"
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserEmailPhoneRequest struct {
	EmailOrPhoneNumber string `json:"emailOrPhoneNumber"`
}

type UserIDRequest struct {
	Id string `json:"objectId"`
}

type RequestEmail struct{
	Email string `json:"email"`
}

var salt = "iN7el%5"

func createHash(key string) string {
	hasher := md5.New()
	hasher.Write([]byte(key))
	return hex.EncodeToString(hasher.Sum(nil))
}

func encrypt(data []byte, passphrase string) []byte {
	block, _ := aes.NewCipher([]byte(createHash(passphrase)))
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		panic(err.Error())
	}
	ciphertext := gcm.Seal(nonce, nonce, data, nil)
	return ciphertext
}

func decrypt(data []byte, passphrase string) []byte {
	key := []byte(createHash(passphrase))
	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err.Error())
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}
	nonceSize := gcm.NonceSize()
	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		panic(err.Error())
	}
	return plaintext
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)

	if r.Method == "POST" {
		w.Header().Set("Content-Type", "application/json")
		data, err := ioutil.ReadAll(r.Body)
		asString := string(data)
		var tempUser map[string]interface{}
		json.Unmarshal([]byte(asString), &tempUser)
		objectID, err := primitive.ObjectIDFromHex(tempUser["_id"].(string))
    	if err != nil {
        	w.WriteHeader(http.StatusBadRequest)
        	fmt.Fprintf(w, "Error decoding request body: %s", err.Error())
        	return
    	}
		tempUser["_id"]=objectID
		passToEncrypt := tempUser["uPass"].(string)
		tempUser["uPass"] = hex.EncodeToString(encrypt([]byte(passToEncrypt), salt))
		collection := conn.ConnectDB("users")
		result, err := collection.InsertOne(context.TODO(), tempUser)
		fmt.Println(result)

		if err != nil {
			conn.GetError(err, w)
			return
		}
		json.NewEncoder(w).Encode(result)
	}
}


func GetUserByUsernameOrPhoneNumber(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)

	var requestBody UserEmailPhoneRequest
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var user model.User
	collection := conn.ConnectDB("users")
	filter := bson.M{
		"$or": []bson.M{
			{"eMail": requestBody.EmailOrPhoneNumber},
			{"phoneNumber": requestBody.EmailOrPhoneNumber},
		},
	}

	err = collection.FindOne(context.Background(), filter).Decode(&user)

	encPass := user.UPass
	passKey, _ := hex.DecodeString(encPass)
	decodedKey := decrypt(passKey, salt)

	user.UPass = string(decodedKey)

	if err != nil {
		conn.GetError(err, w)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)

}

func GetSingleUser(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)
	var requestBody UserIDRequest

	err := json.NewDecoder(r.Body).Decode(&requestBody)

	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	objID, err := primitive.ObjectIDFromHex(requestBody.Id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	collection := conn.ConnectDB("users")
	filter := bson.M{"_id": objID}
	var user model.User
	err2 := collection.FindOne(context.TODO(), filter).Decode(&user)
	encPass := user.UPass
	passKey, _ := hex.DecodeString(encPass)
	decodedKey := decrypt(passKey, salt)
	user.UPass = string(decodedKey)

	user.Id=objID.Hex()

	if err2 != nil {
		conn.GetError(err2, w)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)
	if r.Method == "PUT" {
		fmt.Println("status_OK")
		w.Header().Set("Content-Type", "application/json")

		var user model.User
		vars := mux.Vars(r)
		id := vars["id"]
		objectID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}
		filter := bson.M{"_id": bson.M{"$eq": objectID}}
		_ = json.NewDecoder(r.Body).Decode(&user)

		passKey := user.UPass
		encodedKey := hex.EncodeToString(encrypt([]byte(passKey), salt))

		update := bson.D{
			{"$set", bson.D{
				{"firstName", user.FirstName},
				{"lastName", user.LastName},
				{"phoneNumber", user.PhoneNumber},
				{"eMail", user.EMail},
				{"uPass", encodedKey},
				{"profile", user.Profiles},
				// {"billingDetails", user.BillingDetails},
			}},
		}
		collection := conn.ConnectDB("users")
		err1 := collection.FindOneAndUpdate(context.TODO(), filter, update).Decode(&user)
		if err1 != nil {
			conn.GetError(err, w)
			return
		}
		json.NewEncoder(w).Encode(user)
	}
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)
	if r.Method == "DELETE" {
		w.Header().Set("Content-Type", "application/json")
		vars := mux.Vars(r)
		id := vars["id"]
		objectID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}
		filter := bson.M{"_id": objectID}
		collection := conn.ConnectDB("users")
		deleteResult, err := collection.DeleteOne(context.TODO(), filter)
		if err != nil {
			conn.GetError(err, w)
			return
		}
		json.NewEncoder(w).Encode(deleteResult)
	}
}

func checkEmailExists(email string) (bool, error) {
	collection:=conn.ConnectDB("users")
	filter := bson.M{"eMail": email}
	exists, err := collection.FindOne(context.Background(), filter).DecodeBytes()
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil
		}
		fmt.Println(exists)
		return false, err
	}
	fmt.Println(exists)
	return true, nil
}

func CheckEmailHandler(w http.ResponseWriter, r *http.Request) {
	Generic.SetupResponse(&w, r)
	var requestBody RequestEmail

	err := json.NewDecoder(r.Body).Decode(&requestBody)
    if err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }
	exists, err := checkEmailExists(requestBody.Email)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	response := fmt.Sprintf(`{"exists": %t}`, exists)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}