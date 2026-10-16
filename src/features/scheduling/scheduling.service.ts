import { supabase } from '../../lib/supabase/client';
import { buildAppointmentPayload, type AppointmentDraft, type AvailabilityRow } from './scheduling.logic';
export async function listPublicAvailability():Promise<AvailabilityRow[]>{if(!supabase)return[];const {data,error}=await supabase.from('availability').select('id,specific_date,weekday,start_time,end_time,service_type,capacity,is_active').eq('is_active',true);if(error)throw error;return (data??[]) as AvailabilityRow[];}
export async function createAppointmentRequest(draft:AppointmentDraft):Promise<string|null>{if(!supabase)return null;const {data,error}=await supabase.from('appointments').insert(buildAppointmentPayload(draft)).select('id').single();if(error)throw error;return data.id as string;}
