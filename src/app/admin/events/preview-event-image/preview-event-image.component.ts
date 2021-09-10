import { Component, OnInit, Inject } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatDialog,
  MatSnackBar,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatTableDataSource
} from '@angular/material';

@Component({
  selector: 'app-preview-event-image',
  templateUrl: './preview-event-image.component.html',
  styleUrls: ['./preview-event-image.component.css']
})
export class PreviewEventImageComponent implements OnInit {

  EventData: any = [];

  constructor(
    public dialogRef: MatDialogRef<PreviewEventImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.EventData = this.data.EventData;
  }

}
