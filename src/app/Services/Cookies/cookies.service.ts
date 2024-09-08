import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor()
  {
  }

  isAuthenticated(): boolean {
    const userCookie = this.getCookie('UserDataCookie2');
    return !!userCookie;
  }

  getUserRole(): string | undefined {
    const userCookie = this.getCookie('UserDataCookie2');
    if (userCookie) {
      try {
        const decodedCookie = decodeURIComponent(userCookie);
        const cnxinformation = atob(decodedCookie)
        const userInfo = JSON.parse(cnxinformation);
        return userInfo.Role;
      } catch (error) {
        console.error('Erreur lors du décodage du cookie :', error);
      }
    }
    return undefined;
  }

  getUserName(): string |undefined {
    const userCookie = this.getCookie('UserDataCookie2');
    if (userCookie) {
      try {
        const decodedCookie = decodeURIComponent(userCookie);
        const cnxinformation = atob(decodedCookie)
        const userInfo = JSON.parse(cnxinformation);
        return userInfo.Username;
      } catch (error) {
        console.error('Erreur lors du décodage du cookie :', error);
      }
    }
    return undefined;
  }

 getCookie(name: string): string | undefined {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return undefined;
  }
}
