import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { FilterListComponent } from '../../../../shared/ui/filter-list/filter-list.component';
import { ListHeaderComponent } from '../../../../shared/ui/list-header/list-header.component';
import { debounceTime, distinctUntilChanged, switchMap, Subject, Subscription, finalize } from 'rxjs';
import { CrmFormComponent } from '../crm-form/crm-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CrmService } from '../../../../core/services/crm.service';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { ExportExcel } from '../../../../shared/utils/exportExcel';
import { Router } from '@angular/router';
import { MatDialog,MatDialogContent, MatDialogActions,MatDialogModule } from '@angular/material/dialog';
import { CrmDetailsComponent } from '../crm-details/crm-details.component';
import { ChatService } from '../../../../core/services/chatHub.service';
import { MatButtonModule } from '@angular/material/button';
import { ValiditiesService } from '../../../../core/services/validities.service';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-crm-list',
  standalone: true,
  providers: [provideNativeDateAdapter(), ConfirmationService, MessageService],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MenuModule,
    ToastModule,
    ListHeaderComponent,
    FilterListComponent,
    HasRoleDirective,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogModule,
    MatOptionModule
  ],
  templateUrl: './crm-list.component.html',
  styleUrl: './crm-list.component.scss',
})
export class CrmListComponent implements AfterViewInit,OnInit,OnDestroy{
  filters = {
    SearchTerm: '',
    createdBy: '',
    PageNumber: 1,
    PageSize: 1, // Show one record at a time
    StartDate: '',
    EndDate: '',
  };


  userId: string = '';
  user:any ;
  message: string = '';
  connectionStatus = 'No Status';
  private hubConnection!: signalR.HubConnection;
  private currentGroupName: string = '';
  private subscriptions: Subscription[] = [];

  // Add properties to track online and disconnected users
  onlineUsers: string[] = [];
  disconnectedUsers: string[] = [];

  async ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Leave the group explicitly before stopping the connection
    if (this.currentGroupName && this.chatService.hubConnection) {
      try {
        await this.chatService.leaveGroup(this.currentGroupName);
      } catch (error) {
        console.error('Error leaving group:', error);
      }
    }
    
    // Stop the hub connection
    if (this.chatService.hubConnection) {
      await this.chatService.hubConnection.stop();
      console.log('SignalR connection stopped');
    }
  }

  msgLoading = false;
  async InitiateChatConnection(record: any): Promise<void> {
    if (!this.hasAccessToChat(record)) {
      this.messageService.add({ severity: 'warn', summary: 'Access Denied', detail: 'You are not allowed to join this chat group.' });
      return;
    }
    this.msgLoading = true;
    const groupName = record.responsibleName;
    this.currentGroupName = groupName; // Store the current group name
    this.chatService.startConnection();

    this.user = localStorage.getItem('currentUser') || '';
    this.userId = JSON.parse(this.user).id;

    this.chatService.registerMessageListener(groupName, (message) => {
      console.log(`Message from ${message.userName}: ${message.message} at ${message.timestamp}`);
    });

    this.chatService.hubConnection.onreconnecting(() => {
      this.connectionStatus = 'Reconnecting...';
    });

    this.chatService.hubConnection.onreconnected(() => {
      this.connectionStatus = 'Connected';
    });

    this.chatService.hubConnection.onclose(() => {
      this.connectionStatus = 'Disconnected. Attempting to reconnect...';
    });

    // Subscribe to online users updates
    const onlineUsersSub = this.chatService.onlineUsersSubject.subscribe(users => {
      this.onlineUsers = users;
    });
    this.subscriptions.push(onlineUsersSub);

    // Subscribe to disconnected users updates
    const disconnectedUsersSub = this.chatService.disconnectedUsersSubject.subscribe(users => {
      this.disconnectedUsers = users;
    });
    this.subscriptions.push(disconnectedUsersSub);

    // Wait for connection to be established before joining the group
    await this.waitForConnectionToBeEstablished();
    await this.chatService.joinGroup(groupName);
    this.msgLoading = false;
  }

  private async waitForConnectionToBeEstablished(): Promise<void> {
    const maxRetries = 10;
    let retries = 0;

    while (this.chatService.hubConnection.state !== 'Connected' && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 500));
      retries++;
    }

    if (this.chatService.hubConnection.state !== 'Connected') {
      console.error('SignalR connection could not be established in time.');
      throw new Error('Connection not established');
    }
  }

  @ViewChild('scrollMe') private messageContainer!: ElementRef;

  ngAfterViewInit() {
    // this.scrollToBottom();
  }

  scrollToBottom(): void {
    // try {
    //   this.messageContainer.nativeElement.scroll({
    //     top: this.messageContainer.nativeElement.scrollHeight,
    //     behavior: 'smooth'
    //   });
    // } catch (err) {
    //   console.error(err);
    // }
  }

  public sendMessage(groupName: string): void {
    this.chatService.sendMessageToGroup(groupName,this.userId, this.message);
    this.message = '';
    this.chatService.getGroupMessages(groupName);
    setTimeout(() => this.scrollToBottom(), 100);
    console.log(this.chatService.messages)
  }
  username:any;

  hasAccessToChat(record: any): boolean {
    // console.log(currentUser);
    const isSuperAdmin = this.currentRole === 'SuperAdmin';
    const isOM = this.currentRole === 'OperationsManager';
    const isCreator = record.createdByUserName === this.username;
    const result = isSuperAdmin || isCreator || isOM;
    if(result) this.scrollToBottom();
    return result;
  }

  // New method to get disconnected users
  getDisconnectedUsers(): string[] {
    return this.disconnectedUsers;
  }

  // New method to check if a user is disconnected
  isUserDisconnected(userName: string): boolean {
    return this.disconnectedUsers.includes(userName);
  }

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private crmService: CrmService,
    private router: Router,
    public chatService: ChatService,
    private userService: ValiditiesService,
    private fb: FormBuilder,
  ) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = currentUser.userName || '';
    this.getSalesPeople();
    this.filters.createdBy = this.username==='SuperAdmin'?'':this.username;
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(() => this.crmService.getList(this.filters))
      )
      .subscribe((results: any) => {
        this.dataSource = results.data;
        console.log(results.data)
        this.totalCount = results.totalCount;
      });
  }

  dataSource: any[] = [];
  private searchSubject = new Subject<string>();

  updateSearch(value: string) {
    this.searchSubject.next(value);
    this.filters.SearchTerm = value;
  }

  navigateToForm() {
    this.router.navigate(['/crm/new']);
  }

  show(emp: any) {
    this.record = { ...emp };
    this.openDialog();
  }

  editRecord(id: any) {
    // TODO: Implement edit functionality
    console.log('Edit record');
    this.router.navigate([`/crm/edit/${id}`]);
  }

  exportExcel() {
    this.crmService.exportExcel().subscribe((file: any) => {
      ExportExcel(file, 'customers');
    });
  }

  // dialog
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(CrmDetailsComponent, {
      width: '60vw',
      data: {
        ...this.record,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.getList();
      }
    });
  }
  @ViewChild('phoneDialog') phoneDialog!: TemplateRef<any>;
  @ViewChild('emailDialog') emailDialog!: TemplateRef<any>;


  openCallDialog() {
    this.dialog.open(this.phoneDialog,{
      width: '40vw',
    });
  }
  openEmailDialog() {
    this.dialog.open(this.emailDialog,{
      width: '40vw',
    });
  }
  
  onPageChange(event: any) {
    this.filters.PageSize = event.pageSize;
    this.filters.PageNumber = event.pageIndex + 1;
    this.getList();
  }

  record: any;
  editCustomer(record: any) {
    this.record = record;
  }

  filterHandler(isRemoved?: boolean) {
    this.filters.StartDate = formatDate(
      this.filters.StartDate,
      'yyyy-MM-dd',
      'en-US'
    );
    this.filters.EndDate = formatDate(
      this.filters.EndDate,
      'yyyy-MM-dd',
      'en-US'
    );
    if (isRemoved) {
      this.filters.StartDate = '';
      this.filters.EndDate = '';
    }
    this.getList();
  }


  selectedStatus: string = '1'; // default value
  selectedAction: string = '4'; // default value

  updateStatusAndAction() {
    const id = this.dataSource[0]?.id; // or whatever the id is
    console.log(this.selectedAction)
    console.log(this.selectedStatus)
    const customerForm = this.fb.group({
          id:this.dataSource[0]?.id,
          responsibleName: [this.dataSource[0]?.responsibleName],
          responsiblePosition: [this.dataSource[0]?.responsiblePosition],
          phoneNumber: [this.dataSource[0]?.phoneNumber],
          mobileNumber: [this.dataSource[0]?.mobileNumber],
          email: [this.dataSource[0]?.email],
          status: [Number(this.selectedStatus)],
          action: [Number(this.selectedAction)],
          notes: [this.dataSource[0]?.notes],
          taxRecord: [this.dataSource[0]?.taxRecord],
          taxNumber: [this.dataSource[0]?.taxNumber],
          createdByUsername: [this.dataSource[0]?.createdByUserName],
          companyName: [this.dataSource[0]?.companyName],
          companyAddress: [this.dataSource[0]?.companyAddress],
          city: [this.dataSource[0]?.city],
        });
      let formData = customerForm.value;

    if (!id) return;
    this.crmService
              .update({ ...formData })
              .pipe()
              .subscribe(() => {
                // this.isLoading = false;
                this.messageService.add({
                  severity: 'success',
                  summary: 'تم التحديث',
                  detail: 'تم تحديث العميل بنجاح',
                });
                // this.router.navigate(['/crm/']);
                this.getList();
              });
    // this.crmService.updateStatus(id, this.selectedStatus).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     this.crmService.updateAction(id, this.selectedAction).subscribe({
    //       next: (res) => {
    //         console.log(res);
    //         console.log('Status and Action updated successfully');
    //         this.getList();
    //       },
    //       error: err => console.error('Failed to update action', err)
    //     });
    //   },
    //   error: err => console.error('Failed to update status', err)
    // });
  }
  actionTranslationMap: { [key: string]: any } = {
    'اتصال هاتفي': 1,
    'اجتماع': 2,
    'ترحيل للاسبوع القادم': 3,
    'إسناد لموظف آخر': 4,
    'ارسال العقد': 5,
    'اغلاق الصفقه': 6,
  };

  statusTranslationMap: { [key: string]: any } = {
    'فعلي': 1,
    'محتمل': 2,
    'متردد': 3,
    'غير مهتم': 4,
  };

  totalCount: number = 0;
  loading = true;
  getList() {
    this.crmService.getList(this.filters).subscribe((res: any) => {
      this.loading = false;
      this.dataSource = res.data;
      console.log(this.dataSource)
      this.selectedAction = this.actionTranslationMap[this.dataSource[0]?.action] || '';
      this.selectedStatus = this.statusTranslationMap[this.dataSource[0]?.status] || '';
      this.InitiateChatConnection(this.dataSource[0]);
      this.totalCount = res.totalCount;
    });
  }
  sales:any[]=[];
  getSalesPeople(){
    const filters={
      roleSearchTerm:'أخصائي مبيعات'
    }
    this.userService.getUsersByRole(filters).subscribe((res: any) => {
      this.sales = res;
      console.log(res);
    });
  }

  async clearGroupMessages(groupName: string) {
    if (confirm('Are you sure you want to delete all messages in this group?')) {
      try {
        await this.chatService.clearGroupMessages(groupName);
      } catch (error) {
        console.error('Failed to clear group messages:', error);
      }
    }
  }
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  openConfirmDialog(groupName: string) {
    const dialogRef = this.dialog.open(this.confirmDialog, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        try {
          await this.chatService.clearGroupMessages(groupName);
          // Optional: show success notification here
        } catch (error) {
          console.error('Failed to clear group messages:', error);
        }
      }
    });
  }
  currentRole = localStorage.getItem('role');
  ngOnInit(): void {
    this.getList();
  }
}
