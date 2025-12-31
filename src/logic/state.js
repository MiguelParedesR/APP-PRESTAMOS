import { reactive } from 'vue';

export const niveles = [
  { id: 1, label: 'Nivel 1', descripcion: 'Perfil en formacion' },
  { id: 2, label: 'Nivel 2', descripcion: 'Perfil consistente' },
  { id: 3, label: 'Nivel 3', descripcion: 'Perfil habilitado' }
];

export const state = reactive({
  estadoPerfil: 'observacion',
  nivelActual: 2,
  progresoConducta: 42,
  perfilHabilitado: false
});

export function setEstadoPerfil(estado) {
  state.estadoPerfil = estado;
}

export function setNivelActual(nivel) {
  state.nivelActual = nivel;
}

export function setProgresoConducta(progreso) {
  state.progresoConducta = progreso;
}

export function setPerfilHabilitado(valor) {
  state.perfilHabilitado = valor;
}
