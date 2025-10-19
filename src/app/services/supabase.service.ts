import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() {
    this.supabase = createClient(
      'https://wvxxoktyridtnznjjawh.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2eHhva3R5cmlkdG56bmpqYXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NjAyMTEsImV4cCI6MjA3NjQzNjIxMX0.mChV96oo--SDGU6Oiw_pzswsy_GEqjAa7mV0_JYuLok'
    );

    this.checkAuth();
  }

  private async checkAuth() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.isAuthenticated.next(!!session);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAuthState() {
    return this.isAuthenticated.asObservable();
  }

  setAuthState(state: boolean) {
    this.isAuthenticated.next(state);
  }
}