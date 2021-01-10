import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FileModel } from './Models/fileModel';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'File Uploader';
  files: Array<FileModel> = new Array<FileModel>();
  public progress: number = 0;
  public message: string = '';
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }
    const formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      let fileToUpload = <File>files[index];
      formData.append('file', fileToUpload, fileToUpload.name);
    }
    this.http.post('https://localhost:44306/api/upload/UploadFiles', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const total = event.total || 0;
          this.progress = Math.round(100 * event.loaded / total);
        }
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      });
  }
}
