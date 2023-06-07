import { CanActivate } from "@angular/router";
import { decryptData } from "src/app/helpers/aesEncryption";

var encUid = localStorage.getItem('userID') || '0'
var userId: string = decryptData(encUid)

export class AccessGuard implements CanActivate {
    canActivate():boolean{
        if (userId !== "") {
            return true;
        }
        else {
            window.location.replace("/home1");
            return false;
        }
    }
}