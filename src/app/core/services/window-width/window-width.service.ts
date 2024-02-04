import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { map, distinctUntilChanged, startWith } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WindowWidthService {
  private windowWidth$: Observable<number>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.windowWidth$ = fromEvent(window, 'resize').pipe(
        map(event => (event.target as Window).innerWidth),
        startWith(window.innerWidth), // Adiciona o valor inicial da largura da janela
        distinctUntilChanged()
      );
    } else {
      this.windowWidth$ = of(0);
    }
  }

  getWindowWidth(): Observable<number> {
    return this.windowWidth$;
  }
}
