import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Spouse {
  id?: number;
  firstName: string;
  middleName: string;
  lastName: string;
}
export interface Kid {
  id?: number;
  firstName: string;
  middleName: string;
  lastName: string;
}
export interface User {
  id?: number;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  streetAddress: string;
  city: string;
  state: string;
  phoneNumber: string;
  emailAddress: string;
  memberType: 'general' | 'life';
  renewed: boolean;
  spouse?: Spouse;
  kids?: Kid[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
