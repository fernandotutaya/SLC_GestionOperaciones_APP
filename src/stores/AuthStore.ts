import { defineStore } from 'pinia';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

interface Company {
  _id: string;
  nombreLegal: string;
  sucursales: string[];
  plan: 'free' | 'pro' | 'enterprise';
}

interface Sucursal {
  _id: string;
  nombreSucursal: string;
  direccion: string;
}

interface AuthState {
  token: string | null;
  company: Company | null;
  sucursal: Sucursal | null;
}

export const useAuthStore = defineStore('AuthStore', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'), //Persistencia Basica
    company: null,
    sucursal: null

  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.company?.plan === 'pro'
  },

  actions: {
    async login(companyName: string, companyPassword: string) {
      try {
        const {data} = await axios.post('http://localhost:8080/api/auth/login', {companyName, companyPassword})
        
        //Guardar usuario y token
        this.token = data.token

        // Persistencia del token
        localStorage.setItem('token', data.token);

        // Configurar encabezados de autorización global
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        //Inicializar aplicacion
        await this.init()

      }
      catch(error){
        console.error('Inicio de sesion fallido:', error)
        throw error; // Lanzar el error para que pueda ser capturado en el componente
      }
    },

    //Traer datos de la compania y guardar en el state company
    async fetchCompany() {
      if (!this.token) return;

      try {
        // Configurar encabezados de autorización global
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        const decoded = jwtDecode<{ companyId: string }>(this.token);

        const { data } = await axios.get(`http://localhost:8080/api/company/${decoded.companyId}`);
        this.company = data;        
      } catch (error) {
        console.log("Error Buscando compania", error)
        console.log(axios.defaults.headers.common)
        // this.logout();
      }
    },

    async fetchSucursal() {
      if (!this.token || !this.company) return;
      
      // Verificar si hay sucursales
      if (!this.company.sucursales?.length) {
        console.error('No hay sucursales registradas');
        return;
      }
    
      try {
        //http://localhost:8080/api/:companyId/sucursales/:id
        const sucursalId = this.company.sucursales[0]; 
        const { data } = await axios.get(`http://localhost:8080/api/${this.company._id}/sucursales/${sucursalId}`);
        this.sucursal = data;
      } catch (error) { /* ... */ }
    },

    async changeSucursal(sucursalId: string) { // ← Recibir ID como parámetro
      if (!this.token) return;

      try {
        const { data } = await axios.get(`.../sucursal/${sucursalId}`);
        this.sucursal = data;
        // Actualizar token si es necesario
      } catch (error) {
        console.error(error)
      }
    },

    logout() {
      this.token = null;
      this.company = null;

      // Eliminar token de persistencia y encabezados
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];

      // Redireccionar a /login
      window.location.href = '/auth/login';
    },

    async init() {
      try {
        if (this.token) {
          await this.fetchCompany();
          await this.fetchSucursal();
          console.log("Company ID: ", this.company?._id)
          console.log("Sucursal ID: ", this.sucursal?._id)
        }
      } catch (error) {
        console.error('Error inicializando store:', error);
        // this.logout();
      }
    },

  }
})