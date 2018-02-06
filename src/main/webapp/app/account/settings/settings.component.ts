import { Component, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { Principal, AccountService, JhiLanguageHelper } from '../../shared';

@Component({
    selector: 'jhi-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

    picture: any = null;

    error: string;
    success: string;
    settingsAccount: any;
    languages: any[];

    constructor(
        private account: AccountService,
        private principal: Principal,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.settingsAccount = this.copyAccount(account);
        });
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });
    }

    saveAccountInfo() {
        this.account.save(this.settingsAccount).subscribe(() => {
            this.error = null;
            this.success = 'OK';
            this.principal.identity(true).then((account) => {
                this.settingsAccount = this.copyAccount(account);
            });
            this.languageService.getCurrent().then((current) => {
                if (this.settingsAccount.langKey !== current) {
                    this.languageService.changeLanguage(this.settingsAccount.langKey);
                }
            });
        }, () => {
            this.success = null;
            this.error = 'ERROR';
        });
    }

    save() {
        if (this.picture) {
            this.account.uploadPiture(this.picture).subscribe(
                () => {
                    this.error = null;
                    this.success = 'OK';
                    this.settingsAccount.imageUrl = this.account.getPictureUrl(this.picture.name);
                    this.saveAccountInfo();
                },
                (err) => {
                    this.success = null;
                    this.error = 'ERROR';
                }
            );
        } else {
            this.saveAccountInfo();
        }
    }

    copyAccount(account) {
        return {
            activated: account.activated,
            email: account.email,
            firstName: account.firstName,
            langKey: account.langKey,
            lastName: account.lastName,
            login: account.login,
            imageUrl: account.imageUrl
        };
    }

    getFullImageUrl(imageUrl: string): string {
        if (imageUrl && imageUrl.indexOf('data:') === 0) {
            return imageUrl;
        } else {
            return 'content/images/logo-jhipster.png';
        }
    }

    onImageChange(event) {
        this.picture = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.settingsAccount.imageUrl = reader.result;
        });

        if (this.picture) {
            reader.readAsDataURL(this.picture);
        }
    }

}
