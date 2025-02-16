import { Database } from "@/lib/database.types"
import ContactBrowserFactory from "@/lib/repositories/contacts/ContactBrowserFactory"
import { ContactFilterArray } from "@/lib/repositories/contacts/ContactRepository"
import { SupabaseClient } from "@supabase/supabase-js"

export const itemsPerPage = 10

export async function fetchData(supabase: SupabaseClient<Database>, options: {
    pageIndex: number
    pageSize: number
    searchFilter: string
}) {
    const contactRepository = ContactBrowserFactory.getInstance(supabase)
    const limit = options.pageSize;
    const offset = options.pageSize * options.pageIndex;
    let filter: ContactFilterArray | undefined = undefined
    if (options.searchFilter) {
        filter= [];
        filter.push({
            column: "profile_name",
            operator: "ilike",
            value: `%${options.searchFilter}%`
        })
    }
    const result = await contactRepository.getContacts(
        filter,
        { column: 'created_at', options: { ascending: false } },
        { limit: limit, offset: offset},
        true,
    )
    const pageCount = result.itemsCount ? Math.ceil(result.itemsCount / itemsPerPage) : -1;
    return {
        rows: result.rows,
        pageCount
    }
}