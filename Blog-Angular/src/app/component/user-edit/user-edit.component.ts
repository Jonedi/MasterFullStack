import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';

@Component({
  selector: 'ba-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public url;
  public is_edit: boolean;
  public froala_options: Object = {
    placeholderText: 'Escribe tu biografía aquí',
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
  };

  public afuConfig = {
    multiple: false,
    formatsAllowed: '.jpg, .png, .gif, .jepg',
    maxSize: '50',
    uploadAPI:  {
      url: Global.url + 'user/upload',
      headers: {
        'Authorization': this._userService.getToken()
      }
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Subir imagen'
  };
  public resetVar = false;

  constructor(
    private _userService: UserService
  ) {
    this.page_title = 'Ajustes de Usuario';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;

    // Rellenar objeto usuario
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email, '',
      this.identity.description,
      this.identity.image
    );
  }

  ngOnInit(): void {
  }

  onSubmit(form) {
    this._userService.update(this.token, this.user).subscribe(
      response => {
        if (response && response.status) {
          console.log(response);
          this.status = 'success';

          // Actualizar usuario en sesión
          this.identity = this.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));
        } else {
            this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any> error);
      }
    );
  }

  avatarUpload(datos) {
    // console.log(datos);
    const data = JSON.parse(datos.response);
    this.user.image = data.image;
  }
}
