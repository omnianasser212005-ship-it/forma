import { supabase } from './supabase';

export const submitServiceRequest = async (formData: any, files: Record<string, File | null>) => {
  try {
    const uniqueRequestId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const fileUrls: string[] = [];

    // 1. Upload each existing file to Supabase Storage
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uniqueRequestId}/${key}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('service-documents')
          .upload(fileName, file, {
            upsert: false
          });

        if (uploadError) {
          console.error(`Error uploading ${key}:`, uploadError);
          throw new Error(`Failed to upload ${key}: ${uploadError.message}`);
        }

        if (uploadData) {
          fileUrls.push(uploadData.path);
        }
      }
    }

    const insertPayload = {
      request_id: uniqueRequestId,
      service_name: formData.service || 'Unknown',
      phone: formData.phone || null,
      email: formData.email || null,
      age: parseInt(formData.age) || null,
      company: formData.company || null,
      company_type: formData.company_type || null,
      activity: formData.activity || null,
      capital: formData.capital || null,
      file_urls: fileUrls, 
      files_count: fileUrls.length,
      status: 'New'
    };

    const { data, error } = await supabase
      .from('service_requests')
      .insert([insertPayload]);

    if (error) throw error;

    return { success: true, message: "Request submitted successfully" };
  } catch(err: any) {
    console.error("Supabase Error:", err);
    return { success: false, message: err.message || "An error occurred" };
  }
};

export const getFileSignedUrl = async (path: string) => {
  const { data, error } = await supabase.storage
    .from('service-documents')
    .createSignedUrl(path, 3600); // 1 hour expiry
    
  if (error) throw error;
  return data.signedUrl;
};

export const getAllServiceRequests = async () => {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateRequestStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('service_requests')
    .update({ status })
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
