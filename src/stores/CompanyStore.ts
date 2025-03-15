import { defineStore } from 'pinia';
import axios from 'axios';
import type { Company } from '@/types/CompanyTypes';

export const useCompanyStore = defineStore('CompanyStore', {
  state: () => ({
    currentCompany: null as Company | null,
    loading: false,
  }),
  actions: {
    async getCompanyById(companyId: string) {
      this.loading = true;
      try {
        const response = await axios.get(`/api/company/${companyId}`);
        this.currentCompany = response.data;
      } catch (error) {
        // Handle error
      } finally {
        this.loading = false;
      }
    },
    async updateCompany(companyId: string, company: Company) {
      this.loading = true;
      try {
        await axios.put(`/api/company/${companyId}`, company);
        this.getCompanyById(companyId);
      } catch (error) {
        // Handle error
      } finally {
        this.loading = false;
      }
    },
    async changePassword(companyId: string, currentPassword: string, newPassword: string) {
      this.loading = true;
      try {
        await axios.post(`/api/company/${companyId}/change-password`, {
          companyPassword: currentPassword,
          newPassword: newPassword,
        });
      } catch (error) {
        // Handle error
      } finally {
        this.loading = false;
      }
    },
  },
});
