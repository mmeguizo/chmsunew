
import { Component, OnInit,Output,EventEmitter,OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../@core/services/auth.service';
import { UserService } from '../../@core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerService } from '../../@core/services/customer.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FileService } from '../../@core/services/file.service';
import { log } from 'console';
import { TheadTitlesRowComponent } from 'ng2-smart-table/lib/components/thead/rows/thead-titles-row.component';




@Component({
  selector: 'ngx-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {

  @Output() passEntry: EventEmitter<string> = new EventEmitter<string>();
  private getSubscription = new Subject<void>();
  id : String;
  files: any;
  myFiles: any;
  myNewFiles =  [];
  theFileLength : Number = 0;

  constructor(

    public auth: AuthService,
    public user: UserService,
    public fileService: FileService,
    public customer: CustomerService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,


  ) {
   }

  ngOnInit(): void {
  }




  closeModal() {
    this.activeModal.close();
  }



  elEventListenerActive: boolean;
  openFile(ev, id){
    let file,
      el = document.getElementById(id);
      el.click();
    let handler = (fc) => {
      try{
        let fileList: any;
        let fd = new FormData();

      console.log(fc.target.files);

      for  (var index =  0; index <  fc.target.files.length; index++)  {
          this.myNewFiles.push(fc.target.files[index])
      }
      for (let i = 0; i < this.myNewFiles.length; i++) {
      fd.append('files[]', this.myNewFiles[i], this.myNewFiles[i].name);
      }

      this.fileService.addFile(fd, this.id).pipe(takeUntil(this.getSubscription)).subscribe((data: any) => {
        this.theFileLength = this.myNewFiles.length || fc.target.length;
        this.passEntry.emit('upload okay')
        this.closeModal();
        this.elEventListenerActive = false;
        el.removeEventListener('change', handler);
     });
          }catch(e){
            // this.Product.image = '';
            console.log(e);
            ev.target.innerHTML = 'Browse';
            this.elEventListenerActive = false;
            el.removeEventListener('change', handler);
          }
        }
    if( !this.elEventListenerActive ){
      el.addEventListener('change', handler);
      this.elEventListenerActive = true;
    }
  }



}
