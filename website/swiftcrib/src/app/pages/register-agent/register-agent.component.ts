import { Component } from '@angular/core';
import { statesLga } from './ng.states';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalService } from '../../services/portal.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SwiftcribHeaderComponent } from '../../components/swiftcrib-header/swiftcrib-header.component';
import { SwiftcribFooterComponent } from '../../components/swiftcrib-footer/swiftcrib-footer.component';

function getFormDataKeys(formData: any): string[] {
  const keys: string[] = [];
  for (const [key] of formData.entries()) {
    keys.push(key);
  }
  return keys;
}

interface IaccountInfo {
  email?: string;
  userName?: string;
  password?: string;
}

interface IpersonalInfo {
  firstName?: string;
  lastName?: string;
  phone?: string;
  altPhone?: string;
  stateOfResidence?: string;
  city?: string;
  street?: string;
  stateOfOrigin?: string;
  lga?: string;
  country?: string;
  [key: string]: string | any;
}

interface IbankDetails {
  bvn?: string;
  preferredBank?: string;
  accountNo?: string;
  accountName?: string;
  [key: string]: string | any;
}

interface Iguarantor {
  firstName?: string;
  lastName?: string;
  phone?: string;
  altPhone?: string;
  address?: string;
  workPlace?: string;
  jobDescription?: string;
  bvn?: string;
  nationalId?: File;
  [key: string]: string | any;
}

interface Iqualifications {
  highestQualification?: string;
  certificate?: File;
  nationalId?: File;
  resume?: File;
}

@Component({
  selector: 'app-register-agent',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SwiftcribHeaderComponent,
    SwiftcribFooterComponent
  ],
  providers: [PortalService],
  templateUrl: './register-agent.component.html',
  styleUrl: './register-agent.component.scss',
})
export class RegisterAgentComponent {
  public statesLga = statesLga;
  public states = this.statesLga.states.map((state) => {
    return state.name;
  });
  public selectedStateLgas: any = [];
  public qualificationsFormData: any;
  public passwordAgain: string = '@10111011qweQWE';

  public accountInformation: IaccountInfo = {
    email: 'ekoemmanueljavl@gmail.com',
    userName: 'Eko1011',
    password: '@10111011qweQWE',
  };
  public personalInformation: IpersonalInfo = {
    firstName: 'Emmanuel',
    lastName: 'Eko',
    phone: '08065062288',
    altPhone: '08100000000',
    stateOfResidence: 'Oyo',
    city: 'Ibadan',
    street: 'Ayegun, Oleyo',
    stateOfOrigin: 'Cross River',
    country: 'Nigeria',
  };
  public qualifications: any = {
    highestQualification: 'WASSCE',
  };
  public bankDetails: IbankDetails = {
    bvn: '24353452662',
    preferredBank: 'GT Bank',
    accountNo: '0123307193',
    accountName: 'Emmanuel Upo Eko',
  };
  public guarantor1Information: Iguarantor = {
    firstName: 'Emmanuel',
    lastName: 'Eko',
    phone: '08100000000',
    altPhone: '08100000000',
    address: 'Plot 10, Adron Estate, Ibadan.',
    workPlace: 'Plexada System Integrators',
    jobDescription: 'Software Developer',
    bvn: '83838992992',
  };
  public guarantor2Information: Iguarantor = {
    firstName: 'Paul',
    lastName: 'Ikhide',
    phone: '08100000001',
    altPhone: '08100000002',
    address: 'mokola, Ibadan',
    workPlace: 'Pennyhills',
    jobDescription: 'Chief Engineer',
    bvn: '73637882880',
  };

  public payload: any = {};
  public formData = new FormData();

  public validators: any = {
    accountInfo: () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /\S+/;
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$%^&*])[^\s]{8,}$/;

      if (!emailRegex.test(this.accountInformation.email!)) {
        console.error('Invalid email format');
        return false;
      }

      if (!usernameRegex.test(this.accountInformation.userName!)) {
        console.error('Username cannot be empty');
        return false;
      }

      if (!passwordRegex.test(this.accountInformation.password!)) {
        console.error(
          'Password must be at least 8 characters with a mix of letters, numbers, and special characters'
        );
        return false;
      }

      if (this.accountInformation.password !== this.passwordAgain) {
        console.error('Passwords do not match');
        return false;
      }

      return true;
    },
    personalInfo: () => {
      const requiredFields = [
        'firstName',
        'lastName',
        'phone',
        'stateOfResidence',
        'city',
        'street',
        'stateOfOrigin',
        'lga',
        'country',
      ];
      const missingFields = requiredFields.filter(
        (field) => !this.personalInformation[field]
      );

      if (missingFields.length > 0) {
        console.error(`Missing required fields: ${missingFields.join(', ')}`);
        return false;
      }

      // Phone number validation (Nigerian format)
      const phoneRegex = /^0[789]\d{9}$/;
      if (!phoneRegex.test(this.personalInformation.phone!)) {
        console.error(
          'Invalid phone number. Must be a valid Nigerian number starting with 07, 08, or 09 and 10 digits long.'
        );
        return false;
      }

      // All validations passed
      return true;
    },
    attachments: () => {
      const docs = getFormDataKeys(this.formData);
      return (
        docs.includes('certificate') &&
        docs.includes('nationalId') &&
        docs.includes('resume')
      );
    },
    bankInfo: () => {
      const requiredFields = [
        'bvn',
        'preferredBank',
        'accountNo',
        'accountName',
      ];
      const missingFields = requiredFields.filter(
        (field) => !this.bankDetails[field]!
      );

      if (missingFields.length > 0) {
        console.error(`Missing required fields: ${missingFields.join(', ')}`);
        return false;
      }

      // BVN length validation (basic check)
      if (this.bankDetails.bvn!.length !== 11) {
        console.error('Invalid BVN. Must be 11 digits long.');
        return false;
      }

      // All validations passed
      return true;
    },
    guarantorInfo: (guarantor: Iguarantor) => {
      const requiredFields = [
        'firstName',
        'lastName',
        'phone',
        'address',
        'workPlace',
        'jobDescription',
        'bvn',
      ];
      const missingFields = requiredFields.filter((field) => !guarantor[field]);
      const docs = getFormDataKeys(this.formData);
      console.log(
        'GNID ',
        docs.includes('g1nationalId'),
        docs.includes('g2nationalId')
      );
      if (!docs.includes('g1nationalId') || !docs.includes('g2nationalId')) {
        return false;
      }

      if (missingFields.length > 0) {
        console.error(
          `Missing required guarantor fields for ${guarantor.firstName} ${
            guarantor.lastName
          }: ${missingFields.join(', ')}`
        );
        return false;
      }
      return true;
    },
  };

  constructor(private portalService: PortalService, private http: HttpClient) {
    this.getStateLgas();
  }

  getStateLgas($event: any = null) {
    const stateObj = this.statesLga.states.find((state) => {
      let stateArg;
      if ($event) {
        stateArg = $event.target.value;
      } else {
        stateArg = 'Abia';
      }
      if (state.name === stateArg) {
        return state;
      } else {
        return null;
      }
    });
    this.selectedStateLgas = stateObj?.local_government_areas;
  }

  submitAccountInfo() {
    this.payload.accountInformation = this.accountInformation;
  }

  submitAgentInformation() {
    this.formData.append('data', JSON.stringify(this.payload));
    this.portalService
      .submitAgentInformation(this.qualificationsFormData)
      .subscribe(
        (response) => {
          alert(response.message);
        },
        (error) => {
          if (error === null) {
            console.error('Request timed out.');
            // Display a timeout error message to the user
          } else {
            console.error('An error occurred:', error);
          }
        }
      );
  }

  submitPersonalInfo() {
    this.payload.personalInformation = this.personalInformation;
  }

  submitQualifications() {
    this.qualificationsFormData = this.toFormData(this.qualifications);
  }

  submitBankingDetails() {
    this.payload.bankDetails = this.bankDetails;
  }

  submitGuarantorsInfo() {
    this.payload.guarantors = [
      this.guarantor1Information,
      this.guarantor2Information,
    ];
    this.submitAgentInformation();
  }

  chooseCertificate() {
    if (this.qualifications.certificate) {
      const certificateEl = document.querySelector(
        '#certificate'
      )! as HTMLInputElement;
      this.formData.append('certificate', certificateEl.files![0]);
    }
  }

  chooseNationalId() {
    if (this.qualifications.nationalId) {
      const nationalIdEl = document.querySelector(
        '#nationalId'
      )! as HTMLInputElement;
      this.formData.append('nationalId', nationalIdEl.files![0]);
    }
  }

  chooseResume() {
    if (this.qualifications.resume) {
      const resumeEl = document.querySelector('#resume')! as HTMLInputElement;
      this.formData.append('resume', resumeEl.files![0]);
    }
  }

  chooseGuarantorNationalId($event: any) {
    this.formData.append(`${$event.target.id}`, $event.target.files![0]);
  }

  toFormData(qualifications: Iqualifications): FormData {
    this.payload.qualificationInformation = {
      highestQualification: qualifications.highestQualification,
    };
    return this.formData;
  }
}
