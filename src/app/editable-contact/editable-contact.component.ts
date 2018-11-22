import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../contact'

@Component({
  selector: '[app-editable-contact]',
  templateUrl: './editable-contact.component.html',
  styleUrls: ['./editable-contact.component.css']
})
export class EditableContactComponent implements OnInit {

  @Input() contact: Contact;
  editable = false;

  constructor() { }


  onEdit() {
    this.editable = ! this.editable;
  }

  ngOnInit() {
  }

}
