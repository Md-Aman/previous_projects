import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule } from '@angular/material';

@NgModule({
  imports: [ MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule],
  exports: [ MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule],
})
export class MaterialModule { }
