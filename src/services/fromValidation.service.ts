import { AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class FormValidationService {

    public matchPassword(AC: AbstractControl) {
        let password = AC.get('password').value;
        let confirmPassword = AC.get('confirmPassword').value;
        if (password != confirmPassword) {
            console.log('matchPassword false');
            AC.get('confirmPassword').setErrors( {matchPassword: true} )
        } else {
            console.log('matchPassword true');
            return null
        }
    }

    public phone(AC: AbstractControl) {
        let phone1 = AC.get('phone1').value;
        let phone2 = AC.get('phone2').value;
        let phone3 = AC.get('phone3').value;

        if (!phone1 && !phone2 && !phone3) {
            console.log('false');
            AC.get('phone1').setErrors( {phone: true} )
            AC.get('phone2').setErrors( {phone: true} )
            AC.get('phone3').setErrors( {phone: true} )
        } else {
            console.log('phone true');
            return null
        }
    }
    
    public address(AC: AbstractControl) {
        let address1 = AC.get('address1').value;
        let address2 = AC.get('address2').value;
        let postalcode = AC.get('postalcode').value;
        let city = AC.get('city').value;

        if (!address1 && !address1 && !address2 && !postalcode && !city) {
            console.log('false');
            AC.get('address1').setErrors( {phone: true} )
            AC.get('address2').setErrors( {phone: true} )
            AC.get('postalcode').setErrors( {phone: true} )
            AC.get('city').setErrors( {phone: true} )
        } else {
            console.log('address true');
            return null
        }
    }
}