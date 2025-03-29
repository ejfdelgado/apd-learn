import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    fullScreen() {
        const element = document.documentElement; // Target the entire page
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if ((element as any)['mozRequestFullScreen']) { // Firefox
            (element as any)['mozRequestFullScreen']();
        } else if ((element as any)['webkitRequestFullscreen']) { // Chrome, Safari, and Opera
            (element as any)['webkitRequestFullscreen']();
        } else if ((element as any)['msRequestFullscreen']) { // IE/Edge
            (element as any)['msRequestFullscreen']();
        }
    }
}