// @/service/OperationService.ts

import type { Operation } from '@/types/OperationTypes'; // Asume que tienes tus tipos definidos en un archivo separado

export class OperationService {
    private static baseUrl = `${import.meta.env.BASE_API}`;

    static async getOperations(companyId: string, sucursalId: string): Promise<Operation[]> {
        try {
            const response = await fetch(`${this.baseUrl}/${companyId}/operaciones/${sucursalId}`);
            if (!response.ok) {
                throw new Error('Error al obtener operaciones');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    static async updateOperation(companyId: string, operationId: string, operation: Partial<Operation>): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${companyId}/operaciones/${operationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(operation)
            });
            
            if (!response.ok) {
                throw new Error('Error al actualizar operación');
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    static async createOperation(companyId: string, sucursalId: string, operation: Omit<Operation, 'id'>): Promise<Operation> {
        try {
            const response = await fetch(`${this.baseUrl}/${companyId}/operaciones/${sucursalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(operation)
            });

            if (!response.ok) {
                throw new Error('Error al crear operación');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    static async deleteOperation(companyId: string, operationId: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${companyId}/operaciones/${operationId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar operación');
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}