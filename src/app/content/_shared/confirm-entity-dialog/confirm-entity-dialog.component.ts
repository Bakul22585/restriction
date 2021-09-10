import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-entity-dialog',
  templateUrl: './confirm-entity-dialog.component.html',
  styleUrls: ['./confirm-entity-dialog.component.css']
})
export class ConfirmEntityDialogComponent implements OnInit {

  viewLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmEntityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    /* Server loading imitation. Remove this */
    this.viewLoading = true;
    setTimeout(() => {
      this.dialogRef.close(true); // Keep only this row
    }, 2500);
  }

}
