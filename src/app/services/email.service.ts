import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  
  
  private serviceId = 'service_l9sqkmk';
  private templateId = 'template_i8qgcmg';
  private userId = 'vKU_TlN6ZHFJB0e1h';

  constructor() {
    emailjs.init(this.userId);
    console.log('✅ EmailJS inicializado correctamente');
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<{success: boolean, message: string}> {
    try {
      console.log('🚀 Preparando envío de email a:', userEmail);

      // Validar que el email no esté vacío
      if (!userEmail || userEmail.trim() === '') {
        throw new Error('El email del destinatario está vacío');
      }

      // Validar formato de email básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        throw new Error('El formato del email no es válido');
      }

      const templateParams = {
        to_email: userEmail.trim(), 
        to_name: userName || 'Usuario EcoGarden', 
        from_name: 'EcoGarden Team',
        message: `¡Gracias por registrarte en EcoGarden, ${userName || 'Usuario'}! Estamos emocionados de tenerte en nuestra comunidad de amantes de las plantas.`,
        subject: '¡Bienvenido a EcoGarden!'
      };

      console.log('📤 Enviando email con parámetros:', templateParams);

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('✅ Email enviado exitosamente:', response);
      return {
        success: true,
        message: 'Email de bienvenida enviado correctamente'
      };

    } catch (error: any) {
      console.error('❌ Error detallado enviando email:', {
        status: error?.status,
        text: error?.text,
        userEmail: userEmail,
        userName: userName,
        error: error
      });
      
      let mensajeError = 'Error al enviar email de bienvenida';
      
      if (error?.text) {
        mensajeError = error.text;
      } else if (error?.message) {
        mensajeError = error.message;
      }
      
      return {
        success: false,
        message: mensajeError
      };
    }
  }

  // Método para probar la configuración
  async testEmailService(): Promise<{success: boolean, message: string}> {
    try {
      console.log('🧪 Probando servicio de email...');
      
      const testParams = {
        to_email: 'test@example.com',
        to_name: 'Usuario Test',
        from_name: 'EcoGarden Test',
        message: 'Esta es una prueba del servicio de email',
        subject: 'Prueba de Email Service'
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        testParams
      );

      console.log('✅ Prueba exitosa:', response);
      return {
        success: true,
        message: 'Servicio de email funcionando correctamente'
      };

    } catch (error: any) {
      console.error('❌ Error en prueba:', error);
      return {
        success: false,
        message: `Error en prueba: ${error?.text || error.message}`
      };
    }
  }
}