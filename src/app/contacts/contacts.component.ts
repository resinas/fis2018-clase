import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Contact[];
  selectedContact: Contact;
  newContact: Contact = {
    name: null,
    phone: null
  };

  constructor(private contactService: ContactService) { }

  addContact() {
    this.contacts.push(this.newContact);
    this.newContact = {
      name: null,
      phone: null
    }
  }

  getContacts() {
    this.contactService.getContacts()
      .subscribe((contacts) => {
        this.contacts = contacts;
      });
  }

  ngOnInit() {
    this.getContacts();
  }

}
