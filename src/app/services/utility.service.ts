import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    detectDevice() {
        const windowAny: any = window;
        const userAgent = navigator.userAgent || navigator.vendor || windowAny["opera"];
        // Check for mobile devices
        if (/android|iphone|ipad|ipod|windows phone/i.test(userAgent)) {
            return 'mobile';
        }

        // Default to desktop
        return 'desktop';
    }

    fullScreen(force: boolean = false) {
        if (!force) {
            if (this.detectDevice() == "desktop") {
                return;
            }
        }
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