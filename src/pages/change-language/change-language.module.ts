import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeLanguagePage } from './change-language';

@NgModule({
  declarations: [
    ChangeLanguagePage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeLanguagePage),
  ],
})
export class ChangeLanguagePageModule {}
