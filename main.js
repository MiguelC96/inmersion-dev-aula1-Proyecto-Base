    // Clase generadora de contraseñas
    class GeneradorContrasena {
        constructor(longitudMinima = 4) {
            this.longitudMinima = longitudMinima;
            this.caracteres = {
                minusculas: 'abcdefghijklmnopqrstuvwxyz',
                mayusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                numeros: '0123456789',
                especiales: '!@#$%^&*()_+[]{}|;:,.<>?'
            };
        }

        generar(longitud) {
            if (longitud < this.longitudMinima) {
                throw new Error(`La longitud mínima es ${this.longitudMinima} caracteres.`);
            }

            let contrasena = '';
            const todasLasCategorias = this._obtenerCaracteresDisponibles();

            for (let i = 0; i < longitud; i++) {
                const randomIndex = Math.floor(Math.random() * todasLasCategorias.length);
                contrasena += todasLasCategorias[randomIndex];
            }

            return contrasena;
        }

        _obtenerCaracteresDisponibles() {
            return this.caracteres.minusculas + this.caracteres.mayusculas + this.caracteres.numeros + this.caracteres.especiales;
        }
    }

    // Clase para evaluar la fortaleza de la contraseña
    class ValidadorFortaleza {
        constructor(contrasena) {
            this.contrasena = contrasena;
            this.fuerza = 0;
        }

        evaluar() {
            this._comprobarMinusculas();
            this._comprobarMayusculas();
            this._comprobarNumeros();
            this._comprobarEspeciales();

            return this._determinarFortaleza();
        }

        _comprobarMinusculas() {
            if (/[a-z]/.test(this.contrasena)) this.fuerza++;
        }

        _comprobarMayusculas() {
            if (/[A-Z]/.test(this.contrasena)) this.fuerza++;
        }

        _comprobarNumeros() {
            if (/[0-9]/.test(this.contrasena)) this.fuerza++;
        }

        _comprobarEspeciales() {
            if (/[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(this.contrasena)) this.fuerza++;
        }

        _determinarFortaleza() {
            let mensaje;
            let tipoAlerta;

            if (this.contrasena.length >= 8 && this.fuerza >= 3) {
                mensaje = 'Fuerte';
                tipoAlerta = 'success';
            } else if (this.contrasena.length >= 5 && this.fuerza >= 2) {
                mensaje = 'Media';
                tipoAlerta = 'warning';
            } else {
                mensaje = 'Débil';
                tipoAlerta = 'error';
            }

            return { mensaje, tipoAlerta };
        }
    }

    // Clase controladora de UI
    class ControladorUI {
        static mostrarContrasena(contrasena) {
            document.getElementById('contrasena').value = contrasena;
        }

        static mostrarMensajeFortaleza(fortaleza) {
            const inputContrasena = document.getElementById('contrasena');
            inputContrasena.style.borderColor = fortaleza.tipoAlerta === 'success' ? 'green' : 
                                                fortaleza.tipoAlerta === 'warning' ? 'orange' : 'red';

            GestorAlertas.mostrarAlertas(fortaleza.tipoAlerta, `Fuerza de la contraseña: ${fortaleza.mensaje}`);
        }

        static restablecerEstado() {
            const contrasenaInput = document.getElementById('contrasena');
            contrasenaInput.value = '';
            contrasenaInput.style.borderColor = '';
            document.getElementById('cantidad').value = '';
        }

        static obtenerLongitud() {
            const longitud = document.getElementById('cantidad').value;
            return parseInt(longitud) || 4; 
        }
    }

    // Función para copiar al portapapeles
    function copiarContrasena() {
        const contrasenaInput = document.getElementById('contrasena');
        
        
        contrasenaInput.select();
        contrasenaInput.setSelectionRange(0, 99999); // Para dispositivos móviles
    
        
        try {
            const exitoso = document.execCommand('copy');
            if (exitoso) {
                GestorAlertas.mostrarAlertas('success', 'Contraseña copiada al portapapeles.');
            } else {
                GestorAlertas.mostrarAlertas('error', 'No se pudo copiar la contraseña.');
            }
        } catch (err) {
            GestorAlertas.mostrarAlertas('error', 'No se pudo copiar la contraseña.');
        }
        
        // Restablecer el estado del contenedor
        ControladorUI.restablecerEstado();
    }
    

    document.getElementById('copiar-contrasena').addEventListener('click', copiarContrasena);


    // Clase para gestionar alertas
    class GestorAlertas {
        static mostrarAlertas(tipo, mensaje) {
            const alertContainer = document.getElementById('alert-container');

            const alertDiv = document.createElement('div');
            alertDiv.classList.add('alert', tipo, 'show');

            alertDiv.innerHTML = `
                <span>${mensaje}</span>
                <button class="close-btn" onclick="GestorAlertas.cerrarAlertas(this)">×</button>
            `;

            alertContainer.appendChild(alertDiv);

            setTimeout(() => {
                GestorAlertas.cerrarAlertas(alertDiv);
            }, 5000);
        }

        static cerrarAlertas(element) {
            element.classList.add('hide');
            
            setTimeout(() => {
                element.remove();
            }, 300); 
        }
    }


    // Evento del botón de generar
    document.getElementById('generar').addEventListener('click', function() {
        try {
            const longitud = ControladorUI.obtenerLongitud();
            const generador = new GeneradorContrasena();
            const contrasena = generador.generar(longitud);

            ControladorUI.mostrarContrasena(contrasena);

            const validador = new ValidadorFortaleza(contrasena);
            const fortaleza = validador.evaluar();

            ControladorUI.mostrarMensajeFortaleza(fortaleza);
        } catch (error) {
            GestorAlertas.mostrarAlertas('error', error.message);
        }
    });
