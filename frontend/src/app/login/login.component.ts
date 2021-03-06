import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Login } from './login';
import { Router } from '@angular/router';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Register } from './register';

import { AlertService } from '../_services/index';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = "Login";
  closeResult: string;
  model = new Login('system', 'password');
  regModel = new Register('', '', '');
  

  @ViewChild('content') modalRef: NgbModalRef;
  @Input() loginEnabled = true; 
  @Input() registerEnabled = true;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private titleService: Title,
    private modalService: NgbModal,
    private http: HttpClient
    ) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

  loginSubmit(logForm: NgForm) {
    let tempName = logForm.value.name;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post("http://localhost:8080/login",
      { name: logForm.value.name, password: logForm.value.password },
      { headers: headers }
    ).subscribe(results => {
      logForm.reset();
      if (results) {
        this.router.navigateByUrl('/home');
        this.alertService.success("Welcome " + tempName);
      } else {
        this.model = new Login('system', 'password');
        this.alertService.error("Failed to login. Try again.");
      }
    });
  }
  
  newTask() { this.model = new Register('', '', ''); }

  regSubmit(regForm: NgForm) {
    console.log(regForm.value);
    this.alertService.success("User account " + regForm.value.username + " created successfully");
    this.http
      .post(
        "http://localhost:8080/login",
        { name: regForm.value.username, password: regForm.value.password }
      ).subscribe(results => {
        console.log("Results from REG POST");
        console.log(results);
      });
  }
  /*Register() {
    this.router.navigateByUrl('/register');
  }*/


  // These functions make alerts to the web page
  // you can use them by calling this.success("My alert message").
  success(message: string) {
    this.alertService.success(message);
  }

  error(message: string) {
    this.alertService.error(message);
  }

  info(message: string) {
    this.alertService.info(message);
  }

  warn(message: string) {
    this.alertService.warn(message);
  }

  clear() {
    this.alertService.clear();
  }

  // Modal Stuff
  openModal(content) {
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeModal() { this.modalRef.close(); }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponentWrapper {
  @ViewChild(LoginComponent) myComponent: LoginComponent;
}
