import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  closeResult: string;

  constructor(private modalService: NgbModal, private http: HttpClient) {}
  
  private alunoForm = {
  	nome: '',
  	serie: '',
  	nasc: '',
  	cep: '',
  	rua: '',
  	numero_endereco: '',
  	complemento: '',
  	bairro: '',
  	cidade: '',
  	estado: '',
  	nome_mae: '',
  	cpf: '',
  	venc: ''
  };

  private alunos:any[] = [];
  private isUpdating = false;
  ngOnInit(){
  	this.isUpdating = true;
  	this.http.get('http://localhost:8000/alunos')
      .subscribe(
        res => {
        	this.alunos = res;
        	this.isUpdating = false;
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private saveAluno(){
  	this.http.post('http://localhost:8000/alunos', this.alunoForm)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  	console.log(this.alunoForm);
  	//modal.close('Save click')
  }

  private editAluno(aluno){

  }

  private deleteAluno(aluno){
  	this.isUpdating = true;
  	this.http.delete(`http://localhost:8000/alunos/${aluno.id}`)
    .subscribe(
        (aluno) => {
            console.log("DELETE call successful value returned in body", 
                        aluno);
            this.http.get('http://localhost:8000/alunos')
              .subscribe(
                res => {
                  this.alunos = res;
                  this.isUpdating = false;
                  console.log(res);
                },
                err => {
                  this.isUpdating = false;
                  console.log("Error occured");
                }
            );
        },
        response => {
          this.isUpdating=false;
            console.log("DELETE call in error", response);
        },
        () => {
          
        });

  }



}