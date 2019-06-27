import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SessionStorage } from '../../../models/session-storage'; 

@Component({
  selector: 'custom-agent-declaration',
  templateUrl: './custom-agent-declaration.component.html',
  styleUrls: ['./custom-agent-declaration.component.css']
})
export class CustomAgentDeclarationComponent implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
