import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../services/user.service';

@Component({
  selector: 'app-add-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css']
})
export class AddUserFormComponent implements OnChanges {
  @Input() user: User | null = null;
  @Output() userSaved = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  newUser: User = {
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    streetAddress: '',
    city: '',
    state: 'Maryland',
    phoneNumber: '',
    emailAddress: '',
    memberType: 'general',
    renewed: false,
    spouse: { firstName: '', middleName: '', lastName: '' }, // always an object
    kids: []
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.newUser = JSON.parse(JSON.stringify(this.user));
      // Ensure spouse is always an object
      if (!this.newUser.spouse) {
        this.newUser.spouse = { firstName: '', middleName: '', lastName: '' };
      }
      if (!this.newUser.kids) {
        this.newUser.kids = [];
      }
    } else if (changes['user'] && !this.user) {
      this.newUser = {
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        streetAddress: '',
        city: '',
        state: 'Maryland',
        phoneNumber: '',
        emailAddress: '',
        memberType: 'general',
        renewed: false,
        spouse: { firstName: '', middleName: '', lastName: '' },
        kids: []
      };
    }
  }

  addKid() {
    this.newUser.kids!.push({ firstName: '', middleName: '', lastName: '' });
  }

  removeKid(index: number) {
    this.newUser.kids!.splice(index, 1);
  }

  submitForm() {
    this.userSaved.emit(this.newUser);
    // Do not reset form here, let parent handle
  }

  formatPhoneNumber() {
    if (!this.newUser.phoneNumber) return;
    // Remove all non-digit characters
    let cleaned = this.newUser.phoneNumber.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    if (cleaned.length > 3 && cleaned.length <= 6) {
      this.newUser.phoneNumber = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      this.newUser.phoneNumber = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else {
      this.newUser.phoneNumber = cleaned;
    }
  }

  onMemberTypeChange(type: string) {
    if (type === 'life') {
      this.newUser.renewed = true; // Reset renewed for life members
    }
  } 
}
