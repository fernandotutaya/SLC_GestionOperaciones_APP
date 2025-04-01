import { defineStore } from 'pinia';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

// Use API_BASE_URL constant that uses environment variable
const API_BASE_URL = process.env.VITE_BASE_API;

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

// Add Register and Verification types
interface RegisterData {
  nombreLegal: string;
  companyName: string;
  companyPassword: string;
  email: string;
  ruc?: string;
  plan?: string;
  sucursales?: string[];
  estado?: boolean;
  logoUrl?: string;
  descripcion?: string;
  telefono?: string;
  direccion?: string;
}

interface VerificationData {
  email: string;
  verificationCode?: string;
}

interface PasswordResetData extends VerificationData {
  newPassword: string;
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
        const {data} = await axios.post(`${API_BASE_URL}/api/auth/login`, {companyName, companyPassword})
        
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
    
    // Register a new company with full details
    async registerFull(registerData: RegisterData) {
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, registerData);
        return data;
      } catch (error) {
        console.error('Error al registrar empresa:', error);
        throw error;
      }
    },
    
    // Register with minimal required data
    async registerMinimal(nombreLegal: string, companyName: string, companyPassword: string, email: string) {
      try {
        const registerData = {
          nombreLegal,
          companyName,
          companyPassword,
          email
        };
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, registerData);
        return data;
      } catch (error) {
        console.error('Error al registrar empresa:', error);
        throw error;
      }
    },
    
    // Request email verification code
    async requestVerificationCode(email: string) {
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/request-verification-code`, { email });
        return data;
      } catch (error) {
        console.error('Error al solicitar código de verificación:', error);
        throw error;
      }
    },
    
    // Verify email with verification code
    async verifyEmail(email: string, verificationCode: string) {
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/verify`, { email, verificationCode });
        return data;
      } catch (error) {
        console.error('Error al verificar código:', error);
        throw error;
      }
    },
    
    // Reset forgotten password
    async resetPassword(email: string, verificationCode: string, newPassword: string) {
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/forget-password`, { 
          email, 
          verificationCode, 
          newPassword 
        });
        return data;
      } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        throw error;
      }
    },

    //Traer datos de la compania y guardar en el state company
    async fetchCompany() {
      if (!this.token) return;

      try {
        // Configurar encabezados de autorización global
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        const decoded = jwtDecode<{ companyId: string }>(this.token);

        const { data } = await axios.get(`${API_BASE_URL}/api/company/${decoded.companyId}`);
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
        const sucursalId = this.company.sucursales[0]; 
        const { data } = await axios.get(`${API_BASE_URL}/api/${this.company._id}/sucursales/${sucursalId}`);
        this.sucursal = data;
      } catch (error) { 
        console.error('Error al obtener sucursal:', error);
      }
    },

    async changeSucursal(sucursalId: string) {
      if (!this.token || !this.company) return;

      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/${this.company._id}/sucursales/${sucursalId}`);
        this.sucursal = data;
      } catch (error) {
        console.error('Error al cambiar sucursal:', error);
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