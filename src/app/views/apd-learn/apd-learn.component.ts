import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import {
  TupleService,
  AuthService,
  BackendPageService,
  BaseComponent,
  CallService,
  FileService,
  FlowchartService,
  ModalService,
  WebcamService,
  OptionData,
  StatusBarOptionsData
} from 'ejflab-front-lib';


@Component({
  selector: 'app-apd-learn',
  templateUrl: './apd-learn.component.html',
  styleUrl: './apd-learn.component.css'
})
export class ApdLearnComponent extends BaseComponent implements OnInit, OnDestroy {
  public extraOptions: Array<OptionData> = [];
  public statusBarOptions: StatusBarOptionsData = {
    displayUserName: true,
    createDocument: false,
    deleteDocument: false,
    editDocument: false,
    editDocumentPermissions: false,
    searchDocuments: false
  };
  statusBarTextStyle: { [key: string]: string } = {
    "color": "black",
  };

  constructor(
    public override route: ActivatedRoute,
    public override pageService: BackendPageService,
    public override cdr: ChangeDetectorRef,
    public override authService: AuthService,
    public override dialog: MatDialog,
    public override tupleService: TupleService,
    public override fileService: FileService,
    public override modalService: ModalService,
    public override webcamService: WebcamService,
    flowchartSrv: FlowchartService,
    callService: CallService,
    auth: Auth
  ) {
    super(
      flowchartSrv,
      callService,
      route,
      pageService,
      cdr,
      authService,
      dialog,
      tupleService,
      fileService,
      modalService,
      webcamService,
      auth
    );
  }

  override async ngOnInit() {
    await super.ngOnInit();
  }

  override async ngOnDestroy() {
    super.ngOnDestroy();
  }

  override bindEvents() {
    //
  }
}
