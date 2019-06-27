import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentModule } from '@shared/components/common/common.component.module';
import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { PageComponent } from './page/page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    EmailTemplateRoutingModule,
    CommonComponentModule
  ],
  entryComponents: [
    CreateComponent
  ],
  declarations: [
    ListComponent,
    CreateComponent,
    PageComponent,
  ]
})
export class EmailTemplateModule { }
