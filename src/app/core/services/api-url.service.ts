import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

  // public static URL = 'http://temple.etechlab.in/api/service.php?op=';
  // public static URL = 'https://temple.igeektech.com/api/service.php?op=';
  public static URL = 'http://localhost/templewebservice/service.php?op=';
}
