import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { signInWithRedirect } from 'aws-amplify/auth';

type PrestamoConLibro = {
  id: number; desde: string; hasta: string; devuelto: boolean;
  libro: { id: number; titulo: string; autor: string };
};

/**
 * El cascarón: la barra de navegación y el hueco donde el router pone la
 * página. No sabe nada de autenticación, y en el tramo 8 va a saber lo
 * mínimo.
 *
 * 🔨 **Tramo 8.8 y 8.10 · lo que te falta acá.** Cuando tengas sesión, este
 *    componente es el que lee `cognito:groups` y decide qué mostrar:
 *
 *        const { tokens } = await fetchAuthSession();
 *        const grupos = (tokens?.accessToken?.payload['cognito:groups'] ?? []) as string[];
 *        this.esBibliotecario.set(grupos.includes('bibliotecarios'));
 *
 *    Y con eso escondes el enlace de Préstamos al que no es bibliotecario.
 *
 *    **Hazlo** —al lector no le sirve ver una pantalla que no va a poder
 *    usar— pero que quede claro qué acabas de hacer: mejoraste la
 *    experiencia, **no la seguridad**. Cualquiera abre las herramientas del
 *    navegador y vuelve a mostrar ese enlace en dos segundos, porque ese
 *    código corre en **su** computador. Lo único que protege de verdad es el
 *    403 del tramo 7.4.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly http = inject(HttpClient);
  readonly panel = signal<PrestamoConLibro[]>([]);
  readonly cargando = signal(false);

  cargarPanel(): void {
    this.cargando.set(true);
    this.http
      .get<{ prestamos: PrestamoConLibro[] }>('http://localhost:8080/v1/panel')
      .subscribe({
        next: (r) => { this.panel.set(r.prestamos); this.cargando.set(false); },
        error: (e) => { console.error('el panel fallo:', e.status, e.error); this.cargando.set(false); },
      });
  }

  protected async entrar() {
    await signInWithRedirect();
  }
}