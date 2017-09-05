import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';

import { MailInboxPage } from '../mail-inbox/mail-inbox';
import { MailOutboxPage } from '../mail-outbox/mail-outbox';
import { MailComposePage } from '../mail-compose/mail-compose';
import { MailDraftPage } from '../mail-draft/mail-draft';
import { MailTrashPage } from '../mail-trash/mail-trash';

@Component({
  selector: 'page-mailbox-tabs',
  templateUrl: 'mailbox-tabs.html'
})
export class MailboxTabsPage {
	tab1Root: any = MailInboxPage;
  tab2Root: any = MailComposePage;
  tab3Root: any = MailDraftPage;
  tab4Root: any = MailOutboxPage;
  tab5Root: any = MailTrashPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MailboxTabsPage');
  }

}
