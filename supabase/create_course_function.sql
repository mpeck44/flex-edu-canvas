
-- This file is for documentation only - the function will be created directly in Supabase
-- Create a function that bypasses RLS and directly inserts courses
CREATE OR REPLACE FUNCTION public.create_course(
  p_title TEXT,
  p_description TEXT,
  p_instructor_id UUID,
  p_category TEXT,
  p_level TEXT,
  p_is_published BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_course_id UUID;
BEGIN
  INSERT INTO public.courses (
    title, 
    description, 
    instructor_id, 
    is_published
  ) VALUES (
    p_title, 
    p_description, 
    p_instructor_id, 
    p_is_published
  )
  RETURNING id INTO v_course_id;
  
  RETURN v_course_id;
END;
$$;
