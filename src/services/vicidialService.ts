
interface VicidialAgent {
  user: string;
  fullName: string;
  status: 'READY' | 'INCALL' | 'PAUSED' | 'DISPO' | 'QUEUE' | 'CLOSER';
  campaign: string;
  sessionId: string;
  loginTime: string;
  callsToday: number;
  talkTimeToday: number;
  pauseTimeToday: number;
  lastCallTime: number;
  server_ip: string;
  phone_login: string;
  phone_pass: string;
}

interface VicidialCall {
  uniqueid: string;
  server_ip: string;
  channel: string;
  phone_number: string;
  user: string;
  status: 'INCALL' | 'QUEUE' | 'PARK' | 'HANGUP';
  campaign_id: string;
  list_id: string;
  lead_id: string;
  start_time: string;
  end_time?: string;
  length_in_sec: number;
  term_reason: string;
}

interface VicidialLead {
  lead_id: string;
  entry_date: string;
  modify_date: string;
  status: string;
  user: string;
  vendor_lead_code: string;
  source_id: string;
  list_id: string;
  gmt_offset_now: string;
  called_since_last_reset: string;
  phone_code: string;
  phone_number: string;
  title: string;
  first_name: string;
  middle_initial: string;
  last_name: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  province: string;
  postal_code: string;
  country_code: string;
  gender: string;
  date_of_birth: string;
  alt_phone: string;
  email: string;
  security_phrase: string;
  comments: string;
  called_count: number;
  last_local_call_time: string;
  rank: string;
  owner: string;
}

interface VicidialCampaign {
  campaign_id: string;
  campaign_name: string;
  campaign_description: string;
  active: 'Y' | 'N';
  dial_method: 'MANUAL' | 'RATIO' | 'ADAPT_HARD_LIMIT' | 'ADAPT_TAPERED' | 'ADAPT_AVERAGE';
  auto_dial_level: number;
  max_inbound_calls: number;
  dial_timeout: number;
  dial_prefix: string;
  campaign_cid: string;
  campaign_vdad_exten: string;
  campaign_rec_exten: string;
  campaign_recording: string;
  campaign_vdstop_rec_exten: string;
  campaign_rec_filename: string;
  campaign_script: string;
  get_call_launch: string;
  am_message_exten: string;
  xferconf_a_dtmf: string;
  xferconf_a_number: string;
  xferconf_b_dtmf: string;
  xferconf_b_number: string;
  alt_number_dialing: string;
  scheduled_callbacks: string;
  campaign_allow_inbound: string;
  campaign_stats_update: number;
  phone_code: string;
  local_call_time: string;
  voicemail_ext: string;
  na_call_url: string;
  survey_method: string;
  survey_menu_qualify: string;
  survey_datestamp: string;
  survey_speech_filename: string;
  web_form_address: string;
  web_form_address_two: string;
  web_form_address_three: string;
  first_name_position: string;
  last_name_position: string;
  middle_initial_position: string;
  phone_number_position: string;
  user_group: string;
  use_internal_dnc: string;
  use_campaign_dnc: string;
  use_other_campaign_dnc: string;
  agent_pause_codes_active: string;
  agent_email: string;
  agent_choose_ingroups: string;
  closer_campaigns: string;
  use_auto_hopper: string;
  hopper_level: number;
  auto_hopper_multi: number;
  next_agent_call: string;
  lead_order_randomize: string;
  lead_order_secondary: string;
  per_call_notes: string;
  my_callback_option: string;
  agent_lead_search: string;
  agent_lead_search_method: string;
  queuemetrics_log_id: string;
  drop_call_seconds: number;
  drop_action: string;
  safe_harbor_audio: string;
  campaign_changedate: string;
  campaign_changeby: string;
  wrapup_seconds: number;
  wrapup_message: string;
  closer_default_blended: string;
  list_order_mix: string;
  expiration_date: string;
  agent_xfer_park_3way: string;
  dial_status_add_seconds: number;
  detail_stats_flag: string;
  arxecord_enable: string;
  arxrecord_hide_numbers: string;
  arxrecord_camptag: string;
  ivr_park_call: string;
  ivr_park_call_agi: string;
  ivr_park_delay: number;
  manual_dial_list_id: number;
  cpd_amd_action: string;
  agent_pause_codes_hidden: string;
  did_agent_log: string;
  did_ra_extensions_max: number;
  scheduled_callbacks_auto_reschedule: string;
  scheduled_callbacks_timezones_container: string;
  scheduled_callbacks_count_attempted: string;
  scheduled_callbacks_alert: string;
  callback_days_limit: number;
  callback_active_limit: number;
  callback_active_limit_override: string;
  three_way_call_cid: string;
  three_way_dial_prefix: string;
  customer_3way_hangup_logging: string;
  customer_3way_hangup_seconds: number;
  customer_3way_hangup_action: string;
  ivr_drop_inbound: string;
  default_xfer_group: string;
  api_manual_dial: string;
  api_max_dial_timeout: number;
  pause_after_each_call: string;
  disable_alter_custphone: string;
  disable_alter_custdata: string;
  disable_alter_custphone_tz: string;
  disable_dispo_screen: string;
  disable_dispo_status: string;
  auto_pause_precall: string;
  auto_pause_precall_code: string;
  vtiger_search_dead_ratio: number;
  vtiger_search_dead_trigger: number;
  agent_allow_group_alias: string;
  default_group_alias: string;
  quick_transfer_button: string;
  prepopulate_transfer_preset: string;
  hide_call_log_info: string;
  agent_xfer_consultative: string;
  agent_xfer_dial_override: string;
  agent_xfer_vm_transfer: string;
  agent_xfer_dial_with_customer: string;
  agent_xfer_park_customer_dial: string;
  agent_fullscreen: string;
  agent_status_view: string;
  agent_status_view_time: number;
  agent_whisper_enabled: string;
  agent_choose_territories: string;
  user_group_two: string;
  timer_action: string;
  timer_action_message: string;
  timer_action_seconds: number;
  start_call_url: string;
  dispo_call_url: string;
  xferconf_c_number: string;
  xferconf_d_number: string;
  xferconf_e_number: string;
  timer_action_destination: string;
  waitforsilence_options: string;
  agent_auto_logout_time: number;
  callback_useronly_move_minutes: number;
  callback_list_calltime: string;
  agent_clipboard_copy: string;
  browser_alert_sound: string;
  browser_alert_volume: number;
  scheduled_callbacks_force_dial: string;
  scheduled_callbacks_local_web: string;
  realtime_ring_agent_delay: number;
  vicidial_agent_disable: string;
  manual_dial_override: string;
  blind_monitor_warning: string;
  blind_monitor_message: string;
  blind_monitor_filename: string;
  inbound_man_timeclock_id: string;
  use_custom_cid: string;
  scheduled_callbacks_count: string;
  container_entry: string;
  web_form_target: string;
  daily_call_count_limit: number;
  daily_limit_manual: string;
  ignore_list_script_override: string;
  extension_appended_cidname: string;
  callcard_enabled: string;
  inventory_report: string;
  wrapup_bypass: string;
  wrapup_after_hotkey: string;
  cache_count_test: number;
  nocall_dial_flag: string;
  three_way_record_stop: string;
  three_way_record_start: string;
  alt_log_server_ip: string;
  alt_log_dbname: string;
  alt_log_login: string;
  alt_log_pass: string;
  script_tab_toggle: string;
  campaign_script_two: string;
  get_call_launch_third: string;
  get_call_launch_second: string;
  campaign_script_three: string;
  agent_allow_chat: string;
  default_phone_code: string;
  agent_screen_colors: string;
  campaign_login_date: string;
  campaign_day_start: string;
  campaign_day_stop: string;
  qualify_sql: string;
  whereami: string;
  inbound_popup: string;
  inbound_popup_type: string;
  inbound_man_timeclock_id_two: string;
  inbound_man_timeclock_id_three: string;
  inbound_man_timeclock_id_four: string;
  inbound_man_timeclock_id_five: string;
  manual_dial_validation: string;
  container_id: string;
  noanswer_log: string;
}

class VicidialService {
  private baseUrl: string;
  private apiKey: string;
  private database: string;

  constructor() {
    this.baseUrl = process.env.VICIDIAL_API_URL || 'http://localhost/vicidial';
    this.apiKey = process.env.VICIDIAL_API_KEY || 'demo_api_key';
    this.database = process.env.VICIDIAL_DB || 'asterisk';
  }

  // Método para hacer llamadas a la API de Vicidial
  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}/api/${endpoint}`);
    url.searchParams.append('source', 'CCD_CRM');
    url.searchParams.append('user', params.user || 'admin');
    url.searchParams.append('pass', params.pass || this.apiKey);
    url.searchParams.append('function', endpoint);
    
    Object.keys(params).forEach(key => {
      if (key !== 'user' && key !== 'pass') {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const response = await fetch(url.toString());
      const data = await response.text();
      
      // Parsear respuesta de Vicidial (generalmente en formato pipe-separated)
      return this.parseVicidialResponse(data);
    } catch (error) {
      console.error('Error al conectar con Vicidial:', error);
      // Devolver datos simulados si no hay conexión
      return this.getSimulatedData(endpoint, params);
    }
  }

  private parseVicidialResponse(data: string): any {
    const lines = data.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split('|');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('|');
      const obj: any = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      
      result.push(obj);
    }

    return result;
  }

  private getSimulatedData(endpoint: string, params: any): any {
    // Datos simulados para demostración
    switch (endpoint) {
      case 'agent_status':
        return this.getSimulatedAgents();
      case 'logged_in_agents':
        return this.getSimulatedLoggedInAgents();
      case 'campaign_stats':
        return this.getSimulatedCampaignStats();
      case 'lead_search':
        return this.getSimulatedLeads(params);
      case 'call_log':
        return this.getSimulatedCallLog(params);
      default:
        return [];
    }
  }

  // Obtener estado de todos los agentes
  async getAgentStatus(): Promise<VicidialAgent[]> {
    const data = await this.makeRequest('agent_status');
    return data.map((agent: any) => ({
      user: agent.user || agent.User,
      fullName: agent.full_name || agent.FullName || `${agent.first_name} ${agent.last_name}`,
      status: agent.status || agent.Status || 'READY',
      campaign: agent.campaign_id || agent.Campaign,
      sessionId: agent.session_id || agent.SessionID,
      loginTime: agent.login_time || agent.LoginTime,
      callsToday: parseInt(agent.calls_today || agent.CallsToday) || 0,
      talkTimeToday: parseInt(agent.talk_time_today || agent.TalkTimeToday) || 0,
      pauseTimeToday: parseInt(agent.pause_time_today || agent.PauseTimeToday) || 0,
      lastCallTime: parseInt(agent.last_call_time || agent.LastCallTime) || 0,
      server_ip: agent.server_ip || agent.ServerIP,
      phone_login: agent.phone_login || agent.PhoneLogin,
      phone_pass: agent.phone_pass || agent.PhonePass
    }));
  }

  // Obtener agentes conectados
  async getLoggedInAgents(): Promise<VicidialAgent[]> {
    const data = await this.makeRequest('logged_in_agents');
    return data.map((agent: any) => ({
      user: agent.user,
      fullName: agent.full_name,
      status: agent.status,
      campaign: agent.campaign_id,
      sessionId: agent.session_id,
      loginTime: agent.login_time,
      callsToday: parseInt(agent.calls_today) || 0,
      talkTimeToday: parseInt(agent.talk_time_today) || 0,
      pauseTimeToday: parseInt(agent.pause_time_today) || 0,
      lastCallTime: parseInt(agent.last_call_time) || 0,
      server_ip: agent.server_ip,
      phone_login: agent.phone_login,
      phone_pass: agent.phone_pass
    }));
  }

  // Obtener estadísticas de campaña
  async getCampaignStats(campaignId?: string): Promise<any> {
    const params = campaignId ? { campaign_id: campaignId } : {};
    return await this.makeRequest('campaign_stats', params);
  }

  // Buscar leads
  async searchLeads(params: {
    phone_number?: string;
    lead_id?: string;
    vendor_lead_code?: string;
    list_id?: string;
    campaign_id?: string;
    status?: string;
    user?: string;
    records?: number;
  }): Promise<VicidialLead[]> {
    const data = await this.makeRequest('lead_search', params);
    return data.map((lead: any) => ({
      lead_id: lead.lead_id,
      entry_date: lead.entry_date,
      modify_date: lead.modify_date,
      status: lead.status,
      user: lead.user,
      vendor_lead_code: lead.vendor_lead_code,
      source_id: lead.source_id,
      list_id: lead.list_id,
      gmt_offset_now: lead.gmt_offset_now,
      called_since_last_reset: lead.called_since_last_reset,
      phone_code: lead.phone_code,
      phone_number: lead.phone_number,
      title: lead.title,
      first_name: lead.first_name,
      middle_initial: lead.middle_initial,
      last_name: lead.last_name,
      address1: lead.address1,
      address2: lead.address2,
      address3: lead.address3,
      city: lead.city,
      state: lead.state,
      province: lead.province,
      postal_code: lead.postal_code,
      country_code: lead.country_code,
      gender: lead.gender,
      date_of_birth: lead.date_of_birth,
      alt_phone: lead.alt_phone,
      email: lead.email,
      security_phrase: lead.security_phrase,
      comments: lead.comments,
      called_count: parseInt(lead.called_count) || 0,
      last_local_call_time: lead.last_local_call_time,
      rank: lead.rank,
      owner: lead.owner
    }));
  }

  // Obtener log de llamadas
  async getCallLog(params: {
    start_date: string;
    end_date: string;
    user?: string;
    campaign_id?: string;
    phone_number?: string;
    lead_id?: string;
    records?: number;
  }): Promise<VicidialCall[]> {
    const data = await this.makeRequest('call_log', params);
    return data.map((call: any) => ({
      uniqueid: call.uniqueid,
      server_ip: call.server_ip,
      channel: call.channel,
      phone_number: call.phone_number,
      user: call.user,
      status: call.status,
      campaign_id: call.campaign_id,
      list_id: call.list_id,
      lead_id: call.lead_id,
      start_time: call.start_time,
      end_time: call.end_time,
      length_in_sec: parseInt(call.length_in_sec) || 0,
      term_reason: call.term_reason
    }));
  }

  // Actualizar status de un lead
  async updateLeadStatus(params: {
    lead_id: string;
    status: string;
    user: string;
    vendor_lead_code?: string;
    callback_datetime?: string;
    callback_type?: string;
    callback_user?: string;
    callback_comments?: string;
  }): Promise<any> {
    return await this.makeRequest('update_lead', params);
  }

  // Iniciar llamada manual
  async initiateManualCall(params: {
    phone_number: string;
    user: string;
    campaign?: string;
    lead_id?: string;
    list_id?: string;
    phone_code?: string;
    search?: string;
    preview?: string;
    focus?: string;
  }): Promise<any> {
    return await this.makeRequest('originate_call', params);
  }

  // Pausar/despausar agente
  async pauseAgent(params: {
    user: string;
    pause_code?: string;
    manager_override?: string;
  }): Promise<any> {
    return await this.makeRequest('agent_pause', params);
  }

  async unpauseAgent(params: {
    user: string;
  }): Promise<any> {
    return await this.makeRequest('agent_unpause', params);
  }

  // Obtener campañas activas
  async getActiveCampaigns(): Promise<VicidialCampaign[]> {
    const data = await this.makeRequest('campaign_detail', { active: 'Y' });
    return data;
  }

  // Datos simulados para demostración
  private getSimulatedAgents(): any[] {
    return [
      {
        user: 'asesor1',
        full_name: 'María González',
        status: 'READY',
        campaign_id: 'VENTAS_PREMIUM',
        session_id: 'session123',
        login_time: '2024-01-15 08:00:00',
        calls_today: '45',
        talk_time_today: '3600',
        pause_time_today: '300',
        last_call_time: '180',
        server_ip: '192.168.1.100',
        phone_login: '8001',
        phone_pass: 'pass123'
      },
      {
        user: 'asesor2',
        full_name: 'Carlos Rodríguez',
        status: 'INCALL',
        campaign_id: 'VENTAS_PREMIUM',
        session_id: 'session124',
        login_time: '2024-01-15 08:15:00',
        calls_today: '38',
        talk_time_today: '3200',
        pause_time_today: '450',
        last_call_time: '0',
        server_ip: '192.168.1.100',
        phone_login: '8002',
        phone_pass: 'pass124'
      }
    ];
  }

  private getSimulatedLoggedInAgents(): any[] {
    return this.getSimulatedAgents().filter(agent => agent.status !== 'LOGOUT');
  }

  private getSimulatedCampaignStats(): any[] {
    return [
      {
        campaign_id: 'VENTAS_PREMIUM',
        campaign_name: 'Ventas Premium',
        calls_today: '150',
        answered_today: '120',
        drops_today: '8',
        status_A: '25',
        status_B: '45',
        status_SALE: '12',
        agents_logged_in: '8',
        leads_in_hopper: '1250'
      }
    ];
  }

  private getSimulatedLeads(params: any): any[] {
    return [
      {
        lead_id: '1001',
        entry_date: '2024-01-15 10:30:00',
        modify_date: '2024-01-15 14:22:00',
        status: 'NEW',
        user: '',
        vendor_lead_code: 'LC001_FB_2024',
        source_id: 'FACEBOOK',
        list_id: '101',
        gmt_offset_now: '-5.00',
        called_since_last_reset: 'Y',
        phone_code: '57',
        phone_number: '3001234567',
        title: 'Sr.',
        first_name: 'Juan',
        middle_initial: 'C',
        last_name: 'Pérez',
        address1: 'Calle 123 #45-67',
        address2: 'Apto 301',
        address3: '',
        city: 'Bogotá',
        state: 'DC',
        province: 'Cundinamarca',
        postal_code: '110111',
        country_code: 'CO',
        gender: 'M',
        date_of_birth: '1985-05-15',
        alt_phone: '3109876543',
        email: 'juan.perez@email.com',
        security_phrase: 'MASCOTA123',
        comments: 'Interesado en promoción de seguros de vida. Contactar entre 2-6 PM',
        called_count: 0,
        last_local_call_time: '0000-00-00 00:00:00',
        rank: '0',
        owner: ''
      }
    ];
  }

  private getSimulatedCallLog(params: any): any[] {
    return [
      {
        uniqueid: '1642234567.123',
        server_ip: '192.168.1.100',
        channel: 'SIP/8001-00000001',
        phone_number: '3001234567',
        user: 'asesor1',
        status: 'HANGUP',
        campaign_id: 'VENTAS_PREMIUM',
        list_id: '101',
        lead_id: '1001',
        start_time: '2024-01-15 14:20:00',
        end_time: '2024-01-15 14:25:30',
        length_in_sec: '330',
        term_reason: 'AGENT'
      }
    ];
  }
}

export const vicidialService = new VicidialService();
export type { VicidialAgent, VicidialCall, VicidialLead, VicidialCampaign };
