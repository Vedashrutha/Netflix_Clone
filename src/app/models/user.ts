export class User{
    _id: string
    firstName: string
    lastName: string
    phoneNumber: number
    eMail: string
    uPass: string
    profile:Profile[]=[]
    billingDetails:BillDetails

    constructor(_id: string, firstName: string, lastName: string, phoneNumber: number, eMail: string, uPass: string,profile:Profile[],billingDetails:BillDetails) {
        this._id =_id
        this.firstName = firstName
        this.lastName = lastName
        this.phoneNumber = phoneNumber
        this.eMail = eMail
        this.uPass = uPass
        this.profile=profile
        this.billingDetails=billingDetails
    }
    
}

export class Profile{
    _id:number
    profileName:string
    avatar:string
    watchlist:number[]=[]
    watchhistory:number[]=[]
    liked:number[]=[]
    disliked:number[]=[]

    constructor(_id:number,profileName:string,avatar:string,watchlist:number[],watchhistory:number[],liked:number[],disliked:number[]){
        this._id=_id
        this.profileName=profileName
        this.avatar=avatar
        this.watchlist=watchlist
        this.watchhistory=watchhistory
        this.liked=liked
        this.disliked=disliked
    }
}

export class BillDetails{
    _id:number
    planName:string
    planPrice:number
    purchasedOn:string
    cardNumber:string

    constructor(_id:number,planName:string,planPrice:number,purchasedOn:string,cardNumber:string){
        this._id=_id
        this.planName=planName
        this.planPrice=planPrice
        this.purchasedOn=purchasedOn
        this.cardNumber=cardNumber
    }
}