import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';

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

  public pesquisa = '';

  private alunoValidation = {
    nome: false,
    serie: false,
    nasc: false,
    cep: false,
    rua: false,
    numero_endereco: false,
    complemento: false,
    bairro: false,
    cidade: false,
    estado: false,
    nome_mae: false,
    cpf: false,
    venc:false,
  }
  private alunos: any[] = [];
  
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
  
  private limpar () {
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
    this.pesquisa = '';
  }

  private adicionarAluno(content) {
    this.alunoForm = {
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
    this.open(content);
  }

  open(content) {
    
    this.alunoValidation = {
      nome: false,
      serie: false,
      nasc: false,
      cep: false,
      rua: false,
      numero_endereco: false,
      complemento: false,
      bairro: false,
      cidade: false,
      estado: false,
      nome_mae: false,
      cpf: false,
      venc:false,
    }
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
    if(this.validacao()){
      this.http.post('http://localhost:8000/alunos', this.alunoForm)
      .subscribe(
        res => {
          console.log(res);
          this.modalService.dismissAll();
          swal.fire({
            type: 'success',
            title: 'Aluno salvo com sucesso!',
            showConfirmButton: false,
            timer: 2000
          });
          this.alunoForm = {
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
          this.http.get('http://localhost:8000/alunos')
            .subscribe(
              res => {
                this.alunos = res;
                this.isUpdating = false;
               },
              err => {
                this.isUpdating = false;
              }
          );
        },
        err => { }
      );
    }else{
      swal.fire({
        type: 'error',
        title: 'Verifique os dados digitados',
        showConfirmButton: false,
        timer: 1500
      });
    }
  	
  }

  private editAluno(aluno, content){
    this.open(content);
    this.alunoForm = aluno;
  }

  private deleteAluno(aluno){
  	this.isUpdating = true;
  	this.http.delete(`http://localhost:8000/alunos/${aluno.id}`)
    .subscribe(
        (aluno) => {
            swal.fire({
              type: 'success',
              title: 'Aluno excluído com sucesso!',
              showConfirmButton: false,
              timer: 1500
            });
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

  private getEndereco(cep){
    this.http.get(`https://viacep.com.br/ws/${cep}/json/`)
            .subscribe(
              res => {
                this.alunoForm['bairro'] = res['bairro'];
                this.alunoForm['rua'] = res['logradouro'];
                this.alunoForm['cidade'] = res['localidade'];
                this.alunoForm['estado']= res['uf']; 
                console.log(res);
               },
              err => {
                console.log(err);
              }
          );
    
  }

  private filtrar(){
    this.isUpdating = true;
    this.http.post('http://localhost:8000/alunos/filtro', {nome: this.pesquisa}).subscribe(
      res => {
        this.alunos = res;
        this.isUpdating = false;
        console.log(res);

      }

     );
  }

  private validateCPF(cpf) {
    var Soma;
    var Resto;
    Soma = 0;
    if (cpf == "00000000000") return false;
     
    for (var i=1; i<=9; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;
   
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(cpf.substring(9, 10)) ) return false;
   
    Soma = 0;
    for (i = 1; i <= 10; i++) 
      Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
   
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(cpf.substring(10, 11) ) ) return false;
    return true;

}
  private validacao() {
    if(this.alunoForm.nome == ''){
      this.alunoValidation.nome = true;
      return false;
    }

    if(!this.validateCPF(this.alunoForm.cpf)){
      this.alunoValidation.cpf = true;
      return false;
    }

    if(this.alunoForm.cep == ''){
      this.alunoValidation.cep = true;
      return false;
    }

    if(this.alunoForm.rua == ''){
      this.alunoValidation.rua = true;
      return false;
    }

    if(this.alunoForm.numero_endereco == ''){
      this.alunoValidation.numero_endereco = true;
      return false;
    }

    if(this.alunoForm.bairro == ''){
      this.alunoValidation.bairro = true;
      return false;
    }

    if(this.alunoForm.cidade == ''){
      this.alunoValidation.cidade = true;
      return false;
    }

    if(this.alunoForm.nome_mae == ''){
      this.alunoValidation.nome_mae = true;
      return false;
    }

    if(this.alunoForm.nasc == ''){
      this.alunoValidation.nasc = true;
      return false;
    }

    if(this.alunoForm.serie == ''){
      this.alunoValidation.serie = true;
      return false;
    }

    if(this.alunoForm.venc == ''){
      this.alunoValidation.venc = true;
      return false;
    }

    return true;
  }

}