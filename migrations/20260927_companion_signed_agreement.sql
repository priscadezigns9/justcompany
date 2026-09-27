-- Allow the existing companion intake RPC to register video verification and signed agreement PDFs.
-- Keep all companion uploads restricted to their existing private intake path.
CREATE OR REPLACE FUNCTION public.jc_attach_companion_file(
    p_application_id uuid,
    p_storage_path text,
    p_attachment_type text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
    v_id uuid;
begin
    if p_storage_path not like 'intake/companions/%'
       or p_attachment_type not in (
           'id',
           'selfie',
           'police_certificate',
           'other',
           'video_verification',
           'signed_agreement'
       ) then
        raise exception 'Invalid companion file';
    end if;

    insert into public.jc_companion_application_attachments(
        application_id,
        storage_path,
        attachment_type
    )
    values (p_application_id, p_storage_path, p_attachment_type)
    returning id into v_id;

    return v_id;
end
$function$;
