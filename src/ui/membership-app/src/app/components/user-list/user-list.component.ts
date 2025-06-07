import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { AddUserFormComponent } from '../add-user-form/add-user-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AddUserFormComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  showAddForm = false;
  pageSize = 10;
  currentPage = 1;
  editUser: User | null = null;
  filterText = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.applyFilter();
    });
  }

  onUserAdded(user: User) {
    this.userService.addUser(user).subscribe(() => {
      this.showAddForm = false;
      this.loadUsers();
    });
  }

  deleteUser(id: number) {
    const passcode = prompt('Enter passcode to delete this user:');
    if (passcode === '4336') {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    } else if (passcode !== null) {
      alert('Incorrect passcode. User was not deleted.');
    }
  }

  applyFilter() {
    const term = this.filterText.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      (user.firstName && user.firstName.toLowerCase().includes(term)) ||
      (user.middleName && user.middleName.toLowerCase().includes(term)) ||
      (user.lastName && user.lastName.toLowerCase().includes(term)) ||
      (user.emailAddress && user.emailAddress.toLowerCase().includes(term)) ||
      (user.city && user.city.toLowerCase().includes(term))
    );
    this.currentPage = 1;
    this.sortBy(this.sortColumn, false); // keep sorting after filtering
  }

  sortBy(column: string, toggle: boolean = true) {
    if (!column) return;
    if (toggle) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
    } else {
      this.sortColumn = column;
    }
    this.filteredUsers.sort((a, b) => {
      const aValue = (a as any)[column] || '';
      const bValue = (b as any)[column] || '';
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  pagedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredUsers.length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  onEditUser(user: User) {
    // Deep clone to avoid mutating the table directly
    this.editUser = JSON.parse(JSON.stringify(user));
    this.showAddForm = true;
  }

  onUserSaved(user: User) {
    if (this.editUser && this.editUser.id) {
      // Update existing user
      this.userService.updateUser({ ...user, id: this.editUser.id }).subscribe(() => {
        this.showAddForm = false;
        this.editUser = null;
        this.loadUsers();
      });
    } else {
      // Add new user
      this.userService.addUser(user).subscribe(() => {
        this.showAddForm = false;
        this.loadUsers();
      });
    }
  }

  onCancelEdit() {
    this.showAddForm = false;
    this.editUser = null;
  }

  exportToCSV() {
    const headers = [
      'First Name', 'Middle Name', 'Last Name', 'Gender', 'Phone', 'Email', 'City', 'State', 'Member Type', 'Spouse', 'Kids'
    ];
    const rows = this.users.map(user => {
      const spouse = user.spouse
        ? `${user.spouse.firstName} ${user.spouse.middleName} ${user.spouse.lastName}`.replace(/\s+/g, ' ').trim()
        : '';
      const kids = user.kids && user.kids.length > 0
        ? user.kids.map(kid =>
            `${kid.firstName} ${kid.middleName} ${kid.lastName}`.replace(/\s+/g, ' ').trim()
          ).join('; ')
        : '';
      return [
        user.firstName,
        user.middleName,
        user.lastName,
        user.gender,
        user.phoneNumber,
        user.emailAddress,
        user.city,
        user.state,
        user.memberType,
        spouse,
        kids
      ].map(field => `"${(field ?? '').replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
