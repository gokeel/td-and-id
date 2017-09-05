import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

// tambahan - start

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import {Http, HttpModule} from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoginPage } from '../pages/login/login';
import { RegisterUserPage } from '../pages/register-user/register-user';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { SignupForm1Page } from '../pages/signup-form1/signup-form1';
import { SignupForm2Page } from '../pages/signup-form2/signup-form2';
import { PopPostPage } from '../pages/pop-post/pop-post';
import { DashboardStudentPage } from '../pages/dashboard-student/dashboard-student';
import { DashboardTutorPage } from '../pages/dashboard-tutor/dashboard-tutor';
import { WizardAreaMengajarPage } from '../pages/wizard-area-mengajar/wizard-area-mengajar';
import { WizardCourseProgramPage } from '../pages/wizard-course-program/wizard-course-program';
import { WizardPersonalTutorPage } from '../pages/wizard-personal-tutor/wizard-personal-tutor';
import { WizardPersonalStudentPage } from '../pages/wizard-personal-student/wizard-personal-student';
import { WizardEducationTutorPage } from '../pages/wizard-education-tutor/wizard-education-tutor';
import { BankAccountPage } from '../pages/bank-account/bank-account';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { FrontStudentPage } from '../pages/front-student/front-student';
import { FrontTutorPage } from '../pages/front-tutor/front-tutor';
import { HelpTabsPage } from '../pages/help-tabs/help-tabs';
import { HelpTellUsPage } from '../pages/help-tell-us/help-tell-us';
import { HelpFaqPage } from '../pages/help-faq/help-faq';
import { AccountTutorPage } from '../pages/account-tutor/account-tutor';
import { AccountStudentPage } from '../pages/account-student/account-student';
import { EditProfileStudentPage } from '../pages/edit-profile-student/edit-profile-student';
import { EditProfileTutorPage } from '../pages/edit-profile-tutor/edit-profile-tutor';
import { SearchTutorPage } from '../pages/search-tutor/search-tutor';
import { OrderChooseTutorPage } from '../pages/order-choose-tutor/order-choose-tutor';
import { OrderFormPage } from '../pages/order-form/order-form';
import { OrderReviewPage } from '../pages/order-review/order-review';
import { CourseStudentTabsPage } from '../pages/course-student-tabs/course-student-tabs';
import { MonitorOrderTabsPage } from '../pages/monitor-order-tabs/monitor-order-tabs';
import { OrderInprogressPage } from '../pages/order-inprogress/order-inprogress';
import { OrderCompletedPage } from '../pages/order-completed/order-completed';
import { MonitorOrderTutorTabsPage } from '../pages/monitor-order-tutor-tabs/monitor-order-tutor-tabs';
import { OrderInprogressTutorPage } from '../pages/order-inprogress-tutor/order-inprogress-tutor';
import { OrderCompletedTutorPage } from '../pages/order-completed-tutor/order-completed-tutor';
import { OrderTutorDetailPage } from '../pages/order-tutor-detail/order-tutor-detail';
import { OrderStudentDetailPage } from '../pages/order-student-detail/order-student-detail';
import { TutorOpenedCityPage } from '../pages/tutor-opened-city/tutor-opened-city';
import { TutorOpenedCityAddPage } from '../pages/tutor-opened-city-add/tutor-opened-city-add';
import { TutorOpenedCoursePage } from '../pages/tutor-opened-course/tutor-opened-course';
import { TutorOpenedCourseAddPage } from '../pages/tutor-opened-course-add/tutor-opened-course-add';
import { SearchTutorByProgramPage } from '../pages/search-tutor-by-program/search-tutor-by-program';
import { SearchTutorAllProgramPage } from '../pages/search-tutor-all-program/search-tutor-all-program';
import { NotificationPage } from '../pages/notification/notification';
import { NotifDetailPage } from '../pages/notif-detail/notif-detail';
import { MailboxTabsPage } from '../pages/mailbox-tabs/mailbox-tabs';
import { MailInboxPage } from '../pages/mail-inbox/mail-inbox';
import { MailOutboxPage } from '../pages/mail-outbox/mail-outbox';
import { MailComposePage } from '../pages/mail-compose/mail-compose';
import { MailDraftPage } from '../pages/mail-draft/mail-draft';
import { MailTrashPage } from '../pages/mail-trash/mail-trash';
import { InvoicePaymentPage } from '../pages/invoice-payment/invoice-payment';
import { PaymentConfirmationPage } from '../pages/payment-confirmation/payment-confirmation';
import { OtestAssignmentListPage } from '../pages/otest-assignment-list/otest-assignment-list';
import { OtestPreviewPage } from '../pages/otest-preview/otest-preview';
import { OtestRunningPage } from '../pages/otest-running/otest-running';
import { OtestResultPage } from '../pages/otest-result/otest-result';
import { TutorCommissionPage } from '../pages/tutor-commission/tutor-commission';
import { RunningCoursePage } from '../pages/running-course/running-course';
import { PresenceListTutorPage } from '../pages/presence-list-tutor/presence-list-tutor';
import { PresenceListStudentPage } from '../pages/presence-list-student/presence-list-student';

// tambahan - end

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '1a1ae984'
  },
  'push': {
    'sender_id': '111926407216',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterUserPage,
    SignUpPage,
    SignupForm1Page,
    SignupForm2Page,
    PopPostPage,
    DashboardStudentPage,
    DashboardTutorPage,
    WizardAreaMengajarPage,
    WizardCourseProgramPage,
    WizardPersonalTutorPage,
    WizardPersonalStudentPage,
    WizardEducationTutorPage,
    BankAccountPage,
    ChangePasswordPage,
    FrontStudentPage,
    HelpTabsPage,
    HelpTellUsPage,
    HelpFaqPage,
    AccountTutorPage,
    AccountStudentPage,
    EditProfileStudentPage,
    EditProfileTutorPage,
    SearchTutorPage,
    OrderChooseTutorPage,
    OrderFormPage,
    OrderReviewPage,
    CourseStudentTabsPage,
    MonitorOrderTabsPage,
    OrderInprogressPage,
    OrderCompletedPage,
    MonitorOrderTutorTabsPage,
    OrderInprogressTutorPage,
    OrderCompletedTutorPage,
    OrderTutorDetailPage,
    OrderStudentDetailPage,
    FrontTutorPage,
    TutorOpenedCityPage,
    TutorOpenedCoursePage,
    TutorOpenedCityAddPage,
    TutorOpenedCourseAddPage,
    SearchTutorByProgramPage,
    SearchTutorAllProgramPage,
    NotificationPage, NotifDetailPage,
    MailboxTabsPage, MailComposePage, MailDraftPage, MailInboxPage, MailOutboxPage, MailTrashPage,
    InvoicePaymentPage, PaymentConfirmationPage,
    OtestAssignmentListPage, OtestPreviewPage, OtestRunningPage, OtestResultPage,
    TutorCommissionPage,
    RunningCoursePage, PresenceListTutorPage, PresenceListStudentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
        tabsPlacement: 'top',
          platforms: {
            android: {
              tabsPlacement: 'top'
            },
            ios: {
              tabsPlacement: 'top'
            },
            windows:
            {
              tabsPlacement: 'top'
            }
          }
        }),
    HttpModule,
    TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'), 
            deps: [Http]
        }),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterUserPage,
    SignUpPage,
    SignupForm1Page,
    SignupForm2Page,
    PopPostPage,
    DashboardStudentPage,
    DashboardTutorPage,
    WizardAreaMengajarPage,
    WizardCourseProgramPage,
    WizardPersonalTutorPage,
    WizardPersonalStudentPage,
    WizardEducationTutorPage,
    BankAccountPage,
    ChangePasswordPage,
    FrontStudentPage,
    HelpTabsPage,
    HelpTellUsPage,
    HelpFaqPage,
    AccountTutorPage,
    AccountStudentPage,
    EditProfileStudentPage,
    EditProfileTutorPage,
    SearchTutorPage,
    OrderChooseTutorPage,
    OrderFormPage,
    OrderReviewPage,
    CourseStudentTabsPage,
    MonitorOrderTabsPage,
    OrderInprogressPage,
    OrderCompletedPage,
    MonitorOrderTutorTabsPage,
    OrderInprogressTutorPage,
    OrderCompletedTutorPage,
    OrderTutorDetailPage,
    OrderStudentDetailPage,
    FrontTutorPage,
    TutorOpenedCityPage,
    TutorOpenedCoursePage,
    TutorOpenedCityAddPage,
    TutorOpenedCourseAddPage,
    SearchTutorByProgramPage,
    SearchTutorAllProgramPage,
    NotificationPage, NotifDetailPage,
    MailboxTabsPage, MailComposePage, MailDraftPage, MailInboxPage, MailOutboxPage, MailTrashPage,
    InvoicePaymentPage, PaymentConfirmationPage,
    OtestAssignmentListPage, OtestPreviewPage, OtestRunningPage, OtestResultPage,
    TutorCommissionPage,
    RunningCoursePage, PresenceListTutorPage, PresenceListStudentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    Camera,
    File,
    FileTransfer,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
