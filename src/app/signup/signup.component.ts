import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as creditCardType from 'credit-card-type';
import { BillDetails, Profile, User } from '../models/user';
import { NgxSpinnerService } from 'ngx-spinner';
import { cardValidator, passwordValidator } from '../helpers/dataValidator';
import { generateTransactionId } from '../helpers/generateUserId'
import { UserService } from '../services/user.service';
import { encryptData } from '../helpers/aesEncryption';
import ObjectId from 'bson-objectid';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {

  plans = [
    { id: 1, name: 'Basic', price: 199, description:'Access to Standard Definition (SD) content'},
    { id: 2, name: 'Standard', price: 499, description:'Access to High Definition (HD) content'},
    { id: 3, name: 'Premium', price: 799, description:'Access to Ultra High Definition (UHD) content'}
  ];
    planNameObtained:any;
    priceOfSelectedPlan:number;

  // Signup Form
  signupForm: FormGroup;
  user: User
  userArr:User[]=[]
  profile:Profile[]

  index: number
  emailAddress:string
  date = new Date().toString()

  cardNumberEntered: string;
  cardName: string;
  cardImageUrl: string;

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private spinner: NgxSpinnerService,private userService: UserService,private router:Router) {
    this.activatedRoute.params.subscribe((prms) => {
      this.emailAddress = prms['email'].toString();      
    })

  }

  ngOnInit(): void {

    // const existingObjectIdValue = '647acd1e1bf72159fb38f86a';
    // const objId = new ObjectId(existingObjectIdValue);
    // console.log("Object Id",objId);
    // console.log("After converting to HEX",objId.toHexString());

    this.signupForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: new FormControl({ value: '', disabled: true }),
      password: ['', [Validators.required, passwordValidator()]],
      // confirmpassword:['', Validators.required],
      cardNumber: ['', [Validators.required,cardValidator()]],
      netflixPlan: ['', Validators.required],
      price: new FormControl({ value: '', disabled: true })
    });

    //can put data to form only after it is loaded so this should be at last
    this.signupForm.get('email')?.setValue(this.emailAddress)
  }

  onCardNumberInput(): void {
    if (this.cardNumberEntered) {
      const cardType = creditCardType(this.cardNumberEntered)[0];
      this.cardName = cardType ? cardType.type : '';
      // this.cardImageUrl = this.cardName ? cardImages[this.cardName] : '';

    } else {
      this.cardName = '';
      this.cardImageUrl = '';
    }
  }
  onChangeType(evt: any) {
    this.planNameObtained = evt.target.value;

    this.plans.forEach(p=>{
      if(p.name==this.planNameObtained){
        this.priceOfSelectedPlan=p.price
      }
    })
    // this.index = parseInt(idObtained.split(' ')[1].trim());
    // console.log(this.index);
    this.signupForm.get('price')?.setValue(this.priceOfSelectedPlan)

  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    const objectId = new ObjectId().toHexString();
    // console.log(objectId);
    
    var fName=this.signupForm.value.fname
    let lName=this.signupForm.value.lname
    let phone=this.signupForm.value.number
    let email=this.emailAddress
    let password=this.signupForm.value.password
    let billingId=generateTransactionId()
    let planName=this.planNameObtained
    let planPrice=this.priceOfSelectedPlan
    let purchasedDate=this.date
    let cardNumber=this.signupForm.value.cardNumber
    
    let billingDetails=new BillDetails(billingId,planName,planPrice,purchasedDate,cardNumber)    
    let profiles:Profile[]=[]
    let prof_data=new Profile(5,'Children','../../assets/img/avatars/kids.jpg',[],[],[],[])
    profiles.push(prof_data)
    console.log(profiles);
    

    
    if (fName && lName && phone && email && password && planName && cardNumber){
      
      this.user=new User(objectId,fName,lName,phone,email,password,profiles,billingDetails)
      this.user=new User(objectId,fName,lName,phone,email,password,profiles,billingDetails)
      console.log(this.user);
      this.userService.addUser(this.user).subscribe((response)=>{

      })
      let userId:string=encryptData(objectId.toString())
      localStorage.setItem('userID', userId);

      let username:string=encryptData(fName)
      localStorage.setItem('userName', username);

      this.router.navigate(['/profiles']);
      
    }
  }
}
