import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-users-preview',
  templateUrl: './users-preview.component.html',
  styleUrls: ['./users-preview.component.css']
})
export class UsersPreviewComponent implements OnInit {

    userData: any = [];
    ProjectName = localStorage.getItem('project_name');
    url = '../../../../assets/app/media/img/users/img_avatar.png'; 
    // 'https://pbs.twimg.com/profile_images/920063296387944449/71cqAAP3.jpg';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.userData = this.data.userData;
    console.log(this.userData);
    if (this.userData.id > 0) {
        this.url = this.userData.profile_pic;
        if (this.url === '') {
            this.url = '../../../../assets/app/media/img/users/img_avatar.png';
        }
    }
  }

  IdPrint() {
    const printContent = document.getElementById('printuseridcard');
    console.log(printContent);
    const html = `<html>
                    <head>
                      <style>
                        body {
                          background-color: #ffffff;
                          font-family: 'sans-serif';
                          color: #575962;
                        }
                        .id-card-holder {
                            width: 233px;
                            padding: 4px;
                            margin: 0 auto;
                            background-color: #1f1f1f;
                            border-radius: 5px;
                            position: relative;
                        }
                        .id-card-holder:after {
                            content: '';
                            width: 7px;
                            display: block;
                            background-color: #0a0a0a;
                            height: 100px;
                            position: absolute;
                            top: 105px;
                            border-radius: 0 5px 5px 0;
                        }
                        .id-card-holder:before {
                            content: '';
                            width: 7px;
                            display: block;
                            background-color: #0a0a0a;
                            height: 100px;
                            position: absolute;
                            top: 105px;
                            left: 230px;
                            border-radius: 5px 0 0 5px;
                        }
                        .id-card {
                            background-color: #fff;
                            padding: 10px;
                            border-radius: 10px;
                            text-align: center;
                            box-shadow: 0 0 1.5px 0px #b9b9b9;
                        }
                        .id-card img {
                            margin: 0 auto;
                        }
                        .header {
                            font: 1.5em sans-serif;
                            text-align: center;
                        }
                        .photo img {
                            width: 80px;
                            margin-top: 15px;
                            text-align: center;
                        }
                        h2 {
                            font-size: 15px;
                            margin: 5px 0;
                            font-weight: 500;
                            line-height: 1.2;
                            color: inherit;
                            font-family: 'sans-serif';
                        }
                        h3 {
                            font-size: 12px;
                            margin: 2.5px 0;
                            font-weight: 300;
                        }
                        .qr-code img {
                            width: 50px;
                        }
                        p {
                            font-size: 12px;
                            margin: 2px;
                            font-family: 'sans-serif';
                            font-weight: 300;
                        }
                        .p-footer {
                            font-size: 11px;
                            margin: 1.5px;
                        }
                        .id-card-hook {
                            background-color: #000;
                            width: 70px;
                            margin: 0 auto;
                            height: 15px;
                            border-radius: 5px 5px 0 0;
                        }
                        .id-card-hook[_ngcontent-c20] {
                            background-color: #000;
                            width: 70px;
                            margin: 0 auto;
                            height: 15px;
                            border-radius: 5px 5px 0 0;
                        }
                        .id-card-hook:after {
                            content: '';
                            background-color: #ffffff;
                            width: 47px;
                            height: 6px;
                            display: block;
                            margin: 0px auto;
                            position: relative;
                            top: 6px;
                            border-radius: 4px;
                        }
                        .id-card-holder[_ngcontent-c20]:after {
                            content: '';
                            width: 7px;
                            display: block;
                            background-color: #0a0a0a;
                            height: 100px;
                            position: absolute;
                            top: 105px;
                            border-radius: 0 5px 5px 0;
                        }
                        .id-card-holder[_ngcontent-c20]:before {
                            content: '';
                            width: 7px;
                            display: block;
                            background-color: #0a0a0a;
                            height: 100px;
                            position: absolute;
                            top: 105px;
                            left: 222px;
                            border-radius: 5px 0 0 5px;
                        }
                        .id-card-hook[_ngcontent-c20]:after {
                            content: '';
                            background-color: #d7d6d3;
                            width: 47px;
                            height: 6px;
                            display: block;
                            margin: 0px auto;
                            position: relative;
                            top: 6px;
                            border-radius: 4px;
                        }
                        .id-card-holder[_ngcontent-c20] {
                            width: 233px;
                            padding: 4px;
                            margin: 0 auto;
                            background-color: #1f1f1f;
                            border-radius: 5px;
                            position: relative;
                        }
                        .user-detail {
                            margin-top: 0px;
                            margin-bottom: .5rem;
                            font-family: 'sans-serif';
                            font-weight: 300;
                            max-width: 71%;
                            text-align: left;
                            flex: 0 0 50%;
                            top: -10px;
                            position: relative;
                            width: 100%;
                        }
                        .col-md-6 {
                            padding-right: 15px;
                            padding-left: 15px;
                            flex: 0 0 50%;
                            max-width: 48%;
                            display: inline-block;
                            font-family: 'sans-serif';
                        }
                      </style>
                    </head>
                  <body>`;
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(html + printContent.innerHTML + '</body></html>');
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

}
