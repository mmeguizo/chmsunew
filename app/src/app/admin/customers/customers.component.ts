


import { Component, OnInit, OnDestroy,ViewChild, ElementRef } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import { UserService } from '../../@core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { takeUntil } from 'rxjs/operators';
import { CustomerService } from '../../@core/services/customer.service';
import { CommonComponent } from '../../shared/common/common.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../@core/services/auth.service';
import { DataTableDirective } from 'angular-datatables';
import { log } from 'console';
import { CustomerModalComponent } from '../../shared/customer-modal/customer-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesComponent } from '../../shared/files/files.component';



@Component({
  selector: 'ngx-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  bsValue = new Date();
  filterQuery = '';
  sortBy = 'id';
  sortOrder = 'asc';
  selectQueryString = 'Last Name';
  selectQuery = 'lname';
  data;
  loading = true;
  date = new Date();
  todate;
  public socketInstance;
  me;

  @ViewChild(NbPopoverDirective, { static: false }) popover: NbPopoverDirective;
  @ViewChild("search", {static: false}) nameField: ElementRef;


  dataSource
  private getCustomerSubscription = new Subject<void>();
  constructor(
    public customer : CustomerService,
    public ngbModal: NgbModal,
    public auth : AuthService,
    public route : Router,
    public router : ActivatedRoute,

  ) {

   }

  ngOnInit() {
    this.data = [];

    this.getAllUsers();



  }

  getAllUsers() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.customer.getAllCustomers().pipe(takeUntil(this.getCustomerSubscription)).subscribe((data: any) => {
      console.log('getAllCustomers');
      console.log(data);

        this.data = data.customer;
       this.loading = false;
      //  this.data = (data as any).data;
       // Calling the DT trigger to manually render the table
       this.dtTrigger.next();
     });

}

selectFilter(name, value){
  this.selectQuery = name;
  this.selectQueryString = value;
  this.popover.hide();
  setTimeout(() => this.nameField.nativeElement.focus(), 0);
  this.filterQuery = "";
}

ngOnDestroy(): void {
  // Do not forget to unsubscribe the event
  this.dtTrigger.unsubscribe();
  this.getCustomerSubscription.unsubscribe();
}

changeStatus(customer){

  const activeModal = this.ngbModal.open(CommonComponent, { size: 'sm', container: 'nb-layout', windowClass: 'min_height', backdrop: 'static' });
  activeModal.componentInstance.frontEnddata = {
     id : customer.id,
     status : customer.status === 'inactive' ? 'active' : 'inactive'
  };
  activeModal.componentInstance.anyVariable = customer.name;
  activeModal.componentInstance.model = 'customers';
  activeModal.componentInstance.endpointType = 'put';
  activeModal.componentInstance.apiName = 'changeCustomerStatus';
  activeModal.componentInstance.headerTitle = 'Status Change';
  activeModal.componentInstance.bodyContent = 'Changing Status of';
  activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
     receivedEntry &&
     [this.auth.makeToast('success','Changing Status Success',`Status change ${customer.name}`),
     this.rerender()]
  });
}


rerender(): void {

  this.customer.getAllCustomers().pipe(takeUntil(this.getCustomerSubscription)).subscribe((data: any) => {
    this.data = data.customer;
   this.loading = false;
 });

  this.dtElement?.dtInstance?.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next();
  });
}


updateCustomer(id){
  const activeModal = this.ngbModal.open(CustomerModalComponent, { size: 'sm', container: 'nb-layout', windowClass: 'min_height', backdrop: 'static' });
  activeModal.componentInstance.buttonStatus = "success";
  activeModal.componentInstance.buttonTxt = "update";
  activeModal.componentInstance.action = "update";
  activeModal.componentInstance.updateUser = true;
  activeModal.componentInstance.customerData = {
    endpoint : 'put',
    apiName :  'findById',
    apiName2 : 'updateCustomer',
    endpoint2 : 'put',
    id : id,
  };
  activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
    receivedEntry.success ?
    [this.auth.makeToast('success',`Updating ${receivedEntry.data?.name}`,receivedEntry.message),
    this.rerender()] : [this.auth.makeToast('danger',`Updating ${receivedEntry.data?.name || 'failed'}`,receivedEntry.message),
    this.rerender()]
 });

}

deleteCustomer(customer){
  const activeModal = this.ngbModal.open(CommonComponent, { size: 'sm', container: 'nb-layout', windowClass: 'min_height', backdrop: 'static' });
  activeModal.componentInstance.username = customer.name;
  activeModal.componentInstance.id = customer.id;
  activeModal.componentInstance.frontEnddata = customer;
  activeModal.componentInstance.model = 'customers';
  activeModal.componentInstance.endpointType = 'put';
  activeModal.componentInstance.apiName = 'deleteCustomer';
  activeModal.componentInstance.headerTitle = 'Deleting';
  activeModal.componentInstance.bodyContent = 'Deleting';
  activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {
    receivedEntry.success ?
    [this.auth.makeToast('success',`Deleting ${receivedEntry.data?.name || customer.name}`,receivedEntry.message),
    this.rerender()] : [this.auth.makeToast('danger',`Deleting ${receivedEntry.data?.name || 'failed'}`,receivedEntry.message),
    this.rerender()]
  });

}
addCustomer(){
  const activeModal = this.ngbModal.open(CustomerModalComponent, { size: 'sm', container: 'nb-layout', windowClass: 'min_height', backdrop: 'static' });
  activeModal.componentInstance.customerData = {

    endpoint : 'post',
    apiName : 'addCustomer',


  };
  activeModal.componentInstance.model = 'customers';
  activeModal.componentInstance.endpointType = 'post';
  activeModal.componentInstance.endpoint = 'post';
  activeModal.componentInstance.apiName = 'addCustomer';
  activeModal.componentInstance.passEntry.subscribe((receivedEntry) => {

    receivedEntry.success ?
    [this.auth.makeToast('success',`Adding Customer`,receivedEntry.message),
    this.rerender()] : [this.auth.makeToast('danger',`Adding Customer ${receivedEntry.data?.username || 'failed'}`,receivedEntry.message),
    this.rerender()]

    //  receivedEntry &&
    //  [this.auth.makeToast('success','Adding Customer',`Success adding customer`),
    //  this.rerender()];
  });

}


viewAttachment(id){

  const activeModal = this.ngbModal.open(FilesComponent, { size: 'xl', container: 'nb-layout', windowClass: 'min_height' });
  activeModal.componentInstance.id = id;

}

}

