import { SupabaseClient } from "@supabase/supabase-js";
import { FinalError } from "../types/component.types";

export interface AssignRoleResult {
  success: boolean;
  message: string;
}

export const assignRole = async (
  supabaseClient: SupabaseClient,
  id: string
): Promise<AssignRoleResult> => {
  if (id) {
    let isError = false;
    let finalError: FinalError | null = null;
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select()
      .eq("user_id", id)
      .limit(1);

    if (roleError) {
      isError = true;
      finalError = roleError as FinalError;
    }

    if (!roleData?.length) {
      const { error: insertError } = await supabaseClient
        .from("user_roles")
        .insert({ user_id: id, role: "basic" });

      if (insertError) {
        isError = true;
        finalError = insertError as FinalError;
      }
    }

    return {
      success: !isError,
      message: finalError
        ? finalError.message || "role assign error"
        : "role assigned",
    };
  }

  return {
    success: false,
    message: 'no id for role assign'
  };
};
