import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
  StatusBarOptionsData,
  MyUserOptionsData
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
  statusBarUserOptions: MyUserOptionsData = {
    editEmail: true,
    editName: true,
    editPhone: false,
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
    public override flowchartSrv: FlowchartService,
    public override callService: CallService,
    public override auth: Auth,
    public router: Router,
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

    this.createMenu();
  }

  createMenu() {
    this.extraOptions.push({
      label: "Preguntas de entrenamiento",
      icon: "menu_book",
      action: () => {
        this.router.navigate(['apd-learn', "theory"]);
      },
    });
    this.extraOptions.push({
      label: "Lista de chequeo",
      icon: "checklist",
      action: () => {
        this.router.navigate(['apd-learn', "checklist"]);
      },
    });
    this.extraOptions.push({
      label: "Puntuaciones",
      icon: "emoji_events",
      action: () => {
        this.router.navigate(['apd-learn', "leaderboard"]);
      },
    });
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
