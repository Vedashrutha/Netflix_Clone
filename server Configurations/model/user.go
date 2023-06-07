package model
type User struct {
	Id string `json:"_id" bson:"_id"`
	FirstName string `json:"firstName" bson:"firstName"`
	LastName string `json:"lastName" bson:"lastName"`
	PhoneNumber int `json:"phoneNumber" bson:"phoneNumber"`
	EMail string `json:"eMail" bson:"eMail"`
	UPass string `json:"uPass" bson:"uPass"`
	Profiles [] Profile `json:"profile" bson:"profile"`
	BillingDetails BillDetails `json:"billingDetails" bson:"billingDetails"`
}

type Profile struct{
	Id int `json:"_id" bson:"_id"`
	ProfileName string `json:"profileName" bson:"profileName"`
	Avatar string `json:"avatar" bson:"avatar"`
	Watchlist [] int `json:"watchlist" bson:"watchlist"`
	Watchhistory [] int `json:"watchhistory" bson:"watchhistory"`
	Liked [] int `json:"liked" bson:"liked"`
	Disliked [] int `json:"disliked" bson:"disliked"`
}

type BillDetails struct{
	Id int `json:"_id" bson:"_id"`
	PlanName string `json:"planName" bson:"planName"`
	PlanPrice int `json:"planPrice" bson:"planPrice"`
	PurchasedOn string `json:"purchasedOn" bson:"purchasedOn"`
	CardNumber string `json:"cardNumber" bson:"cardNumber"`
}
